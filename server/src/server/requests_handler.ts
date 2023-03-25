import {DatabaseManager} from "../database/database_manager";
import express, {Express, Request, Response} from "express";
import {ErrorCode, ErrorString, SuccessCode} from "../utils/error_messages";
import {logDebug, logInfo} from "../utils/logger";

export class RequestsHandler {
  private readonly dbManager: DatabaseManager;

  public constructor(dbManager: DatabaseManager, app: Express) {
    this.dbManager = dbManager;

    app.post("/api/groups/get_all_groups",
      async (req, res, next) => this.getAllGroups(req, res).catch(next));
    app.post("/api/groups/get_group_info",
      async (req, res, next) => this.getGroupInfo(req, res).catch(next));
    app.post("/api/groups/add_group",
      async (req, res, next) => this.addGroup(req, res).catch(next));
    app.post("/api/groups/update_group",
      async (req, res, next) => this.updateGroup(req, res).catch(next));
    app.post("/api/groups/delete_group",
      async (req, res, next) => this.deleteGroup(req, res).catch(next));
    app.post("/api/categories/get_all_categories",
      async (req, res, next) => this.getAllCategories(req, res).catch(next));
    app.post("/api/categories/get_category_info",
      async (req, res, next) => this.getCategoryInfo(req, res).catch(next));
    app.post("/api/categories/add_category",
      async (req, res, next) => this.addCategory(req, res).catch(next));
    app.post("/api/categories/update_category",
      async (req, res, next) => this.updateCategory(req, res).catch(next));
    app.post("/api/categories/delete_category",
      async (req, res, next) => this.deleteCategory(req, res).catch(next));
    app.post("/api/spendings/get_all_spendings",
      async (req, res, next) => this.getAllSpendings(req, res).catch(next));
    app.post("/api/spendings/get_spending_info",
      async (req, res, next) => this.getSpendingInfo(req, res).catch(next));
    app.post("/api/spendings/add_spending_to_category",
      async (req, res, next) => this.addSpendingToCategory(req, res).catch(next));
    app.post("/api/spendings/add_spending",
      async (req, res, next) => this.addSpending(req, res).catch(next));
    app.post("/api/spendings/update_spending",
      async (req, res, next) => this.updateSpending(req, res).catch(next));
    app.post("/api/spendings/delete_spending",
      async (req, res, next) => this.deleteSpending(req, res).catch(next));
  }

  public async getAllGroups(request: Request, response: Response) {
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      const groups = await this.dbManager.groupsHandler.getAllGroupsForUser(userId);
      response.status(SuccessCode.OK).json(groups);
    } catch (err) {
      throw err;
    }
  }

  public async getGroupInfo(request: Request, response: Response) {
    const groupId = request.body.group_id;
    if (groupId === undefined) {
      response.status(ErrorCode.BadRequest).json({error: ErrorString.InvalidRequestBody})
      return;
    }
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      const data = await this.dbManager.groupsHandler.getGroupInfo(userId, groupId);
      response.status(SuccessCode.OK).json(data);
    } catch (err) {
      throw err;
    }
  }

  public async addGroup(request: Request, response: Response) {
    const description = request.body.description;
    if (description === undefined) {
      response.status(ErrorCode.BadRequest).json({error: ErrorString.InvalidRequestBody})
      return;
    }
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      const newGroupId = await this.dbManager.groupsHandler.addGroup(userId, description);
      response.status(SuccessCode.OK).json({group_id: newGroupId});
    } catch (err) {
      throw err;
    }
  }

  public async updateGroup(request: Request, response: Response) {
    const groupId = request.body.group_id;
    const description = request.body.description;
    if (groupId === undefined || description === undefined) {
      response.status(ErrorCode.BadRequest).json({error: ErrorString.InvalidRequestBody})
      return;
    }
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      await this.dbManager.groupsHandler.updateGroup(userId, groupId, description);
      response.status(SuccessCode.OK).json({});
    } catch (err) {
      throw err;
    }
  }

  public async deleteGroup(request: Request, response: Response) {
    const groupId = request.body.group_id;
    if (groupId === undefined) {
      response.status(ErrorCode.BadRequest).json({error: ErrorString.InvalidRequestBody});
      return;
    }
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      await this.dbManager.groupsHandler.deleteGroup(userId, groupId);
      response.status(SuccessCode.OK).json({});
    } catch (err) {
      throw err;
    }
  }

  public async getAllCategories(request: Request, response: Response) {
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      const categories = await this.dbManager.categoryHandler.getAllCategoriesForUser(userId);
      response.status(SuccessCode.OK).json(categories);
    } catch (err) {
      throw err;
    }
  }

  public async getCategoryInfo(request: Request, response: Response) {
    const category_id = request.body.category_id;
    if (category_id === undefined) {
      response.status(ErrorCode.BadRequest).json({error: ErrorString.InvalidRequestBody});
      return;
    }
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      const data = await this.dbManager.categoryHandler.getCategoryInfo(userId, category_id);
      response.status(SuccessCode.OK).json(data);
    } catch (err) {
      throw err;
    }
  }

  public async addCategory(request: Request, response: Response) {
    const groupId = request.body.group_id;
    const category_description = request.body.description;
    if (groupId === undefined || category_description === undefined) {
      response.status(ErrorCode.BadRequest).json({error: ErrorString.InvalidRequestBody});
      return;
    }
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      const newCategoryId = await this.dbManager.categoryHandler.addCategory(
        userId, groupId, category_description);
      response.status(SuccessCode.OK).json({category_id: newCategoryId});
    } catch (err) {
      throw err;
    }
  }

  public async updateCategory(request: Request, response: Response) {
    const categoryId = request.body.category_id;
    const groupId = request.body.group_id;
    const category_description = request.body.description;
    if (categoryId === undefined || groupId === undefined || category_description === undefined) {
      response.status(ErrorCode.BadRequest).json({error: ErrorString.InvalidRequestBody});
      return;
    }
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      await this.dbManager.categoryHandler.updateCategory(
        userId, categoryId, groupId, category_description);
      response.status(SuccessCode.OK).json({});
    } catch (err) {
      throw err;
    }
  }

  public async deleteCategory(request: Request, response: Response) {
    const categoryId = request.body.category_id;
    if (categoryId === undefined) {
      response.status(ErrorCode.BadRequest).json({error: ErrorString.InvalidRequestBody});
      return;
    }
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      await this.dbManager.categoryHandler.deleteCategory(userId, categoryId);
      response.status(SuccessCode.OK).json({});
    } catch (err) {
      throw err;
    }
  }

  public async getAllSpendings(request: Request, response: Response) {
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      const spendings = await this.dbManager.spendingHandler.getAllSpendingsForUser(userId);
      response.status(SuccessCode.OK).json(spendings);
    } catch (err) {
      throw err;
    }
  }

  public async addSpending(request: Request, response: Response) {
    const spending_description = request.body.description;
    const value = request.body.value;
    const currency = request.body.currency;
    const date = request.body.date;
    if (spending_description === undefined || value === undefined || currency === undefined || date === undefined) {
      response.status(ErrorCode.BadRequest).json({error: ErrorString.InvalidRequestBody});
      return;
    }
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      const newSpendingId = await this.dbManager.spendingHandler.addSpending(
        userId, spending_description, value, currency, date);
      response.status(SuccessCode.OK).json({spending_id: newSpendingId});
      logInfo(`Add spending: new id ${newSpendingId}`);
    } catch (err) {
      throw err;
    }
  }

  public async updateSpending(request: Request, response: Response) {
    const spending_id = request.body.spending_id;
    const spending_description = request.body.description;
    const value = request.body.value;
    const currency = request.body.currency;
    const date = request.body.date;
    if (spending_id === undefined || spending_description === undefined || value === undefined
      || currency === undefined || date === undefined) {
      response.status(ErrorCode.BadRequest).json({error: ErrorString.InvalidRequestBody});
      return;
    }
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      await this.dbManager.spendingHandler.updateSpending(
        userId, spending_id, spending_description, value, currency, date);
      response.status(SuccessCode.OK).json({});
    } catch (err) {
      throw err;
    }
  }

  public async deleteSpending(request: Request, response: Response) {
    const spending_id = request.body.spending_id;
    if (spending_id === undefined) {
      response.status(ErrorCode.BadRequest).json({error: ErrorString.InvalidRequestBody});
      return;
    }
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      await this.dbManager.spendingHandler.deleteSpending(userId, spending_id);
      response.status(SuccessCode.OK).json({});
    } catch (err) {
      throw err;
    }
  }

  public async getSpendingInfo(request: Request, response: Response) {
    const spending_id = request.body.spending_id;
    if (spending_id === undefined) {
      response.status(ErrorCode.BadRequest).json({error: ErrorString.InvalidRequestBody});
      return;
    }
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      const data = await this.dbManager.spendingHandler.getSpendingInfo(userId, spending_id);
      response.status(SuccessCode.OK).json(data);
    } catch (err) {
      throw err;
    }
  }

  public async addSpendingToCategory(request: Request, response: Response) {
    const spending_id = request.body.spending_id;
    const category_id = request.body.category_id;
    if (spending_id === undefined || category_id === undefined) {
      response.status(ErrorCode.BadRequest).json({error: ErrorString.InvalidRequestBody});
      return;
    }
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      await this.dbManager.spendingHandler.addSpendingToCategory(userId, spending_id, category_id);
      response.status(SuccessCode.OK).json({});
    } catch (err) {
      throw err;
    }
  }
}
