import { APIRequestContext, APIResponse, test } from "@playwright/test";
import { APILogger } from "../utils/logger";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class RequestHandler {
  private apiPath = "";
  private queryParams: Record<string, string | number | boolean> = {};
  private apiHeaders: Record<string, string> = {};
  private apiBody: object | undefined;
  private skipAuth = false;

  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
    private readonly logger: APILogger,
    private readonly authToken = "",
  ) {}

  path(path: string) {
    this.apiPath = path;
    return this;
  }

  params(params: Record<string, string | number | boolean>) {
    this.queryParams = params;
    return this;
  }

  headers(headers: Record<string, string>) {
    this.apiHeaders = headers;
    return this;
  }

  body(body: object) {
    this.apiBody = body;
    return this;
  }

  clearAuth() {
    this.skipAuth = true;
    return this;
  }

  getRequest(expectedStatus: number) {
    return this.send("GET", expectedStatus);
  }

  postRequest(expectedStatus: number) {
    return this.send("POST", expectedStatus);
  }

  putRequest(expectedStatus: number) {
    return this.send("PUT", expectedStatus);
  }

  patchRequest(expectedStatus: number) {
    return this.send("PATCH", expectedStatus);
  }

  deleteRequest(expectedStatus: number) {
    return this.send("DELETE", expectedStatus);
  }

  private async send(method: Method, expectedStatus: number): Promise<any> {
    const url = this.buildUrl();
    const headers = this.buildHeaders();
    const data = this.apiBody;
    this.reset();

    return test.step(`${method} ${url}`, async () => {
      this.logger.logRequest(method, url, headers, data);
      const response = await this.request.fetch(url, { method, headers, data });
      const body = await this.parseBody(response);

      this.logger.logResponse(response.status(), body);

      if (response.status() !== expectedStatus) {
        throw new Error(
          `Expected status ${expectedStatus} but got
${response.status()}\n\n` +
            `Recent API activity:\n${this.logger.getRecentLogs()}`,
        );
      }
      return body;
    });
  }

  private buildUrl(): string {
    const url = new URL(`${this.baseUrl}${this.apiPath}`);

    for (const [key, value] of Object.entries(this.queryParams)) {
      url.searchParams.append(key, String(value));
    }

    return url.toString();
  }

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...this.apiHeaders,
    };

    if (this.authToken && !this.skipAuth && !headers.Cookie) {
      headers.Cookie = `token=${this.authToken}`;
    }

    return headers;
  }

  private async parseBody(response: APIResponse): Promise<unknown> {
    const text = await response.text();

    if (!text) return undefined;

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  private reset(): void {
    this.apiPath = "";
    this.queryParams = {};
    this.apiHeaders = {};
    this.apiBody = undefined;
    this.skipAuth = false;
  }
}
