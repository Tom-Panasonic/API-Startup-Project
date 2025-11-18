# API Startup Project Setup Script (Windows PowerShell)

Write-Host "API Startup Project のセットアップを開始します..." -ForegroundColor Cyan

# Check if required tools are installed
function Test-Command {
    param (
        [string]$CommandName,
        [string]$Message
    )
    
    if (Get-Command $CommandName -ErrorAction SilentlyContinue) {
        Write-Host "$CommandName が見つかりました" -ForegroundColor Green
        return $true
    } else {
        Write-Host "$CommandName がインストールされていません。" -ForegroundColor Red
        Write-Host "   $Message" -ForegroundColor Yellow
        return $false
    }
}

Write-Host ""
Write-Host "必要なツールをチェックしています..." -ForegroundColor Cyan

$allCommandsFound = $true
$allCommandsFound = (Test-Command -CommandName "node" -Message "Node.js をインストールしてください: https://nodejs.org/") -and $allCommandsFound
$allCommandsFound = (Test-Command -CommandName "npm" -Message "npm がNode.jsと一緒にインストールされているはずです") -and $allCommandsFound
$allCommandsFound = (Test-Command -CommandName "docker" -Message "Docker をインストールしてください: https://www.docker.com/") -and $allCommandsFound

if (-not $allCommandsFound) {
    Write-Host ""
    Write-Host "必要なツールが不足しています。セットアップを中止します。" -ForegroundColor Red
    exit 1
}

# Check Docker Compose (support both old and new versions)
Write-Host ""
$dockerComposeCommand = $null
if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    Write-Host "docker-compose が見つかりました" -ForegroundColor Green
    $dockerComposeCommand = "docker-compose"
} elseif ((docker compose version 2>$null) -and $LASTEXITCODE -eq 0) {
    Write-Host "docker compose が見つかりました" -ForegroundColor Green
    $dockerComposeCommand = "docker compose"
} else {
    Write-Host "Docker Compose がインストールされていません。" -ForegroundColor Red
    Write-Host "   Docker Compose をインストールしてください" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "依存関係をインストールしています..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install に失敗しました。" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "環境変数ファイルを設定しています..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host ".env ファイルを作成しました（.env.example から）" -ForegroundColor Green
        Write-Host "   必要に応じて .env ファイルの設定を変更してください" -ForegroundColor Yellow
    } else {
        Write-Host ".env.example ファイルが見つかりません" -ForegroundColor Yellow
    }
} else {
    Write-Host ".env ファイルは既に存在します" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Dockerコンテナを起動しています..." -ForegroundColor Cyan
Push-Location docker
if ($dockerComposeCommand -eq "docker-compose") {
    & docker-compose up -d
} else {
    & docker compose up -d
}
$dockerResult = $LASTEXITCODE
Pop-Location

if ($dockerResult -ne 0) {
    Write-Host "Docker コンテナの起動に失敗しました。" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "データベースの起動を待っています（30秒）..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "データベースマイグレーションを実行しています..." -ForegroundColor Cyan
npm run db:generate
if ($LASTEXITCODE -eq 0) {
    npm run db:migrate
}

Write-Host ""
Write-Host "サンプルデータを投入しています..." -ForegroundColor Cyan
npm run db:seed

Write-Host ""
Write-Host "セットアップが完了しました！" -ForegroundColor Green
Write-Host ""
Write-Host "次のコマンドでAPIサーバーを起動できます:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "利用可能なURL:" -ForegroundColor Cyan
Write-Host "   - API サーバー: http://localhost:3000" -ForegroundColor White
Write-Host "   - API ドキュメント: http://localhost:3000/api-spec/openapi.yaml" -ForegroundColor White
Write-Host "   - ヘルスチェック: http://localhost:3000/health" -ForegroundColor White
Write-Host "   - phpMyAdmin: http://localhost:8080 (ユーザー: root, パスワード: rootpassword)" -ForegroundColor White
Write-Host ""
Write-Host "停止する場合:" -ForegroundColor Cyan
Write-Host "   - サーバー: Ctrl+C" -ForegroundColor White
Write-Host "   - Docker: cd docker; $dockerComposeCommand down" -ForegroundColor White
