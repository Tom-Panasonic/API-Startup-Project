#!/bin/bash

# 開発サーバー起動スクリプト

echo "🔍 環境をチェックしています..."

# .envファイルの存在確認
if [ ! -f .env ]; then
    echo "⚠️  .env ファイルが見つかりません。"
    echo "   .env.example をコピーして .env を作成しますか? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        cp .env.example .env
        echo "✅ .env ファイルを作成しました"
    else
        echo "❌ .env ファイルが必要です"
        exit 1
    fi
fi

# Docker Composeの確認
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Docker Compose が見つかりません"
    exit 1
fi

# Dockerコンテナの状態確認
echo "🐳 Dockerコンテナの状態を確認しています..."
cd docker
if ! $DOCKER_COMPOSE ps | grep -q "api-startup-mysql.*Up"; then
    echo "🚀 データベースを起動しています..."
    $DOCKER_COMPOSE up -d
    echo "⏳ データベースの初期化を待っています（20秒）..."
    sleep 20
else
    echo "✅ データベースは既に起動しています"
fi

cd ..

# 依存関係の確認
if [ ! -d "node_modules" ]; then
    echo "📦 依存関係をインストールしています..."
    npm install
fi

# マイグレーションの実行
echo "🗄️ データベースマイグレーションを確認しています..."
npm run db:generate > /dev/null 2>&1
npm run db:migrate > /dev/null 2>&1

echo ""
echo "🎉 すべての準備が整いました！"
echo ""
echo "🚀 APIサーバーを起動しています..."
npm run dev
