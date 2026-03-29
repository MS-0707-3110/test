#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
山梨県 土地情報 自動収集スクリプト
対象エリア : 中央市 / 昭和町 / 南アルプス市
条件       : 住宅用地、70〜130坪、1800万円以内
情報源     : SUUMO、at-home
"""

import sys
import os
import re
import time
from datetime import datetime
from pathlib import Path

# ============================================================
#  設定 ── ここだけ変更すれば OK
# ============================================================
SAVE_FOLDER = r"C:\Users\ye110\OneDrive\デスクトップ\ClaudeHome\土地探し"
EXCEL_FILE  = "山梨土地情報.xlsx"

TARGET_CITIES  = ["中央市", "昭和町", "南アルプス市"]
MAX_PRICE_MAN  = 1800   # 万円以内
MIN_TSUBO      = 70     # 坪以上
MAX_TSUBO      = 130    # 坪以下
MIN_AREA_SQM   = MIN_TSUBO * 3.30579
MAX_AREA_SQM   = MAX_TSUBO * 3.30579
# ============================================================

def check_and_install():
    """必要パッケージが無ければ自動インストール"""
    required = {"requests": "requests", "bs4": "beautifulsoup4",
                "openpyxl": "openpyxl", "lxml": "lxml"}
    for mod, pkg in required.items():
        try:
            __import__(mod)
        except ImportError:
            print(f"パッケージ '{pkg}' をインストール中...")
            os.system(f'"{sys.executable}" -m pip install {pkg} -q')

check_and_install()

import requests
from bs4 import BeautifulSoup
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

HEADERS = {
    "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                   "AppleWebKit/537.36 (KHTML, like Gecko) "
                   "Chrome/120.0.0.0 Safari/537.36"),
    "Accept-Language": "ja-JP,ja;q=0.9",
}

# ── SUUMO 市区町村コード ──────────────────────────────────
SUUMO_CITY_CODES = {
    "南アルプス市": "19209",
    "中央市":       "19213",
    "昭和町":       "19386",
}

# ── at-home 都市スラッグ ─────────────────────────────────
ATHOME_CITY_SLUGS = {
    "南アルプス市": "minami-alps-city",
    "中央市":       "chuo-city",
    "昭和町":       "showa-town",
}


# ============================
#  ユーティリティ
# ============================
def extract_man(text: str):
    """価格テキスト → 万円(float)"""
    text = str(text).replace(",", "").replace("，", "")
    m = re.search(r"([\d.]+)万円", text)
    if m:
        return float(m.group(1))
    m = re.search(r"(\d+)億(\d*)万?円", text)
    if m:
        return int(m.group(1)) * 10000 + (int(m.group(2)) if m.group(2) else 0)
    return None


def extract_sqm(text: str):
    """テキストから m² の数値を抽出"""
    m = re.search(r"([\d,]+(?:\.\d+)?)\s*m[²2]", text)
    return float(m.group(1).replace(",", "")) if m else None


# ============================
#  SUUMO スクレイパー
# ============================
def scrape_suumo():
    results = []
    sc = ",".join(SUUMO_CITY_CODES.values())
    page = 1

    while True:
        params = {
            "ken": "19", "ta": "19", "sc": sc,
            "shkr1": "03", "shkr2": "03", "shkr3": "03", "shkr4": "03",
            "pj": str(page), "pc": "30",
        }
        try:
            r = requests.get(
                "https://suumo.jp/jj/bukken/ichiran/JJ010FJ001/",
                params=params, headers=HEADERS, timeout=20
            )
            r.raise_for_status()
        except Exception as e:
            print(f"  [SUUMO] 接続エラー page{page}: {e}")
            break

        soup = BeautifulSoup(r.text, "lxml")
        blocks = (soup.select("div.property_unit-content") or
                  soup.select("li.property-unit") or
                  soup.select("div.cassette_content"))
        if not blocks:
            break

        for blk in blocks:
            item = _parse_suumo_block(blk)
            if item:
                results.append(item)

        # 次ページ
        nums = [int(a.get_text()) for a in soup.select("div.pagination a")
                if a.get_text().strip().isdigit()]
        if page + 1 not in nums:
            break
        page += 1
        time.sleep(1.5)

    return _filter(results)


def _parse_suumo_block(blk):
    item = {"情報源": "SUUMO"}
    txt = blk.get_text()

    # 価格
    pe = (blk.select_one("span.dottable-value") or
          blk.select_one("div.ui-price__main") or
          blk.select_one("[class*=price]"))
    if pe:
        item["価格テキスト"] = pe.get_text(strip=True)
        item["価格_万円"]   = extract_man(item["価格テキスト"])

    # 住所
    ae = (blk.select_one("div.dottable-line") or
          blk.select_one("span.cassette-location") or
          blk.select_one("[class*=location]"))
    item["住所"] = ae.get_text(strip=True) if ae else ""

    # 面積
    sqm = extract_sqm(txt)
    if sqm:
        item["面積_sqm"] = sqm

    # URL
    lnk = blk.select_one('a[href*="/jj/bukken/"]') or blk.select_one("a[href]")
    if lnk:
        h = lnk["href"]
        item["参考URL"] = ("https://suumo.jp" + h) if h.startswith("/") else h

    return item if (item.get("参考URL") or item.get("住所")) else None


# ============================
#  at-home スクレイパー
# ============================
def scrape_athome():
    results = []

    for city_ja, slug in ATHOME_CITY_SLUGS.items():
        url    = f"https://www.athome.co.jp/tochi/yamanashi/{slug}/list/"
        params = {
            "PRICETO": str(MAX_PRICE_MAN),
            "MENSEKIFROM": str(int(MIN_AREA_SQM)),
            "MENSEKITO":   str(int(MAX_AREA_SQM)),
        }
        page = 1

        while True:
            if page > 1:
                params["pg"] = str(page)
            try:
                r = requests.get(url, params=params, headers=HEADERS, timeout=20)
                r.raise_for_status()
            except Exception as e:
                print(f"  [at-home] {city_ja} page{page}: {e}")
                break

            soup = BeautifulSoup(r.text, "lxml")
            blocks = (soup.select("div.property-list-unit") or
                      soup.select("li.object-list-unit") or
                      soup.select("article[class*=property]"))
            if not blocks:
                break

            for blk in blocks:
                item = _parse_athome_block(blk, city_ja)
                if item:
                    results.append(item)

            if not (soup.select_one("a[class*=next]") or soup.select_one("li.next > a")):
                break
            page += 1
            time.sleep(1.5)

    return _filter(results)


def _parse_athome_block(blk, city_ja):
    item = {"情報源": "at-home"}
    txt = blk.get_text()

    pe = (blk.select_one("[class*=price]") or blk.select_one("span.color-price"))
    if pe:
        item["価格テキスト"] = pe.get_text(strip=True)
        item["価格_万円"]   = extract_man(item["価格テキスト"])

    ae = (blk.select_one("[class*=address]") or blk.select_one("[class*=location]"))
    item["住所"] = ae.get_text(strip=True) if ae else city_ja

    sqm = extract_sqm(txt)
    if sqm:
        item["面積_sqm"] = sqm

    lnk = blk.select_one('a[href*="/tochi/"]') or blk.select_one("a[href]")
    if lnk:
        h = lnk["href"]
        item["参考URL"] = ("https://www.athome.co.jp" + h) if h.startswith("/") else h

    return item if (item.get("参考URL") or item.get("住所")) else None


# ============================
#  フィルタ
# ============================
def _filter(items):
    out = []
    for it in items:
        p = it.get("価格_万円")
        s = it.get("面積_sqm")
        a = it.get("住所", "")
        if p and p > MAX_PRICE_MAN:
            continue
        if s and (s < MIN_AREA_SQM or s > MAX_AREA_SQM):
            continue
        if a and not any(c in a for c in TARGET_CITIES):
            continue
        out.append(it)
    return out


# ============================
#  Excel 保存
# ============================
COLS = [
    ("No.",      6),  ("住所",    40), ("価格",    18),
    ("面積(m²)", 14), ("面積(坪)", 12), ("情報源",  12),
    ("参考URL",  60), ("取得日",  18),
]
H_FILL = PatternFill("solid", fgColor="1F6B4E")
A_FILL = PatternFill("solid", fgColor="E8F5E9")
H_FONT = Font(name="Meiryo", bold=True, color="FFFFFF", size=11)
D_FONT = Font(name="Meiryo", size=10)
U_FONT = Font(name="Meiryo", size=10, color="1155CC", underline="single")
BORDER = Border(**{s: Side(style="thin") for s in ("left","right","top","bottom")})


def save_excel(listings):
    path = Path(SAVE_FOLDER) / EXCEL_FILE
    path.parent.mkdir(parents=True, exist_ok=True)

    # 既存データ読み込み
    existing = {}
    if path.exists():
        wb = load_workbook(path)
        ws = wb.active
        hdrs = [c.value for c in ws[1]]
        try:
            ui = hdrs.index("参考URL")
        except ValueError:
            ui = -1
        if ui >= 0:
            for row in ws.iter_rows(min_row=2, values_only=True):
                u = row[ui] if ui < len(row) else None
                if u:
                    existing[u] = dict(zip(hdrs, row))
    else:
        wb = Workbook()
        ws = wb.active
        ws.title = "土地情報"

    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    for it in listings:
        u = it.get("参考URL", "")
        if not u or u in existing:
            continue
        sqm = it.get("面積_sqm", "")
        existing[u] = {
            "住所":    it.get("住所", ""),
            "価格":    (f"{int(it['価格_万円']):,}万円" if it.get("価格_万円")
                        else it.get("価格テキスト", "")),
            "面積(m²)": sqm,
            "面積(坪)": f"{float(sqm)/3.30579:.1f}" if sqm else "",
            "情報源":  it.get("情報源", ""),
            "参考URL": u,
            "取得日":  now,
        }

    # シート書き直し
    ws.delete_rows(1, ws.max_row + 1)
    # ヘッダー
    for ci, (h, w) in enumerate(COLS, 1):
        c = ws.cell(1, ci, h)
        c.font = H_FONT; c.fill = H_FILL; c.border = BORDER
        c.alignment = Alignment(horizontal="center", vertical="center")
        ws.column_dimensions[get_column_letter(ci)].width = w
    ws.row_dimensions[1].height = 22
    ws.freeze_panes = "A2"

    rows = sorted(existing.values(),
                  key=lambda x: _price_key(x.get("価格", "")))
    for ri, d in enumerate(rows, 2):
        fill = A_FILL if ri % 2 == 0 else None
        vals = [ri-1, d.get("住所",""), d.get("価格",""),
                d.get("面積(m²)",""), d.get("面積(坪)",""),
                d.get("情報源",""), d.get("参考URL",""), d.get("取得日","")]
        for ci, v in enumerate(vals, 1):
            c = ws.cell(ri, ci, v)
            c.border = BORDER
            c.alignment = Alignment(vertical="center", wrap_text=(ci == 2))
            if ci == 7 and v:
                c.font = U_FONT; c.hyperlink = v
            else:
                c.font = D_FONT
            if fill:
                c.fill = fill
        ws.row_dimensions[ri].height = 18

    # 最終更新日
    lr = ws.max_row + 2
    ws.cell(lr, 1, f"最終更新: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}").font = \
        Font(name="Meiryo", size=9, color="888888", italic=True)

    wb.save(path)
    return path, len(rows)


def _price_key(s):
    m = re.search(r"([\d,]+)", str(s).replace(",", ""))
    return float(m.group(1)) if m else 9_999_999


# ============================
#  メイン
# ============================
def main():
    print("=" * 50)
    print(f"  土地情報 更新開始: {datetime.now():%Y-%m-%d %H:%M:%S}")
    print("=" * 50)

    all_data = []

    print("\n[1/2] SUUMO を検索中...")
    try:
        d = scrape_suumo()
        all_data.extend(d)
        print(f"  → {len(d)} 件")
    except Exception as e:
        print(f"  SUUMO エラー: {e}")

    print("\n[2/2] at-home を検索中...")
    try:
        d = scrape_athome()
        all_data.extend(d)
        print(f"  → {len(d)} 件")
    except Exception as e:
        print(f"  at-home エラー: {e}")

    print(f"\n合計 {len(all_data)} 件取得。Excel を保存中...")
    path, total = save_excel(all_data)
    print(f"  保存完了: {path}")
    print(f"  総件数 (累計): {total} 件")
    print("\n" + "=" * 50)
    print("  完了！")
    print("=" * 50)
    input("\nEnterキーを押すと閉じます...")


if __name__ == "__main__":
    main()
