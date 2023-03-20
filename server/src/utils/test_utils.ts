import request, {Response} from "supertest";
import assert from "assert";
import {ErrorCode} from "./error_messages";
import {logInfo} from "./logger";

export interface SimpleGroupInterface {
  group_id: number,
  description: string,
}

export interface SimpleCategoryInterface {
  category_id: number,
  description: string,
}

export interface SimpleSpendingInterface {
  spending_id: number,
  description: number,
  value: number,
  currency: string,
  date: Date,
}

export interface GroupInfo {
  group_id: number,
  description: string,
  categories: SimpleCategoryInterface []
}

export interface CategoryInfo {
  category_id: number,
  description: string,
  group_id: number,
  spendings: SimpleSpendingInterface []
}

function AreTwoArraysTheSame(first_array_of_objects :any[], second_array_of_objects: any[]) {
  return (
    first_array_of_objects.length === second_array_of_objects.length &&
    first_array_of_objects.every((element_1) =>
      second_array_of_objects.some((element_2) =>
        Object.keys(element_1).every((key) => element_1[key] === element_2[key])
      )
    )
  );
}

export namespace TestUtils {
  export async function CheckGroupDoesNotExist(url: string, group_id: number) {
    await request(url).post('/api/groups/get_group_info').expect(ErrorCode.BadRequest)
      .send({group_id: group_id})
      .expect((res) => {
        expect(res.body.hasOwnProperty('error')).toBeTruthy();
      });
  }

  export async function CheckCategoryDoesNotExist(url: string, category_id: number) {
    await request(url).post('/api/categories/get_category_info').expect(ErrorCode.BadRequest)
      .send({category_id: category_id})
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
}