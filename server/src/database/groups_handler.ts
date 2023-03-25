import {DatabaseManager} from "./database_manager";
import {HttpError} from "../utils/error_types";
import {ErrorCode, ErrorString} from "../utils/error_messages";

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
    const queryString = "DELETE FROM groups WHERE user_id = $1 AND group_id = $2;";
    const queryValues = [user_id, group_id];
    await this.dbManager.query(queryString, queryValues);
  }

  public async getAllGroupsForUser(user_id: number): Promise<{
    groups: { group_id: number, description: string }[]
  }> {
    const queryString = "SELECT group_id, description FROM groups WHERE user_id = $1;";
    const queryValues = [user_id];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    return {groups: rows};
  }

  public async getGroupInfo(user_id: number, group_id: number): Promise<{
    group_id: number, description: string,
    categories: { category_id: number, description: string }[]
  }> {
    const queryString1 = "SELECT group_id, description FROM groups WHERE user_id = $1 AND group_id = $2;";
    const queryValues1 = [user_id, group_id];
    const queryString2 = "SELECT category_id, description FROM categories WHERE user_id = $1 AND group_id = $2;";
    const queryValues2 = [user_id, group_id];
    const rows = (await this.dbManager.query(queryString1, queryValues1)).rows;
    if (rows.length === 0) {
      throw new HttpError(ErrorCode.BadRequest, ErrorString.ObjectDoesNotExist);
    }
    const categories = (await this.dbManager.query(queryString2, queryValues2)).rows;
    return {group_id: rows[0].group_id, description: rows[0].description, categories: categories};
  }
}
