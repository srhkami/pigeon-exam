"""冷快取、相同視窗及合成網路條件比較基線與候選首頁。"""
import asyncio
import json
import statistics
import sys
import time
from playwright.async_api import async_playwright

BASES = sys.argv[1:]

async def one(browser, base):
    context = await browser.new_context(viewport={'width': 390, 'height': 844})
    page = await context.new_page()
    external = []

    async def intercept(route):
        url = route.request.url
        if url.startswith(base):
            return await route.continue_()
        external.append(url)
        if 'api.pigeonhand.tw' in url:
            body = {'select_count': 1, 'select_record_count': 1, 'essay_count': 1, 'essay_record_count': 1} if '/user_info' in url else []
            return await route.fulfill(status=200, headers={'access-control-allow-origin': '*'},
                                       content_type='application/json', body=json.dumps(body))
        return await route.abort()

    await page.route('**/*', intercept)
    try:
        start = time.monotonic()
        await page.goto(base + '/', wait_until='commit')
        await page.locator('.stats').wait_for(timeout=15000)
        visible = round((time.monotonic() - start) * 1000)
        await page.locator('label[aria-label="open sidebar"]').click()
        assert await page.locator('#my-drawer-4').is_checked()
        nav = round((time.monotonic() - start) * 1000)
        return {'home_ms': visible, 'sidebar_ms': nav, 'external_synthetic_or_blocked': len(external)}
    finally:
        await context.close()

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        try:
            results = {}
            for base in BASES:
                samples = [await one(browser, base) for _ in range(3)]
                results[base] = {'samples': samples, 'median_home_ms': statistics.median(s['home_ms'] for s in samples),
                                 'median_sidebar_ms': statistics.median(s['sidebar_ms'] for s in samples)}
            print(json.dumps(results, ensure_ascii=False, indent=2))
        finally:
            await browser.close()

asyncio.run(main())
