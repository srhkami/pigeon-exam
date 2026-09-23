"""隔離 Chromium：延遲入口／首頁模組，外部請求只使用合成回應。"""
import asyncio
import json
import sys
import time
from pathlib import Path
from playwright.async_api import async_playwright

DIST = Path(sys.argv[1])
BASE = sys.argv[2]
chunks = json.loads((DIST / 'chunk-module-map.json').read_text())['chunks']
entry = next(chunk['fileName'] for chunk in chunks if chunk['isEntry'])
home = next(chunk['fileName'] for chunk in chunks if any(module.endswith('/src/features/Home/Home.tsx') for module in chunk['modules']))


async def scenario(browser, size, theme, reduced):
    context = await browser.new_context(viewport=size, reduced_motion='reduce' if reduced else 'no-preference')
    page = await context.new_page()
    entry_gate = asyncio.Event()
    home_gate = asyncio.Event()
    calls = []
    local_assets = []
    page.on('request', lambda request: local_assets.append(request.url) if '/assets/' in request.url else None)
    await page.add_init_script("""try { localStorage.setItem('theme', %s); } catch {}""" % json.dumps(theme))

    async def intercept(route):
        url = route.request.url
        if url.endswith(entry):
            await entry_gate.wait()
            return await route.continue_()
        if url.endswith(home):
            await home_gate.wait()
            return await route.continue_()
        if url.startswith(BASE):
            return await route.continue_()
        calls.append(url.split('?')[0])
        if 'api.pigeonhand.tw' in url:
            body = {'select_count': 1, 'select_record_count': 1, 'essay_count': 1, 'essay_record_count': 1} if '/user_info' in url else []
            return await route.fulfill(status=200, headers={'access-control-allow-origin': '*'}, content_type='application/json', body=json.dumps(body))
        return await route.abort()

    await page.route('**/*', intercept)
    try:
        await page.goto(BASE + '/', wait_until='commit')
        await page.locator('#startup-loading').wait_for()
        await page.wait_for_timeout(180)
        html = await page.locator('#startup-loading').evaluate("e => {const r=e.getBoundingClientRect(); const img=e.querySelector('img'); return {x:r.x,y:r.y,w:r.width,h:r.height,imgX:img.getBoundingClientRect().x,imgY:img.getBoundingClientRect().y,logo:img.naturalWidth,progress:getComputedStyle(document.documentElement).getPropertyValue('--exam-startup-progress')}}")
        assert html['logo'] > 0, html
        assert await page.locator('html').get_attribute('data-theme') == theme
        entry_gate.set()
        await page.locator('.startup-loading:not(#startup-loading)').wait_for(timeout=15000)
        react = await page.locator('.startup-loading:not(#startup-loading)').evaluate("e => {const r=e.getBoundingClientRect(); const img=e.querySelector('img'); return {x:r.x,y:r.y,w:r.width,h:r.height,imgX:img.getBoundingClientRect().x,imgY:img.getBoundingClientRect().y,logo:img.naturalWidth,progress:getComputedStyle(document.documentElement).getPropertyValue('--exam-startup-progress')}}")
        assert react['logo'] > 0, react
        assert abs(html['imgX'] - react['imgX']) <= 2 and abs(html['imgY'] - react['imgY']) <= 2, (html, react)
        if not reduced:
            assert float(react['progress']) >= float(html['progress']) and float(react['progress']) <= 0.9, (html, react)
        else:
            assert float(html['progress']) == 0.5 and float(react['progress']) == 0.9, (html, react)
        home_gate.set()
        released = time.monotonic()
        await page.locator('.stats').wait_for(timeout=15000)
        visible_ms = round((time.monotonic() - released) * 1000)
        assert await page.locator('.startup-loading').count() == 0
        assert not any(any(name in url for name in ('Statistics-', 'tiptapExtensions-', 'ModalTextEditor-', 'sortable.esm-', 'FilePreview-')) for url in local_assets), local_assets
        assert await page.locator('button[aria-label="會員登入"]').count() == 1
        await page.locator('button[aria-label="會員登入"]').click()
        dialog = page.get_by_role('dialog')
        await dialog.wait_for()
        assert await dialog.get_attribute('aria-labelledby') == 'exam-member-login-title'
        await page.keyboard.press('Escape')
        assert await dialog.count() == 0
        assert await page.evaluate("document.activeElement?.getAttribute('aria-label')") == '會員入口'
        print(json.dumps({'size': size, 'theme': theme, 'reduced': reduced, 'html': html, 'react': react, 'visible_ms_after_release': visible_ms, 'external_blocked_or_synthetic': len(calls)}, ensure_ascii=False))
    finally:
        entry_gate.set()
        home_gate.set()
        await context.close()


async def held_phases(browser):
    context = await browser.new_context()
    page = await context.new_page()
    entry_gate = asyncio.Event()
    home_gate = asyncio.Event()

    async def intercept(route):
        url = route.request.url
        if url.endswith(entry):
            await entry_gate.wait()
        if url.endswith(home):
            await home_gate.wait()
        if url.startswith(BASE):
            return await route.continue_()
        if 'api.pigeonhand.tw' in url:
            body = {} if '/user_info' in url else []
            return await route.fulfill(status=200, headers={'access-control-allow-origin': '*'}, content_type='application/json', body=json.dumps(body))
        return await route.abort()

    await page.route('**/*', intercept)
    try:
        await page.goto(BASE + '/', wait_until='commit')
        await page.locator('#startup-loading').wait_for()
        await page.wait_for_timeout(6400)
        html = await page.evaluate("Number(document.documentElement.style.getPropertyValue('--exam-startup-progress'))")
        assert abs(html - 0.5) < 0.001, html
        entry_gate.set()
        await page.locator('.startup-loading:not(#startup-loading)').wait_for(timeout=15000)
        initial = await page.evaluate("Number(document.documentElement.style.getPropertyValue('--exam-startup-progress'))")
        assert 0.5 <= initial < 0.9, initial
        await page.wait_for_timeout(6400)
        react = await page.evaluate("Number(document.documentElement.style.getPropertyValue('--exam-startup-progress'))")
        assert abs(react - 0.9) < 0.001, react
        home_gate.set()
        await page.locator('.stats').wait_for(timeout=15000)
        after = await page.evaluate("Number(document.documentElement.style.getPropertyValue('--exam-startup-progress'))")
        await page.wait_for_timeout(150)
        assert await page.evaluate("Number(document.documentElement.style.getPropertyValue('--exam-startup-progress'))") == after
        print(json.dumps({'html_ceiling': html, 'react_initial': initial, 'react_ceiling': react, 'unmount_stable': True}))
    finally:
        entry_gate.set()
        home_gate.set()
        await context.close()


async def deep_link(browser):
    context = await browser.new_context()
    page = await context.new_page()
    assets = []
    page.on('request', lambda request: assets.append(request.url) if '/assets/' in request.url else None)

    async def intercept(route):
        if route.request.url in (BASE + '/statistics', BASE + '/about'):
            return await route.fulfill(status=200, content_type='text/html', body=(DIST / 'index.html').read_text())
        if route.request.url.startswith(BASE):
            return await route.continue_()
        return await route.abort()

    await page.route('**/*', intercept)
    try:
        await page.goto(BASE + '/statistics')
        await page.get_by_role('button', name='會員登入').wait_for(timeout=15000)
        assert await page.locator('.startup-loading').count() == 0
        assert not any('/Statistics-' in url for url in assets), assets
        await page.goto(BASE + '/about')
        await page.get_by_role('button', name='會員登入').wait_for(timeout=15000)
        assert await page.locator('.startup-loading').count() == 0
        print(json.dumps({'deep_links': ['/statistics', '/about'], 'protected_chunk_requested_as_guest': False, 'loading_removed': True}))
    finally:
        await context.close()


async def protected_entries(browser):
    context = await browser.new_context(viewport={'width': 1365, 'height': 900})
    page = await context.new_page()
    assets = []
    api_calls = []
    page.on('request', lambda request: assets.append(request.url) if '/assets/' in request.url else None)
    await page.add_init_script("localStorage.setItem('ph_tokens', JSON.stringify({access:'synthetic-access',refresh:'synthetic-refresh'}))")
    user = {'id': 42, 'auth': '1111111111111111', 'email': 'synthetic@example.invalid',
            'name': '測試', 'wait_accredit': 0, 'expiry_days': None, 'ai_point': 0}

    async def intercept(route):
        url = route.request.url
        if url in (BASE + '/statistics', BASE + '/select/random', BASE + '/analyze/1', BASE + '/select/records/1'):
            return await route.fulfill(status=200, content_type='text/html', body=(DIST / 'index.html').read_text())
        if url.startswith(BASE):
            return await route.continue_()
        if 'api.pigeonhand.tw' not in url:
            return await route.abort()
        api_calls.append(url)
        if '/token/verify' in url:
            body = user
        elif '/trend' in url:
            body = {'total_count': 1, 'correct_count': 1, 'stats': [{'period': '2026-09-23', 'correct_rate': 100}]}
        elif '/filter_options' in url:
            body = {'source': [], 'category': [], 'subject': []}
        elif '/analyze_reports/' in url:
            body = {'created_at': '2026-09-23', 'subject': '合成科目', 'response_text': '合成分析內容'}
        elif '/user_info' in url:
            body = {'select_count': 1, 'select_record_count': 1, 'essay_count': 1, 'essay_record_count': 1}
        else:
            body = []
        return await route.fulfill(status=200, headers={'access-control-allow-origin': '*'},
                                   content_type='application/json', body=json.dumps(body))

    await page.route('**/*', intercept)
    try:
        await page.goto(BASE + '/statistics')
        await page.get_by_text('作答統計', exact=True).first.wait_for(timeout=15000)
        await page.locator('svg.recharts-surface').first.wait_for(timeout=15000)
        assert any('/Statistics-' in url for url in assets)
        await page.get_by_role('button', name='查看此科目的作答紀錄').first.click()
        await page.wait_for_url('**/select/records/**', timeout=10000)
        await page.get_by_text('選擇題作答記錄').first.wait_for(timeout=15000)
        assert any('/SelectRecords-' in url for url in assets)
        await page.goto(BASE + '/select/random')
        await page.get_by_text('出題範圍').first.wait_for(timeout=15000)
        assert any('/SelectRandom-' in url for url in assets)
        await page.goto(BASE + '/analyze/1')
        await page.get_by_text('合成分析內容').wait_for(timeout=15000)
        assert any('/AnalyzeReport-' in url for url in assets)
        print(json.dumps({'protected_entries': ['Statistics', 'SelectRecords', 'SelectRandom', 'AnalyzeReport'],
                          'chart_rendered': True, 'analysis_synthetic': True, 'api_calls': len(api_calls)}, ensure_ascii=False))
    finally:
        await context.close()


async def slow_auth_shell(browser):
    context = await browser.new_context()
    page = await context.new_page()
    verify_gate = asyncio.Event()
    calls = []
    await page.add_init_script("localStorage.setItem('ph_tokens', JSON.stringify({access:'synthetic-access',refresh:'synthetic-refresh'}))")

    async def intercept(route):
        url = route.request.url
        if url.startswith(BASE):
            return await route.continue_()
        if 'api.pigeonhand.tw' not in url:
            return await route.abort()
        calls.append(url)
        if '/token/verify' in url:
            await verify_gate.wait()
            body = {'id': 42, 'auth': '1111111111111111', 'email': 'synthetic@example.invalid',
                    'name': '測試', 'wait_accredit': 0, 'expiry_days': None, 'ai_point': 0}
        elif '/user_info' in url:
            body = {'select_count': 1, 'select_record_count': 1, 'essay_count': 1, 'essay_record_count': 1}
        else:
            body = []
        return await route.fulfill(status=200, headers={'access-control-allow-origin': '*'},
                                   content_type='application/json', body=json.dumps(body))

    await page.route('**/*', intercept)
    try:
        await page.goto(BASE + '/')
        await page.get_by_role('status', name='載入中', exact=True).wait_for(timeout=15000)
        await page.get_by_text('蒐錄選擇題').wait_for(state='hidden', timeout=10000)
        assert not any('/user_info' in url for url in calls), calls
        assert await page.get_by_role('button', name='會員登入').count() == 0
        assert await page.locator('nav').count() == 1
        verify_gate.set()
        await page.get_by_text('蒐錄選擇題').wait_for(timeout=10000)
        assert any('/user_info' in url for url in calls)
        print(json.dumps({'slow_verify': True, 'public_nav_early': True, 'user_info_deferred': True}))
    finally:
        verify_gate.set()
        await context.close()


async def editor_and_preview(browser):
    context = await browser.new_context(viewport={'width': 1365, 'height': 900})
    page = await context.new_page()
    assets = []
    writes = []
    page.on('request', lambda request: assets.append(request.url) if '/assets/' in request.url else None)
    await page.add_init_script("localStorage.setItem('ph_tokens', JSON.stringify({access:'synthetic-access',refresh:'synthetic-refresh'}))")
    question = {
        'id': 1, 'question': '合成申論題', 'year': '115', 'source': '合成考試',
        'category': '合成類科', 'subject': '合成科目', 'user': 42,
        'user_display': '測試', 'created_at': '2026-09-23', 'records': [],
        'record_count': 0, 'file_link': [], 'is_public': True,
        'sample_answer': {'type': 'doc', 'content': [{'type': 'paragraph', 'content': [{'type': 'text', 'text': '合成擬答預覽'}]}]},
    }

    async def intercept(route):
        url = route.request.url
        if route.request.is_navigation_request() and url.startswith(BASE + '/manage/essay/questions/'):
            return await route.fulfill(status=200, content_type='text/html', body=(DIST / 'index.html').read_text())
        if url.startswith(BASE):
            return await route.continue_()
        if 'api.pigeonhand.tw' not in url:
            return await route.abort()
        if route.request.method not in ('GET', 'OPTIONS', 'POST') or (route.request.method == 'POST' and '/token/verify' not in url):
            writes.append(url)
            return await route.abort()
        if '/token/verify' in url:
            body = {'id': 42, 'auth': '1111111111111111', 'email': 'synthetic@example.invalid',
                    'name': '測試', 'wait_accredit': 0, 'expiry_days': None, 'ai_point': 0}
        elif '/essay_questions/' in url:
            body = {'results': [question], 'page_count': 1, 'total_count': 1, 'page_number': 1}
        elif '/user_info' in url:
            body = {'select_count': 1, 'select_record_count': 1, 'essay_count': 1, 'essay_record_count': 1}
        else:
            body = []
        return await route.fulfill(status=200, headers={'access-control-allow-origin': '*'},
                                   content_type='application/json', body=json.dumps(body))

    await page.route('**/*', intercept)
    try:
        await page.goto(BASE + '/manage/essay/questions/1?ordering=-year')
        await page.get_by_text('合成申論題').first.wait_for(timeout=15000)
        await page.locator('input[name="showSample"]').check()
        await page.get_by_text('合成擬答預覽').wait_for(timeout=15000)
        assert any('/RichTextShow-' in url for url in assets)
        await page.locator('.card button.absolute').first.click()
        await page.get_by_text('編輯申論題').wait_for(timeout=15000)
        await page.get_by_role('button', name='編輯文本').wait_for(timeout=15000)
        assert any('/ModalTextEditor-' in url for url in assets)
        await page.get_by_role('button', name='編輯文本').click()
        await page.locator('[contenteditable="true"]').wait_for(timeout=15000)
        assert not writes, writes
        print(json.dumps({'rich_preview': True, 'editor_opened': True, 'writes': len(writes)}, ensure_ascii=False))
    finally:
        await context.close()

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        try:
            for size in ({'width': 390, 'height': 844}, {'width': 1365, 'height': 900}):
                for theme, reduced in (('light', False), ('dark', True)):
                    await scenario(browser, size, theme, reduced)
            await held_phases(browser)
            await deep_link(browser)
            await protected_entries(browser)
            await slow_auth_shell(browser)
            await editor_and_preview(browser)
        finally:
            await browser.close()


asyncio.run(main())
