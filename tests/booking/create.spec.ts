import { buildBooking } from "../../src/data/bookingFactory";
import { test, expect } from "../../src/fixtures";
import { STATUS } from "../../src/api/status";
import { ENDPOINT } from "../../src/api/endpoints";

test.describe("POST /booking", () => {
  test("creates a booking and echoes the payload @smoke", async ({ api }) => {
    const payload = buildBooking();
    const response = await api
      .path(ENDPOINT.BOOKING)
      .body(payload)
      .postRequest(STATUS.OK_200);
    await expect(response).shouldMatchSchema("booking", "POST_booking");
    expect(response.booking).shouldEqual(payload);
    await api
      .path(`/booking/${response.bookingid}`)
      .deleteRequest(STATUS.CREATED_201);
  });

  test("payload missing required fields is rejected", async ({ api }) => {
    await api
      .path(ENDPOINT.BOOKING)
      .body({ firstname: "OnlyName" })
      .postRequest(STATUS.INTERNAL_SERVER_ERROR_500);
  });
});
