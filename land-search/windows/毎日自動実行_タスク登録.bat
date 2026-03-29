@echo off
chcp 65001 > nul
echo ============================================
echo  タスクスケジューラ 登録（毎日0時に自動実行）
echo ============================================
echo.

:: 管理者権限チェック
net session > nul 2>&1
if errorlevel 1 (
    echo [注意] 管理者として実行してください。
    echo このファイルを右クリック →「管理者として実行」
    pause
    exit /b 1
)

:: スクリプトの絶対パスを取得
set SCRIPT_DIR=%~dp0
set SCRIPT_PATH=%SCRIPT_DIR%土地探し_更新.py
set BAT_PATH=%SCRIPT_DIR%run.bat

:: タスク登録
schtasks /create /tn "山梨土地情報_毎日更新" ^
    /tr "\"%BAT_PATH%\"" ^
    /sc daily ^
    /st 00:00 ^
    /ru "%USERNAME%" ^
    /f

if errorlevel 1 (
    echo [エラー] タスクの登録に失敗しました。
    pause
    exit /b 1
)

echo.
echo [OK] タスクを登録しました。
echo.
echo 登録内容:
echo   タスク名 : 山梨土地情報_毎日更新
echo   実行時刻 : 毎日 0:00
echo   実行ファイル: %BAT_PATH%
echo.
echo タスクスケジューラで確認・変更できます。
echo （スタートメニュー → "タスクスケジューラ" で検索）
echo.
pause
