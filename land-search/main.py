#!/usr/bin/env python3
"""
山梨県土地情報 自動収集・更新スクリプト

対象エリア : 中央市 / 昭和町 / 南アルプス市
条件       : 住宅用地、70〜130坪、1800万円以内
情報源     : SUUMO, at-home
"""

import subprocess
import sys
import os
from datetime import datetime

# プロジェクトルートをパスに追加
sys.path.insert(0, os.path.dirname(__file__))

from scrapers.suumo  import scrape_suumo
from scrapers.athome import scrape_athome
from excel_manager   import update_excel, EXCEL_PATH


def main():
    no_git = '--no-git' in sys.argv
    start = datetime.now()
    print(f"\n{'='*50}")
    print(f"  土地情報 更新開始: {start.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*50}")

    all_listings = []

    # ---- SUUMO ----
    print("\n[1/2] SUUMO を検索中...")
    try:
        suumo_data = scrape_suumo()
        all_listings.extend(suumo_data)
    except Exception as e:
        print(f"  SUUMO エラー: {e}")

    # ---- at-home ----
    print("\n[2/2] at-home を検索中...")
    try:
        athome_data = scrape_athome()
        all_listings.extend(athome_data)
    except Exception as e:
        print(f"  at-home エラー: {e}")

    print(f"\n合計 {len(all_listings)} 件を取得しました。")

    # ---- Excel 更新 ----
    print("\nExcel ファイルを更新中...")
    try:
        path = update_excel(all_listings)
        print(f"  保存先: {path}")
    except Exception as e:
        print(f"  Excel 更新エラー: {e}")
        sys.exit(1)

    # ---- Git commit & push ----
    if no_git:
        print("\nGit 操作スキップ（--no-git）")
    else:
        print("\nGitHub へプッシュ中...")
        _git_push(path)

    elapsed = (datetime.now() - start).seconds
    print(f"\n{'='*50}")
    print(f"  完了 ({elapsed}秒)")
    print(f"{'='*50}\n")


def _git_push(excel_path: str):
    branch = "claude/land-search-tracker-sIxzu"
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M')
    repo_root = os.path.dirname(os.path.dirname(__file__))

    cmds = [
        ['git', '-C', repo_root, 'add', excel_path],
        ['git', '-C', repo_root, 'commit', '-m', f'[自動更新] 山梨土地情報: {timestamp}'],
        ['git', '-C', repo_root, 'push', '-u', 'origin', branch],
    ]

    for cmd in cmds:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            if 'nothing to commit' in result.stdout + result.stderr:
                print("  変更なし（スキップ）")
                return
            print(f"  Git エラー: {result.stderr.strip()}")
            return
    print("  プッシュ完了")


if __name__ == '__main__':
    main()
