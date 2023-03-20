import {DatabaseExecutor} from "./database_executor";
import {DatabaseManager} from "./database_manager";
import {logError} from "../utils/logger";

export class SpendingHandler {
  private dbManager: DatabaseManager;

  public constructor(dbManager: DatabaseManager) {
    this.dbManager = dbManager;
  }

  public async addSpending(user_id: number, description: string, value: number, currency: string, date: Date): Promise<number> {
    const queryString = "INSERT INTO spendings (user_id, description, value, currency, date) VALUES ($1, $2, $3, $4, $5) RETURNING spending_id;";
    const queryValues = [user_id, description, value, currency, date];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    return rows[0].spending_id;
  }

  public async updateSpending(user_id: number, spending_id: number, description: string, value: number, currency: string, date: Date) {
    const queryString = "UPDATE spendings SET description = $1, value = $2, currency = $3, date = $4 WHERE user_id = $3 AND spending_id = $4;";
    const queryValues = [description, value, currency, date, user_id, spending_id];
    await this.dbManager.query(queryString, queryValues);
  }

  public async deleteSpending(user_id: number, spending_id: number) {
    const queryString = "DELETE FROM spendings WHERE user_id = $1 AND spending_id = $2;";
    const queryValues = [user_id, spending_id];
    await this.dbManager.query(queryString, queryValues);
  }

  public async userIdForSpending(spending_id: number):Promise<number> {
    const queryString = "SELECT user_id FROM spendings WHERE spending_id = $1;";
    const queryValues = [spending_id];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    return rows[0].user_id;
  }

  public async addSpendingToCategory(user_id: number, spending_id: number, category_id: number) {
    const userIdForCategory = await this.dbManager.categoryHandler.userIdForCategory(category_id);
    const userIdForSpending = await this.userIdForSpending(spending_id);
    if (userIdForSpending !== user_id || userIdForCategory !== user_id) {
      logError(`Invalid category ${category_id} or spending ${spending_id} for user ${user_id}`);
      throw Error("Invalid category or spending");
    }
    const queryString = "INSERT INTO spendings_to_categories (spending_id, category_id) VALUES ($1, $2);";
    const queryValues = [spending_id, category_id];
    await this.dbManager.query(queryString, queryValues);
  }

  public async getAllSpendingsForUser(user_id: number): Promise<{ spendings: { spending_id: number, description: string }[] }> {
    const queryString = "SELECT spending_id, description FROM spendings WHERE user_id = $1;";
    const queryValues = [user_id];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    return {spendings: rows};
  }
}