@echo off
chcp 65001 > nul
echo ============================================
echo  土地探し スクリプト セットアップ
echo ============================================
echo.

:: Python チェック
python --version > nul 2>&1
if errorlevel 1 (
    echo [エラー] Python が見つかりません。
    echo.
    echo 以下の手順でインストールしてください：
    echo 1. https://www.python.org/downloads/ を開く
    echo 2. "Download Python 3.x.x" ボタンをクリック
    echo 3. インストーラーを実行
    echo    ★ 必ず "Add Python to PATH" にチェックを入れる！
    echo 4. インストール完了後、このファイルを再度実行
    echo.
    pause
    start https://www.python.org/downloads/
    exit /b 1
)

echo [OK] Python が見つかりました。
python --version

echo.
echo 必要なパッケージをインストール中...
python -m pip install requests beautifulsoup4 openpyxl lxml --quiet --upgrade
if errorlevel 1 (
    echo [エラー] パッケージのインストールに失敗しました。
    pause
    exit /b 1
)

echo [OK] パッケージのインストール完了。
echo.
echo ============================================
echo  セットアップ完了！
echo  次は run.bat をダブルクリックして実行してください。
echo ============================================
echo.
pause
