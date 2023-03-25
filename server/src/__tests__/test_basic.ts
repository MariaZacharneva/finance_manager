import request from "supertest";
import {url} from "../test_utils/test_helpers";
import {ErrorCode, ErrorString} from "../utils/error_messages";

describe("Testing connection with server", () => {
  it("Response with connection true", async () => {
    request(url)
      .get("/api")
      .expect(200)
      .expect((res) => {
        expect(res.body.hasOwnProperty("connection")).toBeTruthy();
        expect(res.body.connection).toBeTruthy();
      });
  });
  it("Expected error", async () => {
    request(url)
      .get("/api/non_existing_path")
      .expect(ErrorCode.NotFound)
      .expect((res) => {
        expect(res.body.hasOwnProperty("error")).toBeTruthy();
        expect(res.body.error).toEqual(ErrorString.NotFound);
      })
  });
});