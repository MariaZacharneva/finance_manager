import {DatabaseManager} from "./database_manager";
import {ErrorCode, ErrorString, PostgresErrorCode, PostgresErrorString} from "../utils/error_messages";
import {HttpError, PostgresError} from "../utils/error_types";
import {logInfo} from "../utils/logger";

export class CategoryHandler {
  private dbManager: DatabaseManager;

  public constructor(dbManager: DatabaseManager) {
    this.dbManager = dbManager;
  }

  public async addCategory(user_id: number, group_id: number, description: string): Promise<number> {
    const queryString = "INSERT INTO categories (user_id, group_id, description) VALUES ($1, $2, $3) RETURNING category_id;";
    const queryValues = [user_id, group_id, description];
    try {
      const rows = (await this.dbManager.query(queryString, queryValues)).rows;
      return rows[0].category_id;
    } catch (err) {
      if (err instanceof PostgresError && err.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new PostgresError(PostgresErrorCode.ForeignKeyViolation, PostgresErrorString.ForeignKeyViolation);
      } else {
        throw err;
      }
    }
  }

  public async updateCategory(user_id: number, category_id: number, group_id: number, description: string) {
    const queryString = "UPDATE categories SET description = $1, group_id = $2 WHERE user_id = $3 AND category_id = $4;";
    const queryValues = [description, group_id, user_id, category_id];
    await this.dbManager.query(queryString, queryValues);
  }

  public async deleteCategory(user_id: number, category_id: number) {
    const queryString = "DELETE FROM categories WHERE user_id = $1 AND category_id = $2;";
    const queryValues = [user_id, category_id];
    await this.dbManager.query(queryString, queryValues);
  }

  public async deleteAllCategoriesForGroup(user_id: number, group_id: number) {
    const queryString = "DELETE FROM categories WHERE user_id = $1 AND group_id = $2;";
    const queryValues = [user_id, group_id];
    await this.dbManager.query(queryString, queryValues);
  }

  public async userIdForCategory(category_id: number): Promise<number> {
    const queryString = "SELECT user_id FROM categories WHERE category_id = $1;";
    const queryValues = [category_id];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    return rows[0].user_id;
  }

  public async getAllCategoriesForUser(user_id: number): Promise<{ categories: { category_id: number, description: string }[] }> {
    const queryString = "SELECT category_id, description, group_id FROM categories WHERE user_id = $1;";
    const queryValues = [user_id];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    return {categories: rows};
  }

  public async getCategoryInfo(user_id: number, category_id: number): Promise<{
    category_id: number,
    description: string,
    group_id: number
    spendings: number [] // TODO: change
  }> {
    const queryString1 = "SELECT category_id, description, group_id FROM categories WHERE user_id = $1 AND category_id = $2;";
    const queryValues1 = [user_id, category_id];
    // TODO: select spendings
    const rows = (await this.dbManager.query(queryString1, queryValues1)).rows;
    const spendings: number [] = []; //TODO: change
    if (rows.length === 0) {
      throw new HttpError(ErrorCode.BadRequest, ErrorString.ObjectDoesNotExist);
    }
    return {
      category_id: rows[0].category_id,
      description: rows[0].description,
      group_id: rows[0].group_id,
      spendings: spendings
    };
  }
}