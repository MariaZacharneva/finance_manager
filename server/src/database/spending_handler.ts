import {DatabaseManager} from "./database_manager";
import {logDebug, logError, logInfo} from "../utils/logger";
import {HttpError, PostgresError} from "../utils/error_types";
import {ErrorCode, ErrorString, PostgresErrorCode, PostgresErrorString} from "../utils/error_messages";
import {Utils} from "../utils/utils";
import FormatDate = Utils.FormatDate;

export class SpendingHandler {
  private dbManager: DatabaseManager;

  public constructor(dbManager: DatabaseManager) {
    this.dbManager = dbManager;
  }

  public async addSpending(user_id: number, description: string, value: number, currency: string, date: number): Promise<number> {
    const queryString = "INSERT INTO spendings (user_id, description, value, currency, date) VALUES ($1, $2, $3, $4, $5) RETURNING spending_id;";
    const queryValues = [user_id, description, value, currency, date];
    try {
      const rows = (await this.dbManager.query(queryString, queryValues)).rows;
      return rows[0].spending_id;
    } catch (err) {
      if (err instanceof PostgresError && err.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new PostgresError(PostgresErrorCode.ForeignKeyViolation, PostgresErrorString.ForeignKeyViolation);
      } else {
        throw err;
      }
    }
  }

  public async updateSpending(user_id: number, spending_id: number, description: string, value: number, currency: string, date: Date) {
    const queryString = "UPDATE spendings SET description = $1, value = $2, currency = $3, date = $4 WHERE user_id = $5 AND spending_id = $6;";
    const queryValues = [description, value, currency, date, user_id, spending_id];
    await this.dbManager.query(queryString, queryValues);
  }

  public async deleteSpending(user_id: number, spending_id: number) {
    const queryString = "DELETE FROM spendings WHERE user_id = $1 AND spending_id = $2;";
    const queryValues = [user_id, spending_id];
    await this.dbManager.query(queryString, queryValues);
  }

  public async checkUserRights(user_id: number, spending_id: number) {
    const queryString = "SELECT user_id FROM spendings WHERE spending_id = $1;";
    const queryValues = [spending_id];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    if (rows.length === 0) {
      throw new HttpError(ErrorCode.BadRequest, ErrorString.ObjectDoesNotExist);
    }
    if (user_id !== rows[0].user_id) {
      throw new HttpError(ErrorCode.Forbidden, ErrorString.NotEnoughRights);
    }
  }

  public async addSpendingToCategory(user_id: number, spending_id: number, category_id: number) {
    await this.checkUserRights(user_id, spending_id);
    await this.dbManager.categoryHandler.checkUserRights(user_id, category_id);
    const queryString = "INSERT INTO spendings_to_categories (spending_id, category_id, group_id, user_id) VALUES ($1, $2, (SELECT group_id FROM categories WHERE category_id = $2 AND user_id = $3 LIMIT 1), $3);";
    const queryValues = [spending_id, category_id, user_id];
    await this.dbManager.query(queryString, queryValues);
  }

  public async getAllSpendingsForUser(user_id: number): Promise<{
    spendings: {
      spending_id: number,
      description: string,
      value: number,
      currency: string,
      date: number
    }[]
  }> {
    const queryString = "SELECT spending_id, description, value, currency, date FROM spendings WHERE user_id = $1;";
    const queryValues = [user_id];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    return {spendings: rows};
  }

  public async getSpendingInfo(user_id: number, spending_id: number): Promise<{
    spending_id: number,
    description: string,
    value: number,
    currency: string,
    date: number,
    categories: {
      category_id: number,
      category_description: string,
      group_id: number,
      group_description: string,
    }[]
  }> {
    const queryString1 = "SELECT spending_id, description, value, currency, date FROM spendings WHERE user_id = $1 AND spending_id = $2;";
    const queryValues1 = [user_id, spending_id];
    const rows = (await this.dbManager.query(queryString1, queryValues1)).rows;
    if (rows.length === 0) {
      throw new HttpError(ErrorCode.BadRequest, ErrorString.ObjectDoesNotExist);
    }
    const queryString2 = "SELECT categories.category_id, categories.description AS \"category_description\", groups.group_id, groups.description AS \"group_description\" FROM ((spendings_to_categories INNER JOIN categories ON spendings_to_categories.category_id = categories.category_id) INNER JOIN groups ON spendings_to_categories.group_id = groups.group_id) WHERE spendings_to_categories.user_id = $1 AND spendings_to_categories.spending_id = $2;";
    const queryValues2 = [user_id, spending_id];
    const spending_info = rows[0];
    const category_info = (await this.dbManager.query(queryString2, queryValues2)).rows;
    return {
      spending_id: spending_info.spending_id,
      description: spending_info.description,
      value: spending_info.value,
      currency: spending_info.currency,
      date: spending_info.date,
      categories: category_info
    };
  }
}
