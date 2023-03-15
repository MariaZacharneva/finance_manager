import express, {Express, Request, Response} from "express";
import cors from "cors";
import {DatabaseManager} from "../database/query";
import {logInfo, logError} from "../utils/logger";

export class Server {
  private readonly app: Express;
  private readonly PORT;
  private counter;
  private readonly db_manager: DatabaseManager;

  public constructor() {
    this.app = express();
    this.PORT = 3001;
    this.counter = 0;
    this.db_manager = new DatabaseManager();

    this.app.use(cors());
    this.app.use(express.json());

    this.app.get('/api', (req, res) => this.getAllMessages(req, res));
    this.app.post('/api/new_message', (req, res) => this.addNewMessage(req, res));
  }

  public start() {
    this.app.listen(this.PORT, () => {
      logInfo(`Server running on port ${this.PORT}`);
    })
  }

  public async getAllMessages(request: Request, response: Response) {
    logInfo(`Received request to get all: ${JSON.stringify(request.body)}`)
    const result = await this.db_manager.getAllMessages();
    logInfo(`Sending ${result.length} messages`);
    logInfo(`Message example: ${JSON.stringify(result[0])}`);
    this.counter = result.length;
    response.status(200).json(result);
  }

  public async addNewMessage(request: Request, response: Response) {
    logInfo(`Received request to add new: ${JSON.stringify(request.body)}`);
    const result = await this.db_manager.addNewMessage(request.body.text_message);
    logInfo(`Added message: ${JSON.stringify(result)}`);
    this.counter++;
    response.json(result);
  }
}