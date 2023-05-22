import {DatabaseManager} from "./database_manager";
import {HttpError} from "../utils/error_types";
import {ErrorCode, ErrorString,} from "../utils/error_messages";
import {logError, logInfo} from "../utils/logger";

export class SpendingHandler {
  private dbManager: DatabaseManager;

  public constructor(dbManager: DatabaseManager) {
    this.dbManager = dbManager;
  }

  public async addSpending(user_id: number, description: string, value: number, currency: string,
                           date: string): Promise<{
    spending_id: number,
    description: string,
    value: number,
    currency: string,
    date: string
  }> {
    const queryString = "INSERT INTO spendings (user_id, description, value, currency, date) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
    const queryValues = [user_id, description, value, currency, date];
    try {
      const rows = (await this.dbManager.query(queryString, queryValues)).rows;
      return rows[0];
    } catch (err) {
      throw err;
    }
  }


  public async updateSpending(user_id: number, spending_id: number, description: string,
                              value: number, currency: string, date: string): Promise<{
    new_spending: {
      spending_id: number,
      description: string,
      value: number,
      currency: string,
      date: string
    }
  }> {
    try {
      await this.dbManager.query("BEGIN;");
      await this.checkUserRights(user_id, spending_id);
      const queryString = "UPDATE spendings SET description = $1, value = $2, currency = $3, date = $4 WHERE spending_id = $5 RETURNING *;";
      const queryValues = [description, value, currency, date, spending_id];
      const rows = (await this.dbManager.query(queryString, queryValues)).rows;
      await this.dbManager.query("COMMIT;");
      return rows[0];
    } catch (err) {
      logError("Rollback: updateSpending fail");
      await this.dbManager.query("ROLLBACK;");
      throw err;
    }
  }

  public async deleteSpending(user_id: number, spending_id: number) {
    try {
      await this.dbManager.query("BEGIN;");
      await this.checkUserRights(user_id, spending_id);
      const queryString = "DELETE FROM spendings WHERE spending_id = $1;";
      const queryValues = [spending_id];
      await this.dbManager.query(queryString, queryValues);
      await this.dbManager.query("COMMIT;");
    } catch (err) {
      logError("Rollback: deleteSpending fail");
      await this.dbManager.query("ROLLBACK;");
      throw err;
    }
  }

// The function should only be called inside the SQL transaction
  public async checkUserRights(user_id: number, spending_id: number) {
    const queryString = "SELECT user_id FROM spendings WHERE spending_id = $1 FOR UPDATE;";
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
    try {
      await this.dbManager.query("BEGIN;");
      await this.checkUserRights(user_id, spending_id);
      await this.dbManager.categoryHandler.checkUserRights(user_id, category_id);
      const queryString = "INSERT INTO spendings_to_categories (spending_id, category_id, group_id) VALUES ($1, $2, (SELECT group_id FROM categories WHERE category_id = $2 FOR UPDATE));";
      const queryValues = [spending_id, category_id];
      await this.dbManager.query(queryString, queryValues);
      await this.dbManager.query("COMMIT;");
    } catch (err) {
      logError("Rollback: addSpendingToCategory fail");
      await this.dbManager.query("ROLLBACK;");
      throw err;
    }
  }

  public async getAllSpendingsForUser(user_id: number): Promise<{
    spendings: {
      spending_id: number,
      description: string,
      value: number,
      currency: string,
      date: string
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
    date: string,
    categories: {
      category_id: number,
      category_description: string,
      group_id: number,
      group_description: string,
    }[]
  }> {
    try {
      await this.dbManager.query("BEGIN;");
      await this.checkUserRights(user_id, spending_id);
      const queryString1 = "SELECT spending_id, description, value, currency, date, COALESCE ((SELECT json_agg(json_build_object('category_id', categories.category_id, 'category_description', categories.description, 'group_id', groups.group_id, 'group_description', groups.description)) FROM categories, groups, spendings_to_categories WHERE spendings_to_categories.category_id = categories.category_id AND categories.group_id = groups.group_id AND spendings_to_categories.spending_id = $1), '[]') AS categories FROM spendings WHERE  spending_id = $1;";
      const queryValues1 = [spending_id];
      const rows = (await this.dbManager.query(queryString1, queryValues1)).rows;
      if (rows.length === 0) {
        throw new HttpError(ErrorCode.BadRequest, ErrorString.ObjectDoesNotExist);
      }
      await this.dbManager.query("COMMIT;");
      return {
        spending_id: rows[0].spending_id,
        description: rows[0].description,
        value: rows[0].value,
        currency: rows[0].currency,
        date: rows[0].date,
        categories: rows[0].categories
      };
    } catch (err) {
      logError("Rollback: getSpendingInfo fail");
      await this.dbManager.query("ROLLBACK;");
      throw err;
    }
  }
}
