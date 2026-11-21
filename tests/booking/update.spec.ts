import { buildBooking } from "../../src/data/bookingFactory";
import { test, expect } from "../../src/fixtures";
import { STATUS } from "../../src/api/status";
import { ENDPOINT } from "../../src/api/endpoints";

test.describe("PUT /booking/:id", () => {
  test("full update with a token replaces the booking", async ({
    api,
    createdBooking,
  }) => {
    const updated = buildBooking({ totalprice: 999, depositpaid: false });
    const response = await api
      .path(`${ENDPOINT.BOOKING}/${createdBooking.id}`)
      .body(updated)
      .putRequest(STATUS.OK_200);
      
    await expect(response).shouldMatchSchema("booking", "booking");
    expect(response).shouldEqual(updated);

    const fetched = await api
      .path(`${ENDPOINT.BOOKING}/${createdBooking.id}`)
      .getRequest(STATUS.OK_200);
    expect(fetched).shouldEqual(updated);
  });

  test("update without a token is forbidden", async ({
    api,
    createdBooking,
  }) => {
    await api
      .path(`${ENDPOINT.BOOKING}/${createdBooking.id}`)
      .body(buildBooking())
      .clearAuth()
      .putRequest(STATUS.FORBIDDEN_403);
  });
});

test.describe("PATCH /booking/:id", () => {
  test("changes only the given fields", async ({ api, createdBooking }) => {
    const response = await api
      .path(`${ENDPOINT.BOOKING}/${createdBooking.id}`)
      .body({ firstname: "Patched" })
      .patchRequest(STATUS.OK_200);

    await expect(response).shouldMatchSchema("booking", "booking");

    expect(response).shouldEqual({
      ...createdBooking.data,
      firstname: "Patched",
    });
  });
});
