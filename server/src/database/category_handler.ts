import {DatabaseManager} from "./database_manager";
import {ErrorCode, ErrorString, PostgresErrorCode, PostgresErrorString} from "../utils/error_messages";
import {HttpError, PostgresError} from "../utils/error_types";

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

  public async checkUserRights(user_id: number, category_id: number) {
    const queryString = "SELECT user_id FROM categories WHERE category_id = $1;";
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
    const queryString = "SELECT category_id, description, group_id FROM categories WHERE user_id = $1;";
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
    const queryString1 = "SELECT categories.category_id, categories.description, groups.group_id, groups.description AS \"group_description\" FROM (categories INNER JOIN groups ON categories.group_id = groups.group_id) WHERE categories.user_id = $1 AND categories.category_id = $2;";
    const queryValues1 = [user_id, category_id];
    const rows = (await this.dbManager.query(queryString1, queryValues1)).rows;
    const queryString2 = "SELECT spendings.spending_id, spendings.description, spendings.value, spendings.currency, spendings.date FROM (spendings_to_categories INNER JOIN spendings ON spendings_to_categories.spending_id = spendings.spending_id) WHERE spendings.user_id = $1 AND spendings_to_categories.user_id = $1 AND spendings_to_categories.category_id = $2;";
    const queryValues2 = [user_id, category_id];
    const spendings = (await this.dbManager.query(queryString2, queryValues2)).rows;
    if (rows.length === 0) {
      throw new HttpError(ErrorCode.BadRequest, ErrorString.ObjectDoesNotExist);
    }
    return {
      category_id: rows[0].category_id,
      description: rows[0].description,
      group_id: rows[0].group_id,
      group_description: rows[0].group_description,
      spendings: spendings
    };
  }
}
