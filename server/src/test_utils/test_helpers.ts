import request, {Response} from "supertest";
import {ErrorCode} from "../utils/error_messages";
import {
  CategoryInfo,
  GroupInfo,
  SimpleCategoryInterface,
  SimpleGroupInterface,
  SimpleSpendingInterface,
  SpendingInfo
} from "./test_interfaces"
import {logDebug} from "../utils/logger";

export const url = "http://localhost:3001";

function AreTwoArraysTheSame(first_array_of_objects: any[], second_array_of_objects: any[]): boolean {
  try {
    const answer = (
      first_array_of_objects.length === second_array_of_objects.length &&
      first_array_of_objects.every((element_1) =>
                                     second_array_of_objects.some((element_2) =>
                                                                    Object.keys(element_1).every(
                                                                      (key) => element_1[key] ===
                                                                               element_2[key])
                                     )
      ));
    if (!answer) {
      logDebug(JSON.stringify(first_array_of_objects));
      logDebug(JSON.stringify(second_array_of_objects));
    }
    return answer;
  } catch {
    logDebug(JSON.stringify(first_array_of_objects));
    logDebug(JSON.stringify(second_array_of_objects));
    return false;
  }
}

export namespace Helpers {
  export async function CheckGroupDoesNotExist(group_id: number) {
    await request(url).post('/api/groups/get_group_info').expect(ErrorCode.BadRequest)
      .send({group_id: group_id})
      .expect((res) => {
        expect(res.body.hasOwnProperty('error')).toBeTruthy();
      });
  }

  export async function CheckCategoryDoesNotExist(category_id: number) {
    await request(url).post('/api/categories/get_category_info').expect(ErrorCode.BadRequest)
      .send({category_id: category_id})
      .expect((res) => {
        expect(res.body.hasOwnProperty('error')).toBeTruthy();
      });
  }

  export async function CheckSpendingDoesNotExist(spending_id: number) {
    await request(url).post('/api/spendings/get_spending_info').expect(ErrorCode.BadRequest)
      .send({spending_id: spending_id})
      .expect((res) => {
        expect(res.body.hasOwnProperty('error')).toBeTruthy();
      });
  }

  export function CheckGroupInfo(res: Response, expected_info: GroupInfo) {
    expect(res.body.hasOwnProperty('group_id')).toBeTruthy();
    expect(res.body.hasOwnProperty('description')).toBeTruthy();
    expect(res.body.hasOwnProperty('categories')).toBeTruthy();
    expect(res.body.group_id).toEqual(expected_info.group_id);
    expect(res.body.description).toEqual(expected_info.description);
    expect(AreTwoArraysTheSame(res.body.categories, expected_info.categories)).toBeTruthy();
  }

  export function CheckCategoriesInfo(res: Response, expected_info: CategoryInfo) {
    expect(res.body.hasOwnProperty('category_id')).toBeTruthy();
    expect(res.body.hasOwnProperty('description')).toBeTruthy();
    expect(res.body.hasOwnProperty('group_id')).toBeTruthy();
    expect(res.body.hasOwnProperty('spendings')).toBeTruthy();
    expect(res.body.category_id).toEqual(expected_info.category_id);
    expect(res.body.description).toEqual(expected_info.description);
    expect(res.body.group_id).toEqual(expected_info.group_id);
    expect(AreTwoArraysTheSame(res.body.spendings, expected_info.spendings)).toBeTruthy();
  }

  export function CheckSpendingInfo(res: Response, expected_info: SpendingInfo) {
    expect(res.body.hasOwnProperty("spending_id")).toBeTruthy();
    expect(res.body.hasOwnProperty("description")).toBeTruthy();
    expect(res.body.hasOwnProperty("value")).toBeTruthy();
    expect(res.body.hasOwnProperty("currency")).toBeTruthy();
    expect(res.body.hasOwnProperty("date")).toBeTruthy();
    expect(res.body.hasOwnProperty("categories")).toBeTruthy();
    expect(res.body.spending_id).toEqual(expected_info.spending_id);
    expect(res.body.description).toEqual(expected_info.description);
    expect(res.body.value).toEqual(expected_info.value);
    expect(res.body.currency).toEqual(expected_info.currency);
    expect(res.body.date).toEqual(expected_info.date);
    expect(AreTwoArraysTheSame(res.body.categories, expected_info.categories)).toBeTruthy();
  }

  export async function CreateNonExistingGroup(): Promise<number> {
    const description = "group";
    let group_id = 0;
    await request(url).post('/api/groups/add_group').expect(200)
      .send({description: description})
      .expect((res) => {
        expect(res.body.hasOwnProperty('group_id')).toBeTruthy();
        group_id = res.body.group_id;
      });
    await request(url).post('/api/groups/delete_group').expect(200)
      .send({group_id: group_id})
      .expect({});
    return group_id;
  }

  export async function CreateNonExistingCategory(): Promise<number> {
    const group_description = "group";
    let group_id = 0;
    await request(url).post('/api/groups/add_group').expect(200)
      .send({description: group_description})
      .expect((res) => {
        expect(res.body.hasOwnProperty('group_id')).toBeTruthy();
        group_id = res.body.group_id;
      });
    const description = "category";
    let category_id = 0;
    await request(url).post('/api/categories/add_category').expect(200)
      .send({description: description, group_id: group_id})
      .expect((res) => {
        expect(res.body.hasOwnProperty('category_id')).toBeTruthy();
        category_id = res.body.category_id;
      });
    await request(url).post('/api/categories/delete_category').expect(200)
      .send({category_id: category_id});
    await request(url).post('/api/groups/delete_group').expect(200)
      .send({group_id: group_id});
    return category_id;
  }

  export async function CreateGroupCategoryAndSpending(group: SimpleGroupInterface,
                                                       category: SimpleCategoryInterface,
                                                       spending: SimpleSpendingInterface) {
    await request(url).post("/api/groups/add_group").expect(200)
      .send({description: group.description})
      .expect((res) => {
        group.group_id = res.body.group_id;
      });
    await request(url).post("/api/categories/add_category").expect(200)
      .send({description: category.description, group_id: group.group_id})
      .expect((res) => {
        category.category_id = res.body.category_id;
      });
    await request(url).post("/api/spendings/add_spending").expect(200)
      .send({
        description: spending.description,
        value: spending.value,
        currency: spending.currency,
        date: spending.date,
      })
      .expect((res) => {
        expect(res.body.hasOwnProperty("spending_id")).toBeTruthy();
        spending.spending_id = res.body.spending_id;
      });
  }

  export async function DeleteGroupCategoryAndSpending(group_id: number, category_id: number, spending_id: number) {
    await request(url).post("/api/spendings/delete_spending").expect(200)
      .send({spending_id: spending_id});
    await request(url).post("/api/categories/delete_category").expect(200)
      .send({category_id: category_id});
    await request(url).post("/api/groups/delete_group").expect(200)
      .send({group_id: group_id});
    await Helpers.CheckGroupDoesNotExist(group_id);
    await Helpers.CheckCategoryDoesNotExist(category_id);
    await Helpers.CheckSpendingDoesNotExist(spending_id);
  }
}
