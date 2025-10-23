import { int, mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// ユーザーテーブル
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  age: int("age").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    .notNull(),
});

// TypeScriptの型定義
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
