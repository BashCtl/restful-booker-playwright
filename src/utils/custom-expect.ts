import { expect as baseExpect } from "@playwright/test";
import { APILogger } from "./logger";
import { validateSchema } from "./schema-validator";

let apiLogger: APILogger | undefined;
export const setCustomExpectLogger = (logger: APILogger) => {
  apiLogger = logger;
};
const recentLogs = () =>
  apiLogger?.getRecentLogs() ?? "(no API activity logged)";

declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T> {
      shouldEqual(expected: unknown): R;
      shouldMatchSchema(
        dirName: string,
        fileName: string,
        createSchemaFlag?: boolean,
      ): Promise<R>;
    }
  }
}

export const expect = baseExpect.extend({
  async shouldMatchSchema(
    received: unknown,
    dirName: string,
    fileName: string,
    createSchemaFlag = false,
  ) {
    try {
      await validateSchema(dirName, fileName, received, createSchemaFlag);
      return { pass: true, message: () => "Schema validation passed." };
    } catch (e) {
      return {
        pass: false,
        message: () => `${(e as Error).message}\n\nRecent API
activity:\n${recentLogs()}`,
      };
    }
  },

  shouldEqual(received: unknown, expected: unknown) {
    let pass: boolean;
    try {
      baseExpect(received).toEqual(expected);
      pass = true;
    } catch {
      pass = false;
    }
    const hint = this.isNot ? "not " : "";
    return {
      pass,
      message: () =>
        this.utils.matcherHint("shouldEqual", undefined, undefined, {
          isNot: this.isNot,
        }) +
        `\n\nExpected: ${hint}${this.utils.printExpected(expected)}\n` +
        `Received: ${this.utils.printReceived(received)}\n\n` +
        `Recent API activity:\n${recentLogs()}`,
    };
  },
});
