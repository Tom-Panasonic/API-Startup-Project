import { Router, Request, Response } from "express";
import { db } from "../db/connection";
import { users } from "../db/schema";
import { eq, count } from "drizzle-orm";
import {
  ApiResponse,
  UsersListResponse,
  CreateUserRequest,
  ErrorCode,
  ValidationError,
} from "../types";

const router = Router();

// バリデーション関数
function validateCreateUserRequest(body: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (
    !body.name ||
    typeof body.name !== "string" ||
    body.name.trim().length === 0
  ) {
    errors.push({ field: "name", message: "ユーザー名は必須です" });
  } else if (body.name.length > 100) {
    errors.push({
      field: "name",
      message: "ユーザー名は100文字以内で入力してください",
    });
  }

  if (!body.email || typeof body.email !== "string") {
    errors.push({ field: "email", message: "メールアドレスは必須です" });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      errors.push({
        field: "email",
        message: "正しいメールアドレス形式で入力してください",
      });
    } else if (body.email.length > 255) {
      errors.push({
        field: "email",
        message: "メールアドレスは255文字以内で入力してください",
      });
    }
  }

  if (body.age === undefined || body.age === null) {
    errors.push({ field: "age", message: "年齢は必須です" });
  } else if (typeof body.age !== "number" || !Number.isInteger(body.age)) {
    errors.push({ field: "age", message: "年齢は整数で入力してください" });
  } else if (body.age < 0 || body.age > 150) {
    errors.push({
      field: "age",
      message: "年齢は0歳から150歳の間で入力してください",
    });
  }

  return errors;
}

// GET /api/users - ユーザー一覧取得
router.get("/users", async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    // ユーザー数を取得
    const [totalResult] = await db.select({ count: count() }).from(users);
    const total = totalResult?.count || 0;

    // ユーザー一覧を取得
    const userList = await db
      .select()
      .from(users)
      .limit(limit)
      .offset(offset)
      .orderBy(users.id);

    const response: UsersListResponse = {
      success: true,
      data: userList,
      pagination: {
        total,
        limit,
        offset,
        hasNext: offset + limit < total,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching users:", error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: ErrorCode.DATABASE_ERROR,
        message: "ユーザー一覧の取得に失敗しました",
      },
    };
    res.status(500).json(errorResponse);
  }
});

// GET /api/users/:id - 特定ユーザー取得
router.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId) || userId <= 0) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: ErrorCode.BAD_REQUEST,
          message: "不正なユーザーIDです",
        },
      };
      return res.status(400).json(errorResponse);
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: ErrorCode.NOT_FOUND,
          message: "指定されたユーザーが見つかりません",
        },
      };
      return res.status(404).json(errorResponse);
    }

    const response: ApiResponse<(typeof user)[0]> = {
      success: true,
      data: user[0],
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching user:", error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: ErrorCode.DATABASE_ERROR,
        message: "ユーザー情報の取得に失敗しました",
      },
    };
    res.status(500).json(errorResponse);
  }
});

// POST /api/users - 新規ユーザー作成
router.post("/users", async (req: Request, res: Response) => {
  try {
    // バリデーション
    const validationErrors = validateCreateUserRequest(req.body);
    if (validationErrors.length > 0) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: `入力エラー: ${validationErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`,
        },
      };
      return res.status(400).json(errorResponse);
    }

    const createUserData: CreateUserRequest = {
      name: req.body.name.trim(),
      email: req.body.email.trim(),
      age: req.body.age,
    };

    // メールアドレスの重複チェック
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, createUserData.email))
      .limit(1);

    if (existingUser.length > 0) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: ErrorCode.BAD_REQUEST,
          message: "このメールアドレスは既に使用されています",
        },
      };
      return res.status(400).json(errorResponse);
    }

    // ユーザー作成
    const [insertResult] = await db.insert(users).values(createUserData);

    // 作成されたユーザーを取得
    const newUser = await db
      .select()
      .from(users)
      .where(eq(users.id, insertResult.insertId))
      .limit(1);

    const response: ApiResponse<(typeof newUser)[0]> = {
      success: true,
      data: newUser[0],
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating user:", error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: ErrorCode.DATABASE_ERROR,
        message: "ユーザーの作成に失敗しました",
      },
    };
    res.status(500).json(errorResponse);
  }
});

export default router;
