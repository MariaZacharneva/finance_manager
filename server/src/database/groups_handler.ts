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
    try {
      await this.dbManager.query("BEGIN;");
      await this.checkUserRights(user_id, group_id);
      const queryString = "UPDATE groups SET description = $1 WHERE group_id = $2;";
      const queryValues = [description, group_id];
      await this.dbManager.query(queryString, queryValues);
      await this.dbManager.query("COMMIT;");
    } catch (err) {
      await this.dbManager.query("ROLLBACK;")
      throw err;
    }
  }

  public async deleteGroup(user_id: number, group_id: number) {
    try {
      await this.dbManager.query("BEGIN;");
      await this.checkUserRights(user_id, group_id);
      const queryString = "DELETE FROM groups WHERE group_id = $1;";
      const queryValues = [group_id];
      await this.dbManager.query(queryString, queryValues);
      await this.dbManager.query("COMMIT;");
    } catch (err) {
      await this.dbManager.query("ROLLBACK;")
      throw err;
    }
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
    try {
      await this.dbManager.query("BEGIN;");
      await this.checkUserRights(user_id, group_id);
      const queryString1 = "SELECT group_id, description, COALESCE ((SELECT json_agg(json_build_object('category_id', category_id, 'description', description)) FROM categories WHERE group_id = $1), '[]') AS categories FROM groups WHERE group_id = $1;";
      const queryValues1 = [group_id];
      const rows = (await this.dbManager.query(queryString1, queryValues1)).rows;
      if (rows.length === 0) {
        throw new HttpError(ErrorCode.BadRequest, ErrorString.ObjectDoesNotExist);
      }
      await this.dbManager.query("COMMIT;");
      return {
        group_id: rows[0].group_id,
        description: rows[0].description,
        categories: rows[0].categories
      };
    } catch (err) {
      await this.dbManager.query("ROLLBACK;")
      throw err;
    }
  }

// The function should only be called inside the SQL transaction
  public async checkUserRights(user_id: number, group_id: number) {
    const queryString = "SELECT user_id FROM groups WHERE group_id = $1 FOR UPDATE;";
    const queryValues = [group_id];
    const rows = (await this.dbManager.query(queryString, queryValues)).rows;
    if (rows.length === 0) {
      throw new HttpError(ErrorCode.BadRequest, ErrorString.ObjectDoesNotExist);
    }
    if (user_id !== rows[0].user_id) {
      throw new HttpError(ErrorCode.Forbidden, ErrorString.NotEnoughRights);
    }
  }
}
