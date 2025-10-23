# API 仕様書 (OpenAPI 3.0) 📖

このフォルダには、API Startup Project の OpenAPI 3.0 仕様書が含まれています。

## 📄 ファイル構成

```
api-spec/
├── README.md       # このファイル
├── openapi.yaml    # OpenAPI 3.0 仕様書
└── index.html      # Swagger UI (ブラウザ表示用)
```

## 🔧 VS Code で Swagger 仕様書をプレビューする方法

### 1. 必要な拡張機能をインストール

以下の VS Code 拡張機能をインストールしてください：

#### 推奨拡張機能

1. **Swagger Viewer**

   - ID: `Arjun.swagger-viewer`
   - 機能: OpenAPI/Swagger 仕様書のプレビュー表示

2. **OpenAPI (Swagger) Editor**

   - ID: `42Crunch.vscode-openapi`
   - 機能: OpenAPI 仕様書の編集・バリデーション・プレビュー

3. **YAML**
   - ID: `redhat.vscode-yaml`
   - 機能: YAML 構文ハイライト・バリデーション

#### インストール方法

```bash
# VS Code拡張機能をコマンドラインからインストール
code --install-extension Arjun.swagger-viewer
code --install-extension 42Crunch.vscode-openapi
code --install-extension redhat.vscode-yaml
```

または、VS Code 内で Extensions（Ctrl+Shift+X）を開いて、上記の拡張機能名を検索してインストール。

### 2. Swagger 仕様書をプレビューする

#### 方法 1: Swagger Viewer を使用

1. VS Code で `openapi.yaml` ファイルを開く
2. コマンドパレット（Ctrl+Shift+P）を開く
3. 「Preview Swagger」と入力して実行
4. プレビューペインが開いて、インタラクティブな仕様書が表示される

```bash
# ショートカット
Ctrl+Shift+P → "Preview Swagger"
```

#### 方法 2: OpenAPI (Swagger) Editor を使用

1. VS Code で `openapi.yaml` ファイルを開く
2. コマンドパレット（Ctrl+Shift+P）を開く
3. 「OpenAPI: Show Preview」と入力して実行
4. 右側にプレビューペインが表示される

```bash
# ショートカット
Ctrl+Shift+P → "OpenAPI: Show Preview"
```

#### 方法 3: 右クリックメニューから

1. `openapi.yaml` ファイルを右クリック
2. 「Preview Swagger」または「OpenAPI Preview」を選択

### 3. 🎯 プレビューでできること

- **📋 仕様書の視覚的確認**: 全エンドポイントの詳細表示
- **🔍 リアルタイム編集**: YAML を編集すると即座にプレビューが更新
- **✅ バリデーション**: 構文エラーや仕様の問題を即座に検出
- **📝 ドキュメント生成**: 綺麗にフォーマットされた API 仕様書表示
- **🧪 Try it out**: 一部の拡張機能では API 呼び出しも可能

### 4. 🛠️ 開発ワークフロー

```bash
# 1. VS Codeでファイルを開く
code api-spec/openapi.yaml

# 2. プレビューを表示
# Ctrl+Shift+P → "Preview Swagger"

# 3. 仕様書を編集
# 左側: YAML編集
# 右側: リアルタイムプレビュー

# 4. 変更を保存してAPIサーバーで確認
npm run dev
# ブラウザ: http://localhost:3000/api-spec/
```

## 📚 OpenAPI 仕様書の編集のコツ

### YAML 構文のポイント

```yaml
# ✅ 正しいインデント（2スペース）
paths:
  /api/users:
    get:
      summary: ユーザー一覧取得

# ❌ 間違ったインデント
paths:
/api/users:
  get:
    summary: ユーザー一覧取得
```

### よく使用するセクション

- **info**: API 基本情報
- **servers**: サーバー情報
- **paths**: エンドポイント定義
- **components**: 再利用可能なスキーマ定義
- **security**: 認証設定

## 🔧 トラブルシューティング

### プレビューが表示されない場合

1. **拡張機能の確認**

   ```bash
   code --list-extensions | grep -E "(swagger|openapi|yaml)"
   ```

2. **YAML の構文確認**

   - VS Code 下部の Problems パネルでエラーを確認
   - インデントが正しいか確認（2 スペース推奨）

3. **拡張機能の再読み込み**
   - Ctrl+Shift+P → "Developer: Reload Window"

### プレビューが更新されない場合

- ファイルを保存（Ctrl+S）
- プレビューペインを閉じて再度開く
- VS Code を再起動

## 🌐 ブラウザでのプレビュー

VS Code のプレビューと併せて、ブラウザでも確認可能：

```bash
# APIサーバーを起動
npm run dev

# ブラウザでアクセス
# Swagger UI: http://localhost:3000/api-spec/
# YAML Raw: http://localhost:3000/api-spec/openapi.yaml
```

## 📖 参考リンク

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger Editor Online](https://editor.swagger.io/)
- [VS Code OpenAPI Extension](https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi)
- [Swagger Viewer Extension](https://marketplace.visualstudio.com/items?itemName=Arjun.swagger-viewer)
