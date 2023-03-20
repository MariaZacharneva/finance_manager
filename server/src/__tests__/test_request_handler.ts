import request from "supertest";
import assert from "assert";

const url = 'http://localhost:3001'

describe('Testing connection with server', () => {
  it('Response with connection true', (done) => {
    request(url)
      .get('/api')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect('{"connection":true}', done);
  });
});

describe('Testing groups functionality', () => {
  it('Add new group', (done) => {
    const data = {
      description: "group_one"
    }
    request(url)
      .post('/api/groups/add_group')
      .send(data)
      .expect('{"group_id":1}', done);
  });
});