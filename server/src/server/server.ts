import express, {Express, Request, Response} from "express";
import cors from "cors";
import {DatabaseManager} from "../database/database_manager";
import {logInfo, logError} from "../utils/logger";
import {RequestsHandler} from "./requests_handler";
import {ErrorCode, ErrorString} from "../utils/error_messages";

export class Server {
  private readonly app: Express;
  private readonly PORT;
  private readonly db_manager: DatabaseManager;
  private readonly requestsHandler: RequestsHandler;

  public constructor() {
    this.app = express();
    this.PORT = 3001;
    this.db_manager = new DatabaseManager();

    this.app.use(cors());
    this.app.use(express.json());

    this.requestsHandler = new RequestsHandler(this.db_manager, this.app);

    this.app.get('/api', (req, res, next) => this.testConnection(req, res).catch(next));

    this.app.use((req: Request, res: Response) => {
      res.status(404).json({error: ErrorString.NotFound});
    });

    this.app.use(
      (err: Error, request: Request, response: Response) => {
        logError(`Internal server error, request: ${request}, error: JSON.stringify(err)`);
        response.status(ErrorCode.InternalServerError).json({error: ErrorString.InternalError});
      });
  }

  public start() {
    this.app.listen(this.PORT, () => {
      logInfo(`Server running on port ${this.PORT}`);
    })
  }

  public async testConnection(request: Request, response: Response) {
    response.status(200).json({connection: true});
    logInfo(`Received test connection request`)
  }
}