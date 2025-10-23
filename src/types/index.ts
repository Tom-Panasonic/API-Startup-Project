// APIレスポンスの共通型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// ページネーション情報
export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
}

// ユーザー一覧レスポンス
export interface UsersListResponse {
  success: boolean;
  data: Array<{
    id: number;
    name: string;
    email: string;
    age: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
  pagination: Pagination;
}

// 新規ユーザー作成リクエスト
export interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
}

// エラーコード
export enum ErrorCode {
  BAD_REQUEST = "BAD_REQUEST",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
}

// バリデーションエラー詳細
export interface ValidationError {
  field: string;
  message: string;
}
