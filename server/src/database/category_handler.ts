import {DatabaseManager} from "./database_manager";
import {ErrorCode, ErrorString,} from "../utils/error_messages";
import {HttpError} from "../utils/error_types";

export class CategoryHandler {
  private dbManager: DatabaseManager;

  public constructor(dbManager: DatabaseManager) {
    this.dbManager = dbManager;
  }

  public async addCategory(user_id: number, group_id: number,
                           description: string): Promise<number> {
    try {
      await this.dbManager.query("BEGIN;");
      await this.dbManager.groupsHandler.checkUserRights(user_id, group_id);
      const queryString = "INSERT INTO categories (group_id, description) VALUES ($1, $2) RETURNING category_id;";
      const queryValues = [group_id, description];
      const rows = (await this.dbManager.query(queryString, queryValues)).rows;
      await this.dbManager.query("COMMIT;");
      return rows[0].category_id;
    } catch (err) {
      await this.dbManager.query("ROLLBACK;");
      throw err;
    }
  }

  public async updateCategory(user_id: number, category_id: number, description: string) {
    try {
      await this.dbManager.query("BEGIN;");
      await this.checkUserRights(user_id, category_id);
      const queryString = "UPDATE categories SET description = $1 WHERE category_id = $2;";
      const queryValues = [description, category_id];
      await this.dbManager.query(queryString, queryValues);
      await this.dbManager.query("COMMIT;");
    } catch (err) {
      await this.dbManager.query("ROLLBACK;");
      throw err;
    }
  }

  public async deleteCategory(user_id: number, category_id: number) {
    try {
      await this.dbManager.query("BEGIN;");
      await this.checkUserRights(user_id, category_id);
      const queryString = "DELETE FROM categories WHERE category_id = $1;";
      const queryValues = [category_id];
      await this.dbManager.query(queryString, queryValues);
      await this.dbManager.query("COMMIT;");
    } catch (err) {
      await this.dbManager.query("ROLLBACK;");
      throw err;
    }
  }

// The function should only be called inside the SQL transaction
  public async checkUserRights(user_id: number, category_id: number) {
    const queryString = "SELECT groups.user_id FROM categories, groups WHERE categories.group_id = groups.group_id AND category_id = $1 FOR UPDATE;";
    const queryValues = [category_id];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    if (rows.length === 0) {
      throw new HttpError(ErrorCode.BadRequest, ErrorString.ObjectDoesNotExist);
    }
    if (user_id !== rows[0].user_id) {
      throw new HttpError(ErrorCode.Forbidden, ErrorString.NotEnoughRights);
    }
  }

  public async getAllCategoriesForUser(user_id: number): Promise<{ categories: { category_id: number, description: string }[] }> {
    const queryString = "SELECT categories.category_id, categories.description, groups.group_id FROM categories, groups WHERE categories.group_id = groups.group_id AND groups.user_id = $1;";
    const queryValues = [user_id];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    return {categories: rows};
  }

  public async getCategoryInfo(user_id: number, category_id: number): Promise<{
    category_id: number,
    description: string,
    group_id: number,
    group_description: string,
    spendings: {
      spending_id: number,
      description: string,
      value: number,
      currency: string,
      date: number,
    } []
  }> {
    try {
      await this.dbManager.beginTransaction();
      await this.checkUserRights(user_id, category_id);
      const queryString1 = "SELECT categories.category_id, categories.description as description, groups.group_id, groups.description as group_description, COALESCE ((SELECT json_agg(json_build_object('spending_id', spendings.spending_id, 'description', spendings.description, 'value', spendings.value, 'currency', spendings.currency, 'date', spendings.date)) FROM spendings, spendings_to_categories WHERE spendings.spending_id = spendings_to_categories.spending_id AND spendings_to_categories.category_id = $1), '[]') as spendings FROM categories, groups WHERE  categories.group_id = groups.group_id AND categories.category_id = $1;";
      const queryValues1 = [category_id];
      const rows = (await this.dbManager.query(queryString1, queryValues1)).rows;
      if (rows.length === 0) {
        throw new HttpError(ErrorCode.BadRequest, ErrorString.ObjectDoesNotExist);
      }
      await this.dbManager.commitTransaction();
      return {
        category_id: rows[0].category_id,
        description: rows[0].description,
        group_id: rows[0].group_id,
        group_description: rows[0].group_description,
        spendings: rows[0].spendings
      };
    } catch (err) {
      await this.dbManager.rollbackTransaction();
      throw err;
    }
  }
}
