import dotenv from "dotenv";

dotenv.config();

export const env = {
  baseUrl: process.env.BASE_URL ?? "https://restful-booker.herokuapp.com",
  username: process.env.RB_USERNAME ?? "admin",
  password: process.env.RB_PASSWORD ?? "password123",
} as const;
