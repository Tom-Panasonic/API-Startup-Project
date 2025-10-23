import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "dotenv";
import apiRoutes from "./routes/api";
import { testConnection } from "./db/connection";

// 環境変数を読み込み
config();

const app = express();
const PORT = process.env.PORT || 3000;

// セキュリティミドルウェア
app.use(helmet());

// CORS設定
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// リクエストボディのパース
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 静的ファイル配信（API仕様書とSwagger UI）
app.use("/api-spec", express.static("api-spec"));

// ルートハンドラー
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to API Startup Project!",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      health: "/health",
    },
    documentation: {
      swagger: "/api-spec/",
      openapi: "/api-spec/openapi.yaml",
    },
    admin: {
      phpmyadmin: "http://localhost:8080",
      drizzle: "Run 'npm run db:studio'",
    },
  });
});

// ヘルスチェック
app.get("/health", async (req, res) => {
  try {
    const dbStatus = await testConnection();
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus ? "connected" : "disconnected",
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "Error",
      timestamp: new Date().toISOString(),
      error: "Health check failed",
    });
  }
});

// APIルートを登録
app.use("/api", apiRoutes);

// 404ハンドラー
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    },
  });
});

// エラーハンドリングミドルウェア
app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", error);

    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      },
    });
  }
);

// サーバー起動
async function startServer() {
  try {
    // データベース接続テスト
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error(
        "❌ Failed to connect to database. Please check your database configuration."
      );
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(
        `📖 API Documentation: http://localhost:${PORT}/api-spec/openapi.yaml`
      );
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log(`📝 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n📴 Server shutting down...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n📴 Server shutting down...");
  process.exit(0);
});

// サーバー起動
startServer();
