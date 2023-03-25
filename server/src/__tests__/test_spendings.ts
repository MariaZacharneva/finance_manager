import {
  CategoryInfo,
  SimpleCategoryInterface,
  SimpleGroupInterface,
  SimpleSpendingInterface,
  SpendingInfo
} from "../test_utils/test_interfaces";
import request from "supertest";
import {url, Helpers} from "../test_utils/test_helpers";
import {ErrorCode} from "../utils/error_messages";

describe("Testing spendings functionality", () => {
  it("Get all spendings", async () => {
    await request(url).post("/api/spendings/get_all_spendings").expect(200)
      .expect((res) => {
        expect(res.body.hasOwnProperty("spendings")).toBeTruthy();
      });
  });
  it("Add, update and delete spending", async () => {
    const spending_1: SimpleSpendingInterface = {
      spending_id: 0,
      description: "spending",
      value: 13,
      currency: "USD",
      date: Date.now(),
    };
    await request(url).post("/api/spendings/add_spending").expect(200)
      .send({
        description: spending_1.description,
        value: spending_1.value,
        currency: spending_1.currency,
        date: spending_1.date,
      })
      .expect((res) => {
        expect(res.body.hasOwnProperty("spending_id")).toBeTruthy();
        spending_1.spending_id = res.body.spending_id;
      });
    spending_1.description = "new description";
    spending_1.value = 18;
    spending_1.currency = "EUR";
    spending_1.date = new Date("2022-03-21").getTime();
    await request(url).post("/api/spendings/update_spending").expect(200)
      .send({
        spending_id: spending_1.spending_id,
        description: spending_1.description,
        value: spending_1.value,
        currency: spending_1.currency,
        date: spending_1.date,
      })
      .expect({});
    await request(url).post("/api/spendings/delete_spending").expect(200)
      .send({spending_id: spending_1.spending_id})
      .expect({});
    await Helpers.CheckSpendingDoesNotExist(spending_1.spending_id);
  });

  it("Add spending to the category and get spending info", async () => {
    const spending_1: SpendingInfo = {
      spending_id: 0,
      description: "spending",
      value: 13,
      currency: "USD",
      date: Date.now(),
      categories: []
    };
    const category_1: SimpleCategoryInterface = {
      category_id: 0,
      description: "category",
    };
    const group_1: SimpleGroupInterface = {
      group_id: 0,
      description: "group",
    }
    await Helpers.CreateGroupCategoryAndSpending(group_1, category_1, spending_1);
    await request(url).post("/api/spendings/add_spending_to_category").expect(200)
      .send({spending_id: spending_1.spending_id, category_id: category_1.category_id})
      .expect({});
    spending_1.categories.push({
      category_id: category_1.category_id,
      category_description: category_1.description,
      group_id: group_1.group_id,
      group_description: group_1.description,
    });
    await request(url).post("/api/spendings/get_spending_info").expect(200)
      .send({spending_id: spending_1.spending_id})
      .expect((res) => {
        Helpers.CheckSpendingInfo(res, spending_1);
      });

    await Helpers.DeleteGroupCategoryAndSpending(group_1.group_id, category_1.category_id, spending_1.spending_id);
  });

  it("Get category info with spendings", async () => {
    const spending_1: SimpleSpendingInterface = {
      spending_id: 0,
      description: "spending",
      value: 13,
      currency: "USD",
      date: Date.now(),
    };
    const category_1: CategoryInfo = {
      category_id: 0,
      description: "category",
      group_id: 0,
      group_description: "group",
      spendings: []
    };
    const group_1: SimpleGroupInterface = {
      group_id: 0,
      description: "group",
    };
    await Helpers.CreateGroupCategoryAndSpending(group_1, category_1, spending_1);
    category_1.group_id = group_1.group_id;
    category_1.spendings.push(spending_1);
    await request(url).post("/api/spendings/add_spending_to_category").expect(200)
      .send({spending_id: spending_1.spending_id, category_id: category_1.category_id})
      .expect({});
    await request(url).post("/api/categories/get_category_info").expect(200)
      .send({category_id: category_1.category_id})
      .expect((res) => {
        Helpers.CheckCategoriesInfo(res, category_1);
      });

    await Helpers.DeleteGroupCategoryAndSpending(group_1.group_id, category_1.category_id, spending_1.spending_id);
  });
});

describe("Testing spendings expected errors", () => {
  it("Empty parameters", async () => {
    await request(url).post("/api/spendings/add_spending").expect(ErrorCode.BadRequest)
      .expect((res) => {
        expect(res.body.hasOwnProperty("error")).toBeTruthy();
      });
    await request(url).post("/api/spendings/update_spending").expect(ErrorCode.BadRequest)
      .expect((res) => {
        expect(res.body.hasOwnProperty("error")).toBeTruthy();
      });
    await request(url).post("/api/spendings/delete_spending").expect(ErrorCode.BadRequest)
      .expect((res) => {
        expect(res.body.hasOwnProperty("error")).toBeTruthy();
      });
    await request(url).post("/api/spendings/get_spending_info").expect(ErrorCode.BadRequest)
      .expect((res) => {
        expect(res.body.hasOwnProperty("error")).toBeTruthy();
      });
  });

  it("Add spending to non-existing category", async () => {
    const category_id = await Helpers.CreateNonExistingCategory();
    const spending_1: SimpleSpendingInterface = {
      spending_id: 0,
      description: "spending",
      value: 13,
      currency: "USD",
      date: Date.now(),
    };
    await request(url).post("/api/spendings/add_spending").expect(200)
      .send({
        description: spending_1.description,
        value: spending_1.value,
        currency: spending_1.currency,
        date: spending_1.date,
      })
      .expect((res) => {
        expect(res.body.hasOwnProperty("spending_id")).toBeTruthy();
        spending_1.spending_id = res.body.spending_id;
      });
    await request(url).post("/api/spendings/add_spending_to_category").expect(ErrorCode.BadRequest)
      .send({spending_id: spending_1.spending_id, category_id: category_id})
      .expect((res) => {
        expect(res.body.hasOwnProperty("error")).toBeTruthy();
      });
    await request(url).post("/api/spendings/delete_spending").expect(200)
      .send({spending_id: spending_1.spending_id})
      .expect({});
    await Helpers.CheckSpendingDoesNotExist(spending_1.spending_id);
  });
});
