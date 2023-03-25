import request from "supertest";
import {ErrorCode, PostgresErrorString} from "../utils/error_messages";
import {url, Helpers} from "../test_utils/test_helpers";
import {GroupInfo, CategoryInfo, SimpleGroupInterface, SimpleCategoryInterface} from "../test_utils/test_interfaces";
import CheckGroupDoesNotExist = Helpers.CheckGroupDoesNotExist;

// Testing requests:
//    "/api/categories/get_all_categories"
//    "/api/categories/add_category"
//    "/api/categories/update_category"
//    "/api/categories/delete_category"
//    "/api/categories/get_category_info"

describe("Testing basic groups functionality", () => {
  it ("Get all groups", async () => {
    await request(url).post("/api/groups/get_all_groups").expect(200)
      .expect((res) => {
        expect(res.body.hasOwnProperty("groups")).toBeTruthy();
      });
  });

  it("Add, update and delete group; get group info", async () => {
    const group_1: GroupInfo = {
      group_id: 0,
      description: "group",
      categories: [],
    };
    await request(url).post("/api/groups/add_group").expect(200)
      .send({description: group_1.description})
      .expect((res) => {
        expect(res.body.hasOwnProperty("group_id")).toBeTruthy();
        group_1.group_id = res.body.group_id;
      });
    group_1.description = "new description";
    await request(url).post("/api/groups/update_group").expect(200)
      .send({description: group_1.description, group_id: group_1.group_id})
      .expect({});
    await request(url).post("/api/groups/get_group_info").expect(200)
      .send({group_id: group_1.group_id})
      .expect((res) => {
        Helpers.CheckGroupInfo(res, group_1);
      });
    await request(url).post("/api/groups/delete_group").expect(200)
      .send({group_id: group_1.group_id})
      .expect({});
    await CheckGroupDoesNotExist(group_1.group_id);
  });
});

describe("Testing groups expected errors", () => {
  it("Empty parameters", async () => {
    await request(url).post("/api/groups/add_group").expect(ErrorCode.BadRequest)
      .expect((res) => {
        expect(res.body.hasOwnProperty("error")).toBeTruthy();
      });
    await request(url).post("/api/groups/update_group").expect(ErrorCode.BadRequest)
      .expect((res) => {
        expect(res.body.hasOwnProperty("error")).toBeTruthy();
      });
    await request(url).post("/api/groups/delete_group").expect(ErrorCode.BadRequest)
      .expect((res) => {
        expect(res.body.hasOwnProperty("error")).toBeTruthy();
      });
    await request(url).post("/api/groups/get_group_info").expect(ErrorCode.BadRequest)
      .expect((res) => {
        expect(res.body.hasOwnProperty("error")).toBeTruthy();
      });
  });
});
