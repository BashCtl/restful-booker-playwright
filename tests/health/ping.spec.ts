import { test } from "../../src/fixtures";
import { STATUS } from "../../src/api/status";
import { ENDPOINT } from "../../src/api/endpoints";

test("GET /ping responds @smoke", async ({ api }) => {
  // the health check answers 201, not 200
  await api.path(ENDPOINT.PING).clearAuth().getRequest(STATUS.CREATED_201);
});
