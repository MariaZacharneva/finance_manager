import {DatabaseManager} from "../database/database_manager";
import express, {Express, Request, Response} from "express";
import {logInfo} from "../utils/logger";
import {ErrorCode, ErrorString, SuccessCode} from "../utils/error_messages";

export class RequestsHandler {
  private readonly dbManager: DatabaseManager;

  public constructor(dbManager: DatabaseManager, app: Express) {
    this.dbManager = dbManager;

    app.post("/api/groups/get_all_groups", (req, res, next) => this.getAllGroups(req, res).catch(next));
    app.post("/api/groups/add_group", (req, res, next) => this.addGroup(req, res).catch(next));
    app.post("/api/groups/update_group", (req, res, next) => this.updateGroup(req, res).catch(next));
    app.post("/api/groups/delete_group", (req, res, next) => this.deleteGroup(req, res).catch(next));
    app.post("/api/categories/get_all_categories", (req, res, next) => this.getAllCategories(req, res).catch(next));
    app.post("/api/categories/add_category", (req, res, next) => this.addCategory(req, res).catch(next));
    app.post("/api/categories/update_category", (req, res, next) => this.updateCategory(req, res).catch(next));
    app.post("/api/categories/delete_category", (req, res, next) => this.deleteCategory(req, res).catch(next));
    app.post("/api/spendings/get_all_spendings", (req, res, next) => this.getAllSpendings(req, res).catch(next));
    app.post("/api/spendings/add_spending", (req, res, next) => this.addSpending(req, res).catch(next));
    app.post("/api/spendings/update_spending", (req, res, next) => this.updateSpending(req, res).catch(next));
    app.post("/api/spendings/delete_spending", (req, res, next) => this.deleteSpending(req, res).catch(next));
  }

  public async getAllGroups(request: Request, response: Response) {
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      const groups = await this.dbManager.groupsHandler.getAllGroupsForUser(userId);
      logInfo(`getAllGroups: ${groups.groups.length}`);
      response.status(SuccessCode.OK).json(groups);
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
      logInfo(`addGroup for user ${userId}, request: ${JSON.stringify(request.body)}`);
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
      logInfo(`updateGroup for user ${userId}, request: ${JSON.stringify(request.body)}`);
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
      logInfo(`deleteGroup for user ${userId}, request: ${JSON.stringify(request.body)}`);
      await this.dbManager.groupsHandler.deleteGroup(userId, groupId);
      response.status(SuccessCode.OK).json({});
    } catch (err) {
      throw err;
    }
  }

  public async getAllCategories(request: Request, response: Response) {
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      logInfo(`getAllCategories for user ${userId}`);
      const groups = await this.dbManager.categoryHandler.getAllCategoriesForUser(userId);
      response.status(SuccessCode.OK).json(groups);
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
      logInfo(`addCategory for user ${userId}, request: ${JSON.stringify(request.body)}`);
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
      logInfo(`updateCategory for user ${userId}, request: ${JSON.stringify(request.body)}`);
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
      logInfo(`deleteCategory for user ${userId}, request: ${JSON.stringify(request.body)}`);
      await this.dbManager.categoryHandler.deleteCategory(userId, categoryId);
      response.status(SuccessCode.OK).json({});
    } catch (err) {
      throw err;
    }
  }

  public async getAllSpendings(request: Request, response: Response) {
    try {
      const userId = await this.dbManager.getUserIdFromRequest(request);
      logInfo(`getAllSpendings for user ${userId}, request: ${JSON.stringify(request.body)}`);
      const groups = await this.dbManager.spendingHandler.getAllSpendingsForUser(userId);
      response.status(SuccessCode.OK).json(groups);
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
      logInfo(`addSpending for user ${userId}, request: ${JSON.stringify(request.body)}`);
      const newSpendingId = await this.dbManager.spendingHandler.addSpending(
        userId, spending_description, value, currency, date);
      response.status(SuccessCode.OK).json({category_id: newSpendingId});
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
      logInfo(`updateSpending for user ${userId}, request: ${JSON.stringify(request.body)}`);
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
      logInfo(`deleteSpending for user ${userId}, request: ${JSON.stringify(request.body)}`);
      await this.dbManager.spendingHandler.deleteSpending(userId, request.body.spending_id);
      response.status(SuccessCode.OK).json({});
    } catch (err) {
      throw err;
    }
  }
}