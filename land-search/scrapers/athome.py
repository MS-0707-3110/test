"""
at-home 土地情報スクレイパー
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

# at-home の土地検索URL（山梨県）
# city_slug: 市区町村スラッグ
CITY_SLUGS = {
    "南アルプス市": "minami-alps-city",
    "中央市":       "chuo-city",
    "昭和町":       "showa-town",
}

TARGET_CITIES = list(CITY_SLUGS.keys())
MAX_PRICE_MAN = 1800
MIN_AREA_SQM  = 231
MAX_AREA_SQM  = 430


def scrape_athome() -> list[dict]:
    """at-homeから土地情報を取得して返す"""
    results = []

    for city_ja, city_slug in CITY_SLUGS.items():
        url = f"https://www.athome.co.jp/tochi/yamanashi/{city_slug}/list/"
        params = {
            'PRICETO':    str(MAX_PRICE_MAN),
            'MENSEKIFROM': str(MIN_AREA_SQM),
            'MENSEKITO':  str(MAX_AREA_SQM),
            'TOSEN':      '1',   # 坪数指定モード (0=m², 1=坪) ※サイト仕様による
        }
        page = 1

        while True:
            if page > 1:
                params['pg'] = str(page)

            try:
                resp = requests.get(url, params=params, headers=HEADERS, timeout=15)
                resp.raise_for_status()
            except requests.RequestException as e:
                print(f"[at-home] 接続エラー ({city_ja} page {page}): {e}")
                break

            soup = BeautifulSoup(resp.text, 'html.parser')
            listings = _parse_listings(soup, city_ja)

            if not listings:
                break

            results.extend(listings)

            # 次ページ確認
            next_link = soup.select_one('a[class*="next"]') or soup.select_one('li.next > a')
            if not next_link:
                break

            page += 1
            time.sleep(1.5)

    results = _filter_results(results)
    print(f"[at-home] {len(results)} 件取得")
    return results


def _parse_listings(soup: BeautifulSoup, city_ja: str) -> list[dict]:
    """at-home 検索結果を解析"""
    results = []

    blocks = (
        soup.select('div.property-list-unit') or
        soup.select('li.object-list-unit') or
        soup.select('[class*="property"][class*="unit"]') or
        soup.select('article[class*="property"]')
    )

    for block in blocks:
        try:
            item = _parse_one(block, city_ja)
            if item:
                results.append(item)
        except Exception as e:
            print(f"[at-home] パースエラー: {e}")

    return results


def _parse_one(block, city_ja: str) -> dict | None:
    """1物件分のHTMLブロックを解析"""
    item = {'情報源': 'at-home'}

    # ----- 価格 -----
    price_elem = (
        block.select_one('[class*="price"]') or
        block.select_one('span.color-price') or
        block.select_one('p[class*="price"]')
    )
    if price_elem:
        item['価格テキスト'] = price_elem.get_text(strip=True)
        item['価格_万円']   = _extract_man(item['価格テキスト'])

    # ----- 住所 -----
    addr_elem = (
        block.select_one('[class*="address"]') or
        block.select_one('[class*="location"]') or
        block.select_one('p[class*="addr"]')
    )
    if addr_elem:
        item['住所'] = addr_elem.get_text(strip=True)
    else:
        # 市区町村名が含まれるテキストを探す
        full_text = block.get_text()
        for city in TARGET_CITIES:
            if city in full_text:
                item['住所'] = city_ja  # フォールバック
                break

    # ----- 面積 -----
    full_text = block.get_text()
    area_match = re.search(r'([\d,]+(?:\.\d+)?)\s*m[²2]', full_text)
    if area_match:
        item['面積_sqm'] = float(area_match.group(1).replace(',', ''))
        item['面積']     = f"{item['面積_sqm']}m²"

    # ----- URL -----
    link = block.select_one('a[href*="/tochi/"]') or block.select_one('a[href]')
    if link:
        href = link['href']
        item['参考URL'] = ('https://www.athome.co.jp' + href) if href.startswith('/') else href

    if not item.get('参考URL') and not item.get('住所'):
        return None

    return item


def _filter_results(results: list[dict]) -> list[dict]:
    """価格・面積で絞り込む"""
    filtered = []
    for item in results:
        price = item.get('価格_万円')
        area  = item.get('面積_sqm')

        if price and price > MAX_PRICE_MAN:
            continue
        if area and (area < MIN_AREA_SQM or area > MAX_AREA_SQM):
            continue

        filtered.append(item)
    return filtered


def _extract_man(text: str) -> float | None:
    """価格テキストから万円の数値を抽出"""
    text = text.replace(',', '').replace('，', '')
    m = re.search(r'([\d.]+)万円', text)
    if m:
        return float(m.group(1))
    m = re.search(r'(\d+)億(\d*)万?円', text)
    if m:
        return int(m.group(1)) * 10000 + (int(m.group(2)) if m.group(2) else 0)
    return None
