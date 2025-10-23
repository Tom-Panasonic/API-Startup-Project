import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { config } from "dotenv";

// 環境変数を読み込み
config();

// MySQL接続設定
const connectionConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "apiuser",
  password: process.env.DB_PASSWORD || "apipassword",
  database: process.env.DB_NAME || "api_startup_db",
};

// MySQL接続プールを作成
const poolConnection = mysql.createPool(connectionConfig);

// Drizzle ORMインスタンスを作成
export const db = drizzle(poolConnection);

// 接続テスト関数
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await poolConnection.getConnection();
    await connection.ping();
    connection.release();
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

// データベース接続を終了する関数
export async function closeConnection(): Promise<void> {
  try {
    await poolConnection.end();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error closing database connection:", error);
  }
}
