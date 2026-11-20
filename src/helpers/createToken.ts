import { request } from "@playwright/test";
import { env } from "../config/env";
import { APILogger } from "../utils/logger";
import { RequestHandler } from "../api/request-handler";
import { STATUS } from "../api/status";

export async function createToken(
  username: string,
  password: string,
): Promise<string> {
  const context = await request.newContext();
  try {
    const api = new RequestHandler(context, env.baseUrl, new APILogger());
    const response = await api
      .path("/auth")
      .body({ username, password })
      .postRequest(STATUS.OK_200);
    if (!response?.token) {
      throw new Error(`Login failed: ${JSON.stringify(response)}`);
    }
    return response.token as string;
  } finally {
    await context.dispose();
  }
}
