import {Pool} from 'pg';
import {logInfo, logError} from "../utils/logger";
import {Request} from "express";

export class DatabaseExecutor {
  private readonly pool;

  public constructor() {
    this.pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: 'postgres',
      port: 5432,
    })
  }

  public async query(queryString: string, queryValues?: any[]): Promise<{
    rows: any[],
    rowCount: number
  }> {
    return this.pool.query(queryString, queryValues);
  }

  public async getUserIdFromRequest(request: Request): Promise<number> {
    return 0;
  }

  /* public async getAllMessages() {
    try {
      const result = await this.pool.query('SELECT * FROM init_table');
      return result.rows;
    } catch (err) {
      logError(JSON.stringify(err));
      throw err;
    }
  }

  public async addNewMessage(new_text_message: string) {
    try {
      const result = await this.pool.query('INSERT INTO init_table (text_message) VALUES ($1) RETURNING *',
        [new_text_message]);
      return result.rows[0];
    } catch (err) {
      logError(JSON.stringify(err));
      throw err;
    }
  }*/
}
