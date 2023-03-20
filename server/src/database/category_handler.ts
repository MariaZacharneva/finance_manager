import {DatabaseManager} from "./database_manager";
import {logError} from "../utils/logger";

export class CategoryHandler {
  private dbManager: DatabaseManager;

  public constructor(dbManager: DatabaseManager) {
    this.dbManager = dbManager;
  }

  public async addCategory(user_id: number, group_id: number, description: string): Promise<number> {
    const queryString = "INSERT INTO categories (user_id, group_id, description) VALUES ($1, $2, $3) RETURNING category_id;";
    const queryValues = [user_id, group_id, description];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    return rows[0].category_id;
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

  public async checkCategoryExistence(category_id: number) {
    const queryString = "SELECT EXISTS(SELECT 1 FROM categories WHERE category_id = $1);";
    const queryValues = [category_id];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    if (!rows[0].exists) {
      logError(`Category ${category_id} does not exist`);
      throw new Error("Invalid category id");
    }
  }

  public async userIdForCategory(category_id: number):Promise<number> {
    const queryString = "SELECT user_id FROM categories WHERE category_id = $1;";
    const queryValues = [category_id];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    return rows[0].user_id;
  }

  public async getAllCategoriesForUser(user_id: number): Promise<{ categories: { category_id: number, description: string }[] }> {
    const queryString = "SELECT category_id, description FROM categories WHERE user_id = $1;";
    const queryValues = [user_id];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    return {categories: rows};
  }
}