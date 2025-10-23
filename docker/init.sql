-- データベースの初期化SQL
-- このファイルはDocker起動時に自動実行されます

-- データベースの文字セットを確認
SELECT @@character_set_database, @@collation_database;

-- タイムゾーンの設定
SET time_zone = '+09:00';

-- 初期化完了のメッセージ
SELECT 'Database initialized successfully!' as message;
