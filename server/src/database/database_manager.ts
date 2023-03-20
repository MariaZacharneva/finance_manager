import {Request} from "express";
import {GroupsHandler} from "./groups_handler";
import {CategoryHandler} from "./category_handler";
import {SpendingHandler} from "./spending_handler";
import {DatabaseExecutor} from "./database_executor";
// import {Group, Category, Spending} from "./entities";
import {logInfo} from "../utils/logger";
import {Pool} from "pg";

export class DatabaseManager {
  public readonly groupsHandler: GroupsHandler;
  public readonly categoryHandler: CategoryHandler;
  public readonly spendingHandler: SpendingHandler;
  private readonly pool: Pool;

  public constructor() {
    this.pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: 'postgres',
      port: 5432,
    })

    this.groupsHandler = new GroupsHandler(this);
    this.categoryHandler = new CategoryHandler(this);
    this.spendingHandler = new SpendingHandler(this);
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
}
