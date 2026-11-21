import { test } from "../../src/fixtures";
import { ENDPOINT } from "../../src/api/endpoints";
import { STATUS } from "../../src/api/status";

test.describe("DELETE /booking/:id", () => {
  test("deletes a booking, then it is gone", async ({
    api,
    createdBooking,
  }) => {
    await api
      .path(`${ENDPOINT.BOOKING}/${createdBooking.id}`)
      .deleteRequest(STATUS.CREATED_201); //  201, not 204
    await api
      .path(`${ENDPOINT.BOOKING}/${createdBooking.id}`)
      .getRequest(STATUS.NOT_FOUND_404);
  });

  test("delete without a token is forbidden", async ({
    api,
    createdBooking,
  }) => {
    await api
      .path(`${ENDPOINT.BOOKING}/${createdBooking.id}`)
      .clearAuth()
      .deleteRequest(STATUS.FORBIDDEN_403);
  });
});
