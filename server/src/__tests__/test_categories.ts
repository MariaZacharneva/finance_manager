import {
  CategoryInfo, GroupInfo, SimpleCategoryInterface, SimpleGroupInterface
} from "../test_utils/test_interfaces";
import request from "supertest";
import {ErrorCode, ErrorString, PostgresErrorString} from "../utils/error_messages";
import {url, Helpers} from "../test_utils/test_helpers";

// Testing requests:
//    "/api/categories/get_all_categories"
//    "/api/categories/add_category"
//    "/api/categories/update_category"
//    "/api/categories/delete_category"
//    "/api/categories/get_category_info"

describe("Testing category functionality", () => {
  it("Get all categories", async () => {
    await request(url).post("/api/categories/get_all_categories").expect(200)
                      .expect((res) => {
                        expect(res.body.hasOwnProperty("categories")).toBeTruthy();
                      });
  });

  it("Add, update and delete category; get category info", async () => {
    const category_1: CategoryInfo = {
      category_id: 0,
      description: "category",
      group_id: 0,
      group_description: "cc_group",
      spendings: [],
    };
    const group_1: SimpleGroupInterface = {
      group_id: 0,
      description: "cc_group",
    };
    const group_2: SimpleGroupInterface = {
      group_id: 0,
      description: "cc_group-2",
    };
    await request(url).post("/api/groups/add_group").expect(200)
                      .send({description: group_1.description})
                      .expect((res) => {
                        expect(res.body.hasOwnProperty("group_id")).toBeTruthy();
                        group_1.group_id = res.body.group_id;
                      });
    await request(url).post("/api/groups/add_group").expect(200)
                      .send({description: group_2.description})
                      .expect((res) => {
                        expect(res.body.hasOwnProperty("group_id")).toBeTruthy();
                        group_2.group_id = res.body.group_id;
                      });
    category_1.group_id = group_1.group_id;
    await request(url).post("/api/categories/add_category").expect(200)
                      .send({description: category_1.description, group_id: category_1.group_id})
                      .expect((res) => {
                        expect(res.body.hasOwnProperty("category_id")).toBeTruthy();
                        category_1.category_id = res.body.category_id;
                      });
    await request(url).post("/api/categories/get_category_info").expect(200)
                      .send({category_id: category_1.category_id})
                      .expect((res) => {
                        Helpers.CheckCategoriesInfo(res, category_1);
                      });
    category_1.description = "category - 2";
    await request(url).post("/api/categories/update_category").expect(200)
                      .send({
                              category_id: category_1.category_id,
                              description: category_1.description,
                            }).expect({});
    await request(url).post("/api/categories/get_category_info").expect(200)
                      .send({category_id: category_1.category_id})
                      .expect((res) => {
                        Helpers.CheckCategoriesInfo(res, category_1);
                      });
    await request(url).post("/api/categories/delete_category").expect(200)
                      .send({category_id: category_1.category_id})
                      .expect({});
    await Helpers.CheckCategoryDoesNotExist(category_1.category_id);
    await request(url).post("/api/groups/delete_group").expect(200)
                      .send({group_id: group_1.group_id}).expect({});
    await Helpers.CheckGroupDoesNotExist(group_1.group_id);
    await request(url).post("/api/groups/delete_group").expect(200)
                      .send({group_id: group_2.group_id}).expect({});
    await Helpers.CheckGroupDoesNotExist(group_2.group_id);
  })

  it("Delete non-empty group with all categories", async () => {
    const category_1: SimpleCategoryInterface = {
      category_id: 0,
      description: "category",
    };
    const group_1: GroupInfo = {
      group_id: 0,
      description: "cc_group",
      categories: [],
    };
    await request(url).post("/api/groups/add_group").expect(200)
                      .send({description: group_1.description})
                      .expect((res) => {
                        expect(res.body.hasOwnProperty("group_id")).toBeTruthy();
                        group_1.group_id = res.body.group_id;
                      });
    await request(url).post("/api/categories/add_category").expect(200)
                      .send({description: category_1.description, group_id: group_1.group_id})
                      .expect((res) => {
                        expect(res.body.hasOwnProperty("category_id")).toBeTruthy();
                        category_1.category_id = res.body.category_id;
                      });
    await request(url).post("/api/groups/delete_group").expect(200)
                      .send({group_id: group_1.group_id}).expect({});
    await Helpers.CheckGroupDoesNotExist(group_1.group_id);
    await Helpers.CheckCategoryDoesNotExist(category_1.category_id);
  });

  it("Get group info with categories", async () => {
    const category_1: SimpleCategoryInterface = {
      category_id: 0,
      description: "category",
    };
    const group_1: GroupInfo = {
      group_id: 0,
      description: "cc_group",
      categories: [],
    };
    await request(url).post("/api/groups/add_group").expect(200)
                      .send({description: group_1.description})
                      .expect((res) => {
                        expect(res.body.hasOwnProperty("group_id")).toBeTruthy();
                        group_1.group_id = res.body.group_id;
                      });
    await request(url).post("/api/categories/add_category").expect(200)
                      .send({description: category_1.description, group_id: group_1.group_id})
                      .expect((res) => {
                        expect(res.body.hasOwnProperty("category_id")).toBeTruthy();
                        category_1.category_id = res.body.category_id;
                      });
    group_1.categories.push(category_1);
    await request(url).post("/api/groups/get_group_info").expect(200)
                      .send({group_id: group_1.group_id})
                      .expect((res) => {
                        Helpers.CheckGroupInfo(res, group_1);
                      });
    await request(url).post("/api/groups/delete_group").expect(200)
                      .send({group_id: group_1.group_id}).expect({});
    await Helpers.CheckGroupDoesNotExist(group_1.group_id);
    await Helpers.CheckCategoryDoesNotExist(category_1.category_id);
  });
});

describe("Testing categories expected errors", () => {
  it("Empty parameters", async () => {
    await request(url).post("/api/categories/add_category").expect(ErrorCode.BadRequest)
                      .expect((res) => {
                        expect(res.body.hasOwnProperty("error")).toBeTruthy();
                      });
    await request(url).post("/api/categories/update_category").expect(ErrorCode.BadRequest)
                      .expect((res) => {
                        expect(res.body.hasOwnProperty("error")).toBeTruthy();
                      });
    await request(url).post("/api/categories/delete_category").expect(ErrorCode.BadRequest)
                      .expect((res) => {
                        expect(res.body.hasOwnProperty("error")).toBeTruthy();
                      });
    await request(url).post("/api/categories/get_category_info").expect(ErrorCode.BadRequest)
                      .expect((res) => {
                        expect(res.body.hasOwnProperty("error")).toBeTruthy();
                      });
  });

  it("Add category to non-existing group", async () => {
    const category_1: SimpleCategoryInterface = {
      category_id: 0,
      description: "category",
    };
    const group_id = Helpers.CreateNonExistingGroup();
    await request(url).post("/api/categories/add_category").expect(ErrorCode.BadRequest)
                      .send({description: category_1.description, group_id: await group_id})
                      .expect((res) => {
                        expect(res.body.hasOwnProperty("error")).toBeTruthy();
                        expect(res.body.error).toEqual(ErrorString.ObjectDoesNotExist);
                      });
    await Helpers.CheckCategoryDoesNotExist(category_1.category_id);
  });

  it("Not enough rights for accessing category", async () => {
    const description = "category";
    const wrong_category_id = 2;
    await request(url).post("/api/categories/update_category").expect(ErrorCode.Forbidden)
                      .send(
                        {category_id: wrong_category_id, description: description})
                      .expect((res) => {
                        expect(res.body.hasOwnProperty("error")).toBeTruthy();
                      });
    await request(url).post("/api/categories/delete_category").expect(ErrorCode.Forbidden)
                      .send({category_id: wrong_category_id})
                      .expect((res) => {
                        expect(res.body.hasOwnProperty("error")).toBeTruthy();
                      });
    await request(url).post("/api/categories/get_category_info").expect(ErrorCode.Forbidden)
                      .send({category_id: wrong_category_id})
                      .expect((res) => {
                        expect(res.body.hasOwnProperty("error")).toBeTruthy();
                      });
  });
});
