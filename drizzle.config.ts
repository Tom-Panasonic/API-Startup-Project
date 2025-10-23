import type { Config } from "drizzle-kit";
import { config } from "dotenv";

// 環境変数を読み込み
config();

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  driver: "mysql2",
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "apiuser",
    password: process.env.DB_PASSWORD || "apipassword",
    database: process.env.DB_NAME || "api_startup_db",
  },
  verbose: true,
  strict: true,
} satisfies Config;
