#!/bin/bash

# API Startup Project セットアップスクリプト

echo "🚀 API Startup Project のセットアップを開始します..."

# 必要なツールがインストールされているかチェック
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 がインストールされていません。"
        echo "   $2"
        exit 1
    else
        echo "✅ $1 が見つかりました"
    fi
}

echo "📋 必要なツールをチェックしています..."
check_command "node" "Node.js をインストールしてください: https://nodejs.org/"
check_command "npm" "npm がNode.jsと一緒にインストールされているはずです"
check_command "docker" "Docker をインストールしてください: https://www.docker.com/"
# Docker Composeの確認（新旧両対応）
if command -v docker-compose &> /dev/null; then
    echo "✅ docker-compose が見つかりました"
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    echo "✅ docker compose が見つかりました"
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Docker Compose がインストールされていません。"
    echo "   Docker Compose をインストールしてください"
    exit 1
fi

echo ""
echo "📦 依存関係をインストールしています..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install に失敗しました。"
    exit 1
fi

echo ""
echo "📝 環境変数ファイルを設定しています..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ .env ファイルを作成しました（.env.example から）"
    echo "   必要に応じて .env ファイルの設定を変更してください"
else
    echo "⚠️  .env ファイルは既に存在します"
fi

echo ""
echo "🐳 Dockerコンテナを起動しています..."
cd docker && $DOCKER_COMPOSE up -d

if [ $? -ne 0 ]; then
    echo "❌ Docker コンテナの起動に失敗しました。"
    exit 1
fi

echo ""
echo "⏳ データベースの起動を待っています（30秒）..."
sleep 30

echo ""
echo "🗄️ データベースマイグレーションを実行しています..."
cd .. && npm run db:generate && npm run db:migrate

echo ""
echo "🌱 サンプルデータを投入しています..."
npm run db:seed

echo ""
echo "🎉 セットアップが完了しました！"
echo ""
echo "🚀 次のコマンドでAPIサーバーを起動できます:"
echo "   npm run dev"
echo ""
echo "📖 利用可能なURL:"
echo "   • API サーバー: http://localhost:3000"
echo "   • API ドキュメント: http://localhost:3000/api-spec/openapi.yaml"
echo "   • ヘルスチェック: http://localhost:3000/health"
echo "   • phpMyAdmin: http://localhost:8080 (ユーザー: root, パスワード: rootpassword)"
echo ""
echo "🛑 停止する場合:"
echo "   • サーバー: Ctrl+C"
echo "   • Docker: cd docker && $DOCKER_COMPOSE down"
