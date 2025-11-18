# API Startup Project

初心者開発者向けの簡単な API 開発プロジェクトです。MySQL データベースからデータを取得してレスポンスを返すシンプルな API サーバーを構築します。

## 技術スタック

- **API サーバー**: Node.js + Express.js + TypeScript
- **データベース**: MySQL (Docker)
- **ORM**: Drizzle ORM
- **API 仕様書**: OpenAPI 3.0 (YAML)

## 事前準備

このプロジェクトを始める前に、以下のソフトウェアをインストールしてください。

### 必須ソフトウェア

#### 1. Node.js (v18.0.0 以上)

- **ダウンロード**: https://nodejs.org/
- **確認方法**:
  ```bash
  node --version  # v18.0.0 以上
  npm --version   # v9.0.0 以上
  ```
- **説明**: API サーバーの実行環境として必要です

#### 2. Docker Desktop

- **Windows**: https://www.docker.com/products/docker-desktop/
- **Mac**: https://www.docker.com/products/docker-desktop/
- **Linux**: https://docs.docker.com/engine/install/
- **確認方法**:
  ```bash
  docker --version
  docker compose version
  ```
- **説明**: MySQL データベースをコンテナで実行するために必要です
- **Windows の注意事項**:
  - WSL 2 が必要です（Docker Desktop インストール時に自動設定されます）
  - インストール後、PC の再起動が必要な場合があります
  - Docker Desktop を起動してから、セットアップを実行してください

#### 3. Git (推奨)

- **ダウンロード**: https://git-scm.com/
- **説明**: プロジェクトのクローンやバージョン管理に使用します

### インストール確認

すべてのソフトウェアが正しくインストールされているか確認してください：

**Linux/Mac の場合:**

```bash
node --version && npm --version && docker --version && docker compose version
```

**Windows の場合:**

```powershell
node --version; npm --version; docker --version; docker compose version
```

すべてのコマンドでバージョン情報が表示されれば、準備完了です！

## プロジェクト構造

```
API-Startup-Project/
├── src/
│   ├── db/
│   │   ├── schema.ts        # データベーススキーマ定義
│   │   └── connection.ts    # データベース接続設定
│   ├── routes/
│   │   └── api.ts          # APIルート定義
│   ├── types/
│   │   └── index.ts        # TypeScript型定義
│   └── app.ts              # メインアプリケーション
├── api-spec/
│   ├── README.md           # API仕様書の使い方・VS Code拡張機能
│   ├── openapi.yaml        # OpenAPI 3.0 仕様書
│   └── index.html          # Swagger UI (ブラウザ表示用)
├── docker/
│   └── docker-compose.yml  # Docker設定
├── drizzle/
│   └── migrations/         # データベースマイグレーション
├── scripts/
│   ├── setup.sh           # セットアップスクリプト (Linux/Mac)
│   ├── setup.ps1          # セットアップスクリプト (Windows)
│   └── seed.ts            # サンプルデータ投入スクリプト
├── package.json
├── tsconfig.json
├── drizzle.config.ts
└── README.md
```

## クイックスタート

### 🚀 ワンコマンドで起動（推奨）

**Linux/Mac の場合:**

```bash
# 初回セットアップ（すべて自動実行）
npm run setup

# 開発サーバーをクイック起動
npm run quick-start
```

**Windows の場合:**

```powershell
# 初回セットアップ（すべて自動実行）
.\scripts\setup.ps1

# 開発サーバーをクイック起動
npm run quick-start
```

> **Note**: Windows で PowerShell スクリプトの実行がブロックされる場合は、以下のコマンドを実行してください：
>
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

### 📋 手動セットアップ手順

#### 1. 依存関係のインストール

```bash
npm install
```

#### 2. 環境変数の設定

```bash
cp .env.example .env
# 必要に応じて .env ファイルを編集
```

#### 3. データベースの起動

**Linux/Mac の場合:**

```bash
cd docker && docker compose up -d
```

**Windows の場合:**

```powershell
cd docker; docker compose up -d
```

#### 4. データベーススキーマの作成

```bash
# スキーマをデータベースにプッシュ
npx drizzle-kit push:mysql
```

#### 5. サンプルデータの投入

```bash
npm run db:seed
```

#### 6. API サーバーの起動

```bash
npm run dev
```

## 利用可能なエンドポイント

API サーバーが起動すると、以下のエンドポイントが利用可能になります：

### 基本エンドポイント

- `GET /health` - ヘルスチェック（データベース接続確認）
- `GET /` - API 情報とドキュメントリンク
- `GET /api-spec/` - **Swagger UI**（インタラクティブな API 仕様書）

### ユーザー関連 API

- `GET /api/users` - ユーザー一覧の取得
- `GET /api/users/:id` - 特定ユーザーの取得
- `POST /api/users` - 新規ユーザー作成

### 📖 API 呼び出し例

#### 1. ヘルスチェック

```bash
curl -s http://localhost:3000/health
```

**レスポンス例:**

```json
{
  "status": "OK",
  "timestamp": "2025-10-23T12:46:48.962Z",
  "services": {
    "database": "connected"
  }
}
```

#### 2. ユーザー一覧取得

```bash
curl -s http://localhost:3000/api/users
```

**レスポンス例:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "田中太郎",
      "email": "taro.tanaka@example.com",
      "age": 28,
      "createdAt": "2025-10-23T12:51:30.000Z",
      "updatedAt": "2025-10-23T12:51:30.000Z"
    }
  ],
  "pagination": {
    "total": 10,
    "limit": 20,
    "offset": 0,
    "hasNext": false
  }
}
```

#### 3. 特定ユーザー取得

```bash
curl -s http://localhost:3000/api/users/1
```

#### 4. 新規ユーザー作成

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "テスト太郎",
    "email": "test@example.com",
    "age": 30
  }'
```

**レスポンス例:**

```json
{
  "success": true,
  "data": {
    "id": 11,
    "name": "テスト太郎",
    "email": "test@example.com",
    "age": 30,
    "createdAt": "2025-10-23T12:52:10.000Z",
    "updatedAt": "2025-10-23T12:52:10.000Z"
  }
}
```

#### 5. ページネーション（一覧取得）

```bash
curl -s "http://localhost:3000/api/users?limit=5&offset=0"
```

詳細な仕様は `api-spec/openapi.yaml` を参照してください。

## 開発コマンド

### 🚀 クイックスタート

- `npm run setup` - 初回セットアップ（環境構築・DB 起動・データ投入まで自動実行）
- `npm run quick-start` - 開発サーバーのクイック起動

### 📝 開発・ビルド

- `npm run dev` - 開発サーバー起動（ホットリロード有効）
- `npm run build` - TypeScript のビルド
- `npm run start` - 本番サーバー起動
- `npm run docs` - API ドキュメントの URL 表示

### 🗄️ データベース操作

- `npm run db:generate` - マイグレーションファイル生成
- `npm run db:migrate` - データベースマイグレーション実行
- `npm run db:seed` - サンプルデータ投入
- `npm run db:studio` - Drizzle Studio 起動（データベース管理 GUI）
- `npm run db:push` - スキーマを直接データベースにプッシュ

### 📱 利用可能な管理 UI

- **API サーバー**: http://localhost:3000
- **🔧 Swagger UI**: http://localhost:3000/api-spec/ （インタラクティブな API 仕様書）
- **📋 OpenAPI 仕様書**: http://localhost:3000/api-spec/openapi.yaml
- **🏥 ヘルスチェック**: http://localhost:3000/health
- **🗄️ phpMyAdmin**: http://localhost:8080 (root/rootpassword)
- **🎛️ Drizzle Studio**: `npm run db:studio` で起動

#### 🔧 API 仕様書の確認方法

##### 1. Swagger UI（ブラウザ）

```bash
# API サーバーを起動してからブラウザでアクセス
npm run dev
# ブラウザで http://localhost:3000/api-spec/ を開く
```

Swagger UI では以下のことができます：

- **API の仕様確認**: 全エンドポイントの詳細仕様を確認
- **インタラクティブテスト**: ブラウザから直接 API を呼び出し
- **リクエスト・レスポンス例**: 実際のデータ例を確認
- **バリデーションルール**: 入力値の制約を確認

##### 2. VS Code 拡張機能（推奨）

VS Code で直接 OpenAPI 仕様書をプレビュー：

```bash
# 拡張機能をインストール
code --install-extension Arjun.swagger-viewer
code --install-extension 42Crunch.vscode-openapi

# YAMLファイルを開いてプレビュー
code api-spec/openapi.yaml
# Ctrl+Shift+P → "Preview Swagger"
```

詳細は [`api-spec/README.md`](./api-spec/README.md) を参照してください。

### 🛑 停止方法

**Linux/Mac の場合:**

```bash
# API サーバー停止
Ctrl + C

# データベース停止
cd docker && docker compose down

# すべてのコンテナ停止
docker compose down --volumes
```

**Windows の場合:**

```powershell
# API サーバー停止
Ctrl + C

# データベース停止
cd docker; docker compose down

# すべてのコンテナ停止
cd docker; docker compose down --volumes
```

## 📚 学習ポイント

このプロジェクトを通して以下の技術を学習できます：

### 🔧 バックエンド開発

1. **TypeScript**: 型安全な JavaScript 開発
2. **Express.js**: Node.js での高速な Web API 開発
3. **RESTful API**: HTTP メソッドを使った API 設計
4. **エラーハンドリング**: 適切なエラーレスポンス設計
5. **バリデーション**: リクエストデータの検証

### 🗄️ データベース

6. **Drizzle ORM**: モダンな TypeScript-first な ORM
7. **MySQL**: リレーショナルデータベースの操作
8. **マイグレーション**: データベーススキーマのバージョン管理
9. **データベース設計**: 効率的なテーブル設計

### 🐳 インフラ・環境構築

10. **Docker**: コンテナを使用した開発環境構築
11. **Docker Compose**: 複数コンテナの管理
12. **環境変数**: 設定の外部化

### 📖 API 設計・ドキュメント

13. **OpenAPI 3.0**: API 仕様書の作成
14. **ページネーション**: 大量データの効率的な取得
15. **HTTP ステータスコード**: 適切なレスポンス設計

### 🏗️ 開発手法

16. **プロジェクト構造**: 保守性の高いファイル構成
17. **自動化スクリプト**: セットアップ・デプロイの自動化
18. **開発ツール**: TypeScript、ESLint、ホットリロード

## 🎯 動作確認

プロジェクトが正常に動作しているかを確認するための手順：

### 1. サーバー起動確認

```bash
# サーバーが起動していることを確認
curl -s http://localhost:3000/health
```

### 2. データベース接続確認

正常に動作している場合、ヘルスチェックで `"database": "connected"` が返されます。

### 3. API 動作確認

```bash
# ユーザー一覧が取得できることを確認
curl -s http://localhost:3000/api/users | head -20

# 新規ユーザー作成が動作することを確認
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"テストユーザー","email":"test@test.com","age":25}'
```

### 4. Swagger UI 動作確認

ブラウザで http://localhost:3000/api-spec/ にアクセスして以下を確認：

1. **API 仕様書が表示される**: OpenAPI 仕様が正しく読み込まれる
2. **Try it out 機能**: Swagger UI から直接 API をテストできる
3. **レスポンス確認**: 実際の API レスポンスが確認できる

**Swagger UI での API テスト手順**:

1. `GET /api/users` セクションを展開
2. 「Try it out」ボタンをクリック
3. 「Execute」ボタンをクリックして API を実行
4. Response body でレスポンスデータを確認

## トラブルシューティング

### ❌ データベース接続エラーが発生する場合

**Linux/Mac の場合:**

```bash
# Docker コンテナの状態確認
cd docker && docker compose ps

# コンテナが停止している場合は起動
docker compose up -d

# ログでエラーを確認
docker compose logs mysql
```

**Windows の場合:**

```powershell
# Docker コンテナの状態確認
cd docker; docker compose ps

# コンテナが停止している場合は起動
docker compose up -d

# ログでエラーを確認
docker compose logs mysql
```

### ❌ ポート 3000 が使用中のエラー

**Linux/Mac の場合:**

```bash
# ポートを使用しているプロセスを確認
lsof -ti:3000

# プロセスを停止
kill -9 <プロセスID>
```

**Windows の場合:**

```powershell
# ポートを使用しているプロセスを確認
netstat -ano | findstr :3000

# プロセスを停止（<PID>は上記で確認したプロセスID）
taskkill /PID <PID> /F
```

### ❌ TypeScript コンパイルエラーが発生する場合

1. `npm install` で依存関係が正しくインストールされていることを確認
2. Node.js のバージョンが 18 以上であることを確認

```bash
node --version  # v18.0.0 以上を確認
npm --version   # v9.0.0 以上を確認
```

### ❌ テーブルが存在しないエラー

```bash
# スキーマをデータベースにプッシュ
npx drizzle-kit push:mysql

# または、サンプルデータ投入（テーブル作成も含む）
npm run db:seed
```

### 🔄 完全リセット（開発時）

**Linux/Mac の場合:**

```bash
# すべてのコンテナとボリュームを削除
cd docker && docker compose down --volumes

# 再セットアップ
npm run setup
```

**Windows の場合:**

```powershell
# すべてのコンテナとボリュームを削除
cd docker; docker compose down --volumes

# 再セットアップ
.\scripts\setup.ps1
```

## ライセンス

MIT License
