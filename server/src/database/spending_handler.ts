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
                           date: string,
                           groups_and_categories: { group_id: number, category_id: number }[]): Promise<{
    spending_id: number,
    description: string,
    value: number,
    currency: string,
    date: string,
    groups_and_categories: {
      group_id: number,
      category_id: number
    }[]
  }> {
    try {
      await this.dbManager.beginTransaction();
      const queryString = "INSERT INTO spendings (user_id, description, value, currency, date) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
      const queryValues = [user_id, description, value, currency, date];
      const new_spending = (await this.dbManager.query(queryString, queryValues)).rows[0];
      const return_groups_and_categories = groups_and_categories.filter(
        info => Number.isInteger(info.category_id) && info.category_id !== 0);
      for (const info of return_groups_and_categories) {
        await this.addSpendingToCategory(user_id, new_spending.spending_id, info.category_id, true);
      }

      await this.dbManager.commitTransaction();
      return {
        spending_id: new_spending.spending_id,
        description: new_spending.description,
        value: new_spending.value,
        currency: new_spending.currency,
        date: new_spending.date,
        groups_and_categories: return_groups_and_categories
      };
    } catch (err) {
      logError("Rollback: addSpending fail");
      await this.dbManager.rollbackTransaction();
      throw err;
    }
  }


  public async updateSpending(user_id: number, spending_id: number, description: string,
                              value: number, currency: string, date: string,
                              groups_and_categories: { group_id: number, category_id: number }[]): Promise<{
    new_spending: {
      spending_id: number,
      description: string,
      value: number,
      currency: string,
      date: string
      groups_and_categories: {
        group_id: number,
        category_id: number
      }[]
    }
  }> {
    try {
      await this.dbManager.beginTransaction();
      await this.checkUserRights(user_id, spending_id);
      const queryString = "UPDATE spendings SET description = $1, value = $2, currency = $3, date = $4 WHERE spending_id = $5 RETURNING *;";
      const queryValues = [description, value, currency, date, spending_id];
      const new_spending = (await this.dbManager.query(queryString, queryValues)).rows[0];
      for (const info of groups_and_categories) {
        const result = await this.updateSpendingToCategory(user_id, spending_id, info.category_id,
                                                           info.group_id, true);
        if (!result) {
          throw new HttpError(ErrorCode.BadRequest, ErrorString.InvalidRequestBody);
        }
      }
      await this.dbManager.commitTransaction();
      return {
        new_spending: {
          spending_id: new_spending.spending_id,
          description: new_spending.description,
          value: new_spending.value,
          currency: new_spending.currency,
          date: new_spending.date,
          groups_and_categories: groups_and_categories
        }
      };
    } catch (err) {
      logError("Rollback: updateSpending fail");
      await this.dbManager.rollbackTransaction();
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

  public async addSpendingToCategory(user_id: number, spending_id: number, category_id: number,
                                     inside_transaction: boolean = false) {
    try {
      if (!inside_transaction) {
        await this.dbManager.beginTransaction();
      }
      await this.checkUserRights(user_id, spending_id);
      await this.dbManager.categoryHandler.checkUserRights(user_id, category_id);
      const queryString = "INSERT INTO spendings_to_categories (spending_id, category_id, group_id) VALUES ($1, $2, (SELECT group_id FROM categories WHERE category_id = $2 FOR UPDATE));";
      const queryValues = [spending_id, category_id];
      await this.dbManager.query(queryString, queryValues);
      if (!inside_transaction) {
        await this.dbManager.commitTransaction();
      }
    } catch (err) {
      logError("Rollback: addSpendingToCategory fail");
      if (!inside_transaction) {
        await this.dbManager.rollbackTransaction();
      }
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
      categories: {
        category_id: number,
        category_description: string,
        group_id: number,
        group_description: string,
      }[]
    }[]
  }> {
    const queryString = "SELECT s.spending_id, s.description, s.value, s.currency, s.date, COALESCE((SELECT json_agg(json_build_object('category_id', categories.category_id, 'category_description', categories.description, 'group_id', groups.group_id, 'group_description', groups.description)) FROM categories, groups, spendings_to_categories WHERE spendings_to_categories.category_id = categories.category_id AND categories.group_id = groups.group_id AND spendings_to_categories.spending_id = s.spending_id), '[]') AS categories FROM spendings s WHERE user_id=$1;";
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

  public async updateSpendingToCategory(user_id: number, spending_id: number, category_id: number,
                                        group_id: number,
                                        inside_transaction: boolean = false): Promise<boolean> {
    try {
      if (!inside_transaction) {
        await this.dbManager.beginTransaction();
      }
      const queryString1 = "SELECT COUNT(*) FROM categories WHERE group_id = $1 AND category_id = $2;"
      const queryValues1 = [group_id, category_id];
      const rows = (await this.dbManager.query(queryString1, queryValues1)).rows[0];
      if (rows.count === 0) {
        return false;
      }
      const queryString2 = "SELECT COUNT(*) FROM spendings_to_categories WHERE spending_id = $1 AND category_id = $2 AND group_id = $3";
      const queryValues2 = [spending_id, category_id, group_id];
      const rows2 = (await this.dbManager.query(queryString2, queryValues2)).rows[0];
      if (rows2.count !== 0) {
        return true;
      }
      await this.deleteSpendingToCategory(spending_id, group_id);
      if (category_id !== 0) {
        await this.addSpendingToCategory(user_id, spending_id, category_id, true);
      }
      if (!inside_transaction) {
        await this.dbManager.commitTransaction();
      }
      return true;
    } catch (err) {
      if (!inside_transaction) {
        await this.dbManager.rollbackTransaction();
      }
      throw err;
    }
  }

  public async deleteSpendingToCategory(spending_id: number, group_id: number) {
    try {
      const queryString = "DELETE FROM spendings_to_categories WHERE spending_id = $1 AND group_id = $2";
      const queryValues = [spending_id, group_id];
      await this.dbManager.query(queryString, queryValues);
    } catch (err) {
      throw err;
    }
  }
}
