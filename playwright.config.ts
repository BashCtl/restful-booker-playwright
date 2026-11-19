import { defineConfig } from "@playwright/test";
import { env } from "./src/config/env";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : 4,
  timeout: 30_000,
  expect: { timeout: 10_000 },

  reporter: isCI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: env.baseUrl,
    extraHTTPHeaders: {
      Accept: "application/json",
    },
    trace: "retain-on-failure",
  },

  projects: [{ name: "api" }],
});
