import { test as base } from "@playwright/test";
import { env } from "../config/env";
import { buildBooking } from "../data/bookingFactory";
import { createToken } from "../helpers/createToken";
import { Booking } from "../types/booking";
import { setCustomExpectLogger } from "../utils/custom-expect";
import { APILogger } from "../utils/logger";
import { RequestHandler } from "../api/request-handler";

type TestFixtures = {
  api: RequestHandler;
  createdBooking: { id: number; data: Booking };
};

type WorkerFixtures = {
  authToken: string;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  authToken: [
    async ({}, use) => {
      await use(await createToken(env.username, env.password));
    },
    { scope: "worker" },
  ],
  api: async ({ request, authToken }, use) => {
    const logger = new APILogger();
    setCustomExpectLogger(logger);
    await use(new RequestHandler(request, env.baseUrl, logger, authToken));
  },
  createdBooking: async ({ api, request, authToken }, use) => {
    const data = buildBooking();
    const created = await api.path("/booking").body(data).postRequest(200);
    const id: number = created.bookingid;
    await use({ id, data });

    await request.delete(`${env.baseUrl}/booking/${id}`, {
      headers: { Cookie: `token=${authToken}` },
    });
  },
});
export { expect } from "../utils/custom-expect";
