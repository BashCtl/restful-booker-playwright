import { buildBooking } from "../../src/data/bookingFactory";
import { test, expect } from "../../src/fixtures";
import { ENDPOINT } from "../../src/api/endpoints";
import { STATUS } from "../../src/api/status";

test("booking lifecycle: create > read > update > patch > delete @smoke", async ({
  api,
}) => {
  const original = buildBooking();
  let id = 0;
  await test.step("create", async () => {
    const response = await api
      .path(ENDPOINT.BOOKING)
      .body(original)
      .postRequest(STATUS.OK_200);
    await expect(response).shouldMatchSchema("booking", "POST_booking");
    id = response.bookingid;
  });

  await test.step("read", async () => {
    const response = await api
      .path(`${ENDPOINT.BOOKING}/${id}`)
      .getRequest(STATUS.OK_200);
    expect(response).shouldEqual(original);
  });

  await test.step("full update", async () => {
    const replacement = buildBooking({ totalprice: 500 });
    const response = await api
      .path(`${ENDPOINT.BOOKING}/${id}`)
      .body(replacement)
      .putRequest(STATUS.OK_200);
    expect(response).shouldEqual(replacement);
  });

  await test.step("partial update", async () => {
    const response = await api
      .path(`${ENDPOINT.BOOKING}/${id}`)
      .body({ additionalneeds: "Late checkout" })
      .patchRequest(STATUS.OK_200);
    expect(response.additionalneeds).shouldEqual("Late checkout");
  });

  await test.step("delete", async () => {
    await api
      .path(`${ENDPOINT.BOOKING}/${id}`)
      .deleteRequest(STATUS.CREATED_201);
    await api
      .path(`${ENDPOINT.BOOKING}/${id}`)
      .getRequest(STATUS.NOT_FOUND_404);
  });
});
