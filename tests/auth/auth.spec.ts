import { env } from "../../src/config/env";
import { test, expect } from "../../src/fixtures";
import { STATUS } from "../../src/api/status";
import { ENDPOINT } from "../../src/api/endpoints";

test.describe("POST /auth", () => {
  test("valid credentials return a token @smoke", async ({ api }) => {
    const response = await api
      .path(ENDPOINT.AUTH)
      .body({ username: env.username, password: env.password })
      .clearAuth()
      .postRequest(STATUS.OK_200);
    await expect(response).shouldMatchSchema("auth", "POST_auth");
    expect(response.token.length).toBeGreaterThan(5);
  });

  test("invalid credentials return a reason and no token", async ({ api }) => {
    const response = await api
      .path(ENDPOINT.AUTH)
      .body({ username: "admin", password: "wrong-password" })
      .clearAuth()
      .postRequest(STATUS.OK_200); //  200, not 401
    expect(response).shouldEqual({ reason: "Bad credentials" });
  });
});
