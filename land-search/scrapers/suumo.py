"""
SUUMO 土地情報スクレイパー
対象: 山梨県 中央市・昭和町・南アルプス市
"""

import requests
from bs4 import BeautifulSoup
import time
import re

HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
        'AppleWebKit/537.36 (KHTML, like Gecko) '
        'Chrome/120.0.0.0 Safari/537.36'
    ),
    'Accept-Language': 'ja-JP,ja;q=0.9',
}

BASE_URL = "https://suumo.jp/jj/bukken/ichiran/JJ010FJ001/"

# 山梨県の全国地方公共団体コード
CITY_CODES = {
    "南アルプス市": "19209",
    "中央市":       "19213",
    "昭和町":       "19386",
}

TARGET_CITIES = list(CITY_CODES.keys())
MAX_PRICE_MAN = 1800   # 万円
MIN_AREA_SQM  = 231    # 70坪 ≈ 231.4 m²
MAX_AREA_SQM  = 430    # 130坪 ≈ 429.8 m²


def scrape_suumo() -> list[dict]:
    """SUUMOから土地情報を取得して返す"""
    sc_codes = ",".join(CITY_CODES.values())
    results = []
    page = 1

    while True:
        params = {
            'ken':   '19',
            'ta':    '19',
            'sc':    sc_codes,
            'shkr1': '03',   # 土地
            'shkr2': '03',
            'shkr3': '03',
            'shkr4': '03',
            'pj':    str(page),
            'pc':    '30',
        }

        try:
            resp = requests.get(BASE_URL, params=params, headers=HEADERS, timeout=15)
            resp.raise_for_status()
        except requests.RequestException as e:
            print(f"[SUUMO] 接続エラー (page {page}): {e}")
            break

        soup = BeautifulSoup(resp.text, 'html.parser')
        listings = _parse_listings(soup)

        if not listings:
            break

        results.extend(listings)

        # 次ページ確認
        next_btn = soup.select_one('a.pagination-parts[data-page]')
        if not next_btn or int(next_btn.get('data-page', 0)) <= page:
            # テキストで次ページリンクを確認
            pager = soup.select('div.pagination > ul > li > a')
            page_nums = [int(a.get_text(strip=True)) for a in pager if a.get_text(strip=True).isdigit()]
            if page + 1 not in page_nums:
                break

        page += 1
        time.sleep(1.5)

    # 価格・面積フィルタ（サーバー側フィルタが効かない場合の保険）
    results = _filter_results(results)
    print(f"[SUUMO] {len(results)} 件取得")
    return results


def _parse_listings(soup: BeautifulSoup) -> list[dict]:
    """検索結果HTMLを解析して物件リストを返す"""
    results = []

    # SUUMO の物件ブロック（構造が変わる可能性があるため複数セレクタを試みる）
    blocks = (
        soup.select('div.property_unit-content') or
        soup.select('li.property-unit') or
        soup.select('div.cassette_content')
    )

    for block in blocks:
        try:
            item = _parse_one(block)
            if item:
                results.append(item)
        except Exception as e:
            print(f"[SUUMO] パースエラー: {e}")

    return results


def _parse_one(block) -> dict | None:
    """1物件分のHTMLブロックを解析"""
    item = {'情報源': 'SUUMO'}

    # ----- 価格 -----
    price_elem = (
        block.select_one('span.dottable-value') or
        block.select_one('div.ui-price__main') or
        block.select_one('[class*="price"]')
    )
    if price_elem:
        item['価格テキスト'] = price_elem.get_text(strip=True)
        item['価格_万円']   = _extract_man(item['価格テキスト'])

    # ----- 住所 -----
    addr_elem = (
        block.select_one('div.dottable-line') or
        block.select_one('span.cassette-location') or
        block.select_one('[class*="location"]')
    )
    if addr_elem:
        item['住所'] = addr_elem.get_text(strip=True)

    # ----- 面積 -----
    # テキスト全体から m² を探す
    full_text = block.get_text()
    area_match = re.search(r'([\d,]+(?:\.\d+)?)\s*m[²2]', full_text)
    if area_match:
        item['面積_sqm'] = float(area_match.group(1).replace(',', ''))
        item['面積']     = f"{item['面積_sqm']}m²"

    # ----- URL -----
    link = block.select_one('a[href*="/jj/bukken/"]') or block.select_one('a[href]')
    if link:
        href = link['href']
        item['参考URL'] = ('https://suumo.jp' + href) if href.startswith('/') else href

    # 最低限のデータがなければスキップ
    if not item.get('参考URL') and not item.get('住所'):
        return None

    return item


def _filter_results(results: list[dict]) -> list[dict]:
    """価格・面積・エリアで絞り込む"""
    filtered = []
    for item in results:
        price = item.get('価格_万円')
        area  = item.get('面積_sqm')
        addr  = item.get('住所', '')

        if price and price > MAX_PRICE_MAN:
            continue
        if area and (area < MIN_AREA_SQM or area > MAX_AREA_SQM):
            continue
        if addr and not any(c in addr for c in TARGET_CITIES):
            continue

        filtered.append(item)
    return filtered


def _extract_man(text: str) -> float | None:
    """価格テキストから万円の数値を抽出"""
    text = text.replace(',', '').replace('，', '')
    # 例: "1,500万円"
    m = re.search(r'([\d.]+)万円', text)
    if m:
        return float(m.group(1))
    # 例: "1億5000万円"
    m = re.search(r'(\d+)億(\d*)万?円', text)
    if m:
        return int(m.group(1)) * 10000 + (int(m.group(2)) if m.group(2) else 0)
    return None
