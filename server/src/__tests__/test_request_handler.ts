import request from "supertest";
import {ErrorCode, PostgresErrorString} from "../utils/error_messages";
import {CategoryInfo, GroupInfo, SimpleCategoryInterface, SimpleGroupInterface, TestUtils} from "../utils/test_utils";
import CheckGroupInfo = TestUtils.CheckGroupInfo;
import CheckCategoriesInfo = TestUtils.CheckCategoriesInfo;
import CheckGroupDoesNotExist = TestUtils.CheckGroupDoesNotExist;
import CheckCategoryDoesNotExist = TestUtils.CheckCategoryDoesNotExist;

const url = 'http://localhost:3001'

describe('Testing connection with server', () => {
  it('Response with connection true', (done) => {
    request(url)
      .get('/api')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect('{"connection":true}', done);
  });
});

describe('Testing groups functionality', () => {
  it('Add, update and delete group', async () => {
    const expected_info: GroupInfo = {
      group_id: 0,
      description: "group",
      categories: [],
    }
    const new_description = "group two";
    let groups_number = 0;
    await request(url).post('/api/groups/get_all_groups').expect(200)
      .expect((res) => {
        expect(res.body.hasOwnProperty('groups')).toBeTruthy();
        groups_number = res.body.groups.length;
      })
    await request(url).post('/api/groups/add_group').expect(200)
      .send({description: expected_info.description})
      .expect((res) => {
        expect(res.body.hasOwnProperty('group_id')).toBeTruthy();
        expected_info.group_id = res.body.group_id;
      });
    await request(url).post('/api/groups/update_group').expect(200)
      .send({description: new_description, group_id: expected_info.group_id})
      .expect({});
    expected_info.description = new_description;
    await request(url).post('/api/groups/get_group_info').expect(200)
      .send({group_id: expected_info.group_id})
      .expect((res) => {
        CheckGroupInfo(res, expected_info);
      })
    await request(url).post('/api/groups/delete_group').expect(200)
      .send({group_id: expected_info.group_id})
      .expect({});
    await request(url).post('/api/groups/get_all_groups').expect(200)
      .expect((res) => {
        expect(res.body.hasOwnProperty('groups')).toBeTruthy();
        expect(groups_number).toEqual(res.body.groups.length);
      })
  });

  it('Empty parameters', async () => {
    await request(url).post('/api/groups/add_group').expect(ErrorCode.BadRequest)
      .expect((res) => {
        expect(res.body.hasOwnProperty('error')).toBeTruthy();
      });
    await request(url).post('/api/groups/update_group').expect(ErrorCode.BadRequest)
      .expect((res) => {
        expect(res.body.hasOwnProperty('error')).toBeTruthy();
      });
    await request(url).post('/api/groups/delete_group').expect(ErrorCode.BadRequest)
      .expect((res) => {
        expect(res.body.hasOwnProperty('error')).toBeTruthy();
      });
    await request(url).post('/api/groups/get_group_info').expect(ErrorCode.BadRequest)
      .expect((res) => {
        expect(res.body.hasOwnProperty('error')).toBeTruthy();
      });
  });

  it('Non-existing group', async () => {
    let group_id = 0;
    const description = "description";
    await request(url).post('/api/groups/add_group').expect(200)
      .send({description: description})
      .expect((res) => {
        expect(res.body.hasOwnProperty('group_id')).toBeTruthy();
        group_id = res.body.group_id;
      });
    await request(url).post('/api/groups/delete_group').expect(200)
      .send({group_id: group_id})
      .expect({});
    await request(url).post('/api/groups/update_group').expect(200)
      .send({group_id: group_id, description: "blablabla"})
      .expect({});
    await CheckGroupDoesNotExist(url, group_id);
  })
});

describe("Testing category functionality", () => {
  it("Add, update and delete category", async () => {
    const category_1: CategoryInfo = {
      category_id: 0,
      description: "category",
      group_id: 0,
      spendings: [],
    }
    const group_1: SimpleGroupInterface = {
      group_id: 0,
      description: "group",
    }
    const group_2: SimpleGroupInterface = {
      group_id: 0,
      description: "group",
    }
    let categories_number = 0;
    await request(url).post('/api/groups/add_group').expect(200)
      .send({description: group_1.description})
      .expect((res) => {
        expect(res.body.hasOwnProperty('group_id')).toBeTruthy();
        group_1.group_id = res.body.group_id;
      });
    await request(url).post('/api/groups/add_group').expect(200)
      .send({description: group_2.description})
      .expect((res) => {
        expect(res.body.hasOwnProperty('group_id')).toBeTruthy();
        group_2.group_id = res.body.group_id;
      });
    await request(url).post('/api/categories/get_all_categories').expect(200)
      .expect((res) => {
        expect(res.body.hasOwnProperty('categories')).toBeTruthy();
        categories_number = res.body.categories.length;
      });
    category_1.group_id = group_1.group_id;
    await request(url).post('/api/categories/add_category').expect(200)
      .send({description: category_1.description, group_id: category_1.group_id})
      .expect((res) => {
        expect(res.body.hasOwnProperty('category_id')).toBeTruthy();
        category_1.category_id = res.body.category_id;
      });
    await request(url).post('/api/categories/get_category_info').expect(200)
      .send({category_id: category_1.category_id})
      .expect((res) => {
        CheckCategoriesInfo(res, category_1);
      })
    // Moving category to another group and changing description
    category_1.group_id = group_2.group_id;
    category_1.description = "category - 2";
    await request(url).post('/api/categories/update_category').expect(200)
      .send({
        category_id: category_1.category_id,
        description: category_1.description,
        group_id: category_1.group_id,
      }).expect({});
    await request(url).post('/api/categories/get_category_info').expect(200)
      .send({category_id: category_1.category_id})
      .expect((res) => {
        CheckCategoriesInfo(res, category_1);
      })
    await request(url).post('/api/categories/delete_category').expect(200)
      .send({category_id: category_1.category_id})
      .expect({})
    await request(url).post('/api/groups/delete_group').expect(200)
      .send({group_id: group_1.group_id}).expect({})
    await CheckGroupDoesNotExist(url, group_1.group_id);
    await request(url).post('/api/groups/delete_group').expect(200)
      .send({group_id: group_2.group_id}).expect({})
    await CheckGroupDoesNotExist(url, group_2.group_id);
  })

  it("Get group info with categories", async () => {
    const category_1: SimpleCategoryInterface = {
      category_id: 0,
      description: "category",
    }
    const group_1: GroupInfo = {
      group_id: 0,
      description: "group",
      categories: [],
    }
    await request(url).post('/api/groups/add_group').expect(200)
      .send({description: group_1.description})
      .expect((res) => {
        expect(res.body.hasOwnProperty('group_id')).toBeTruthy();
        group_1.group_id = res.body.group_id;
      });
    await request(url).post('/api/categories/add_category').expect(200)
      .send({description: category_1.description, group_id: group_1.group_id})
      .expect((res) => {
        expect(res.body.hasOwnProperty('category_id')).toBeTruthy();
        category_1.category_id = res.body.category_id;
      });
    group_1.categories.push(category_1);

    await request(url).post('/api/groups/get_group_info').expect(200)
      .send({group_id: group_1.group_id})
      .expect((res) => {
        CheckGroupInfo(res, group_1);
      })
  });

  it("Empty parameters", async () => {
    await request(url).post('/api/categories/add_category').expect(ErrorCode.BadRequest)
      .expect((res) => {
        expect(res.body.hasOwnProperty('error')).toBeTruthy();
      });
    await request(url).post('/api/categories/update_category').expect(ErrorCode.BadRequest)
      .expect((res) => {
        expect(res.body.hasOwnProperty('error')).toBeTruthy();
      });
    await request(url).post('/api/categories/delete_category').expect(ErrorCode.BadRequest)
      .expect((res) => {
        expect(res.body.hasOwnProperty('error')).toBeTruthy();
      });
  });

  it("Add category to non-existing group", async () => {
    const category_1: SimpleCategoryInterface = {
      category_id: 0,
      description: "category",
    }
    const group_1: SimpleGroupInterface = {
      group_id: 0,
      description: "group",
    }
    await request(url).post('/api/groups/add_group').expect(200)
      .send({description: group_1.description})
      .expect((res) => {
        expect(res.body.hasOwnProperty('group_id')).toBeTruthy();
        group_1.group_id = res.body.group_id;
      });
    await request(url).post('/api/groups/delete_group').expect(200)
      .send({group_id: group_1.group_id}).expect({});
    await request(url).post('/api/categories/add_category').expect(ErrorCode.MethodNotAllowed)
      .send({description: category_1.description, group_id: group_1.group_id})
      .expect((res) => {
        expect(res.body.hasOwnProperty('error')).toBeTruthy();
        expect(res.body.error).toEqual(PostgresErrorString.ForeignKeyViolation);
      });
    await CheckCategoryDoesNotExist(url, category_1.category_id);
  });

  it("Delete non-empty group with all categories", async () => {
    const category_1: SimpleCategoryInterface = {
      category_id: 0,
      description: "category",
    }
    const group_1: GroupInfo = {
      group_id: 0,
      description: "group",
      categories: [],
    }
    await request(url).post('/api/groups/add_group').expect(200)
      .send({description: group_1.description})
      .expect((res) => {
        expect(res.body.hasOwnProperty('group_id')).toBeTruthy();
        group_1.group_id = res.body.group_id;
      });
    await request(url).post('/api/categories/add_category').expect(200)
      .send({description: category_1.description, group_id: group_1.group_id})
      .expect((res) => {
        expect(res.body.hasOwnProperty('category_id')).toBeTruthy();
        category_1.category_id = res.body.category_id;
      });
    await request(url).post('/api/groups/delete_group').expect(200)
      .send({group_id: group_1.group_id}).expect({});
    await CheckGroupDoesNotExist(url, group_1.group_id);
    await CheckCategoryDoesNotExist(url, category_1.category_id);
  });
});