import dotenv from "dotenv";

dotenv.config();

const environments = {
  public: { baseUrl: "https://restful-booker.herokuapp.com" },
  local: { baseUrl: "http://localhost:3001" },
} as const;

type EnvName = keyof typeof environments;
const name = (process.env.TEST_ENV ?? "public") as EnvName;
if (!(name in environments)) {
  throw new Error(`Unknown TEST_ENV "${name}". Use one of:
${Object.keys(environments).join(", ")}`);
}

console.log(`Test environment: ${name}`);

export const env = {
  name,
  baseUrl: process.env.BASE_URL ?? environments[name].baseUrl,
  username: process.env.RB_USERNAME ?? "admin",
  password: process.env.RB_PASSWORD ?? "password123",
} as const;
