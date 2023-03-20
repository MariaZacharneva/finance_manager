import {DatabaseExecutor} from "./database_executor";
import {DatabaseManager} from "./database_manager";
import {logError} from "../utils/logger";

export class GroupsHandler {
  private dbManager: DatabaseManager;

  public constructor(dbManager: DatabaseManager) {
    this.dbManager = dbManager;
  }

  public async addGroup(user_id: number, description: number): Promise<number> {
    const queryString = "INSERT INTO groups (user_id, description) VALUES ($1, $2) RETURNING group_id;";
    const queryValues = [user_id, description];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    return rows[0].group_id;
  }

  public async updateGroup(user_id: number, group_id: number, description: string) {
    const queryString = "UPDATE groups SET description = $1 WHERE user_id = $2 AND group_id = $3;";
    const queryValues = [description, user_id, group_id];
    await this.dbManager.query(queryString, queryValues);
  }

  public async deleteGroup(user_id: number, group_id: number) {
    await this.dbManager.categoryHandler.deleteAllCategoriesForGroup(user_id, group_id);
    const queryString = "DELETE FROM groups WHERE user_id = $1 AND group_id = $2;";
    const queryValues = [user_id, group_id];
    await this.dbManager.query(queryString, queryValues);
  }

  public async checkGroupExistence(group_id: number) {
    const queryString = "SELECT EXISTS(SELECT 1 FROM groups WHERE group_id = $1);";
    const queryValues = [group_id];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    if (!rows[0].exists) {
      logError(`Group ${group_id} does not exist`);
      throw new Error("Invalid group id");
    }
  }

  public async getAllGroupsForUser(user_id: number): Promise<{ groups: { group_id: number, description: string }[] }> {
    const queryString = "SELECT group_id, description FROM groups WHERE user_id = $1;";
    const queryValues = [user_id];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    return {groups: rows};
  }
}