import { test, expect } from "../../src/fixtures";
import { STATUS } from "../../src/api/status";
import { ENDPOINT } from "../../src/api/endpoints";

test.describe("GET /booking", () => {
  test("lists booking ids @smoke", async ({ api }) => {
    const response = await api.path(ENDPOINT.BOOKING).getRequest(STATUS.OK_200);
    await expect(response).shouldMatchSchema("booking", "GET_booking");
    expect(response.length).toBeGreaterThan(0);
  });

  test("filters by firstname", async ({ api, createdBooking }) => {
    const response = await api
      .path(ENDPOINT.BOOKING)
      .params({ firstname: createdBooking.data.firstname })
      .getRequest(STATUS.OK_200);
    await expect(response).shouldMatchSchema("booking", "GET_booking");
    expect(response).toContainEqual({ bookingid: createdBooking.id });
  });
});

test.describe("GET /booking/:id", () => {
  test("returns the booking", async ({ api, createdBooking }) => {
    const response = await api
      .path(`${ENDPOINT.BOOKING}/${createdBooking.id}`)
      .getRequest(STATUS.OK_200);
    await expect(response).shouldMatchSchema("booking", "booking");
    expect(response).shouldEqual(createdBooking.data);
  });

  test("unknown id returns 404", async ({ api }) => {
    await api.path(`${ENDPOINT.BOOKING}/99999999`).getRequest(404);
  });
});
