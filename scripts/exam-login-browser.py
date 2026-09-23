"""只用合成 API 驗證登入對話框，不連線真實服務或帳號。"""
import asyncio
import json
import sys
from playwright.async_api import async_playwright

BASE = sys.argv[1]
USER = {'id': 42, 'auth': '1111111111111111', 'email': 'synthetic@example.invalid',
        'name': '測試', 'wait_accredit': 0, 'expiry_days': None, 'ai_point': 0}
TOKENS = {'access': 'synthetic-access', 'refresh': 'synthetic-refresh'}

async def run(browser, method):
    context = await browser.new_context()
    page = await context.new_page()
    calls = []
    verify_gate = asyncio.Event()
    login_gate = asyncio.Event()
    logout_gate = asyncio.Event()
    hold_verify = False
    hold_login = False
    fail_login = False

    async def intercept(route):
        nonlocal hold_verify, hold_login, fail_login
        url = route.request.url
        if url.startswith(BASE):
            return await route.continue_()
        calls.append(url)
        headers = {'access-control-allow-origin': '*', 'access-control-allow-headers': '*',
                   'access-control-allow-methods': 'GET, POST, OPTIONS'}
        if route.request.method == 'OPTIONS':
            return await route.fulfill(status=204, headers=headers)
        if url.endswith('/token/verify'):
            if hold_verify:
                await verify_gate.wait()
            return await route.fulfill(status=200, headers=headers, content_type='application/json', body=json.dumps(USER))
        if url.endswith('/logout'):
            assert route.request.post_data_json == {'refresh': TOKENS['refresh']}
            await logout_gate.wait()
            return await route.fulfill(status=200, headers=headers, content_type='application/json', body='{"logged_out":true}')
        if url.endswith('/login/' + method):
            if hold_login:
                await login_gate.wait()
            return await route.fulfill(status=400 if fail_login else 200, headers=headers,
                                       content_type='application/json', body=json.dumps({'code': 'bad_input', 'message': '測試失敗'} if fail_login else TOKENS))
        if url.endswith('/email-code'):
            return await route.fulfill(status=200, headers=headers, content_type='application/json', body='{"is_user":true}')
        if '/user_info' in url:
            return await route.fulfill(status=200, headers=headers, content_type='application/json', body='{}')
        return await route.abort()

    await page.route('**/*', intercept)
    try:
        await page.goto(BASE + '/')
        trigger = page.get_by_role('button', name='會員登入')
        await trigger.wait_for(timeout=15000)
        await trigger.click()
        dialog = page.get_by_role('dialog')
        await dialog.wait_for()
        if method == 'password':
            await dialog.get_by_role('radio', name='密碼登入').check()
            form = dialog.locator('form:has(#password)')
            await form.locator('#email').fill('synthetic@example.invalid')
            await form.locator('#password').fill('not-a-real-password')
            field = form.locator('#email')
        else:
            form = dialog.locator('form:has(#code)')
            await form.locator('#email').fill('synthetic@example.invalid')
            await form.get_by_role('button', name='取得驗證碼').click()
            await form.get_by_role('button', name='60秒後重試').wait_for(timeout=10000)
            await form.locator('#code').fill('123456')
            field = form.locator('#email')
        fail_login = True
        await form.get_by_role('button', name='登入').click()
        await page.wait_for_function("method => performance.getEntriesByType('resource').some(x => x.name.endsWith('/login/' + method))", arg=method, timeout=10000)
        await page.wait_for_timeout(100)
        assert any(url.endswith('/login/' + method) for url in calls), calls
        assert await dialog.count() == 1
        assert await field.input_value() == 'synthetic@example.invalid'
        fail_login = False
        hold_login = True
        await form.get_by_role('button', name='登入').click()
        await page.wait_for_timeout(100)
        assert await dialog.count() == 1
        assert await field.input_value() == 'synthetic@example.invalid'
        hold_verify = True
        login_gate.set()
        await page.wait_for_function("!!localStorage.getItem('ph_tokens')", timeout=10000)
        await page.get_by_role('status', name='載入中').wait_for(timeout=10000)
        assert await dialog.count() == 1
        assert await field.input_value() == 'synthetic@example.invalid'
        verify_gate.set()
        await dialog.wait_for(state='detached', timeout=10000)
        assert await page.get_by_role('button', name='會員登入').count() == 0
        assert await page.evaluate("document.activeElement?.getAttribute('aria-label')") == '會員入口'
        assert any('/token/verify' in url for url in calls)
        await page.locator('[aria-label="會員入口"] [role="button"]').first.click()
        await page.get_by_role('button', name='登出').click()
        await page.get_by_role('button', name='會員登入').wait_for(timeout=2000)
        assert await page.evaluate("localStorage.getItem('ph_tokens')") is None
        assert await page.locator('nav').count() == 1
        await page.get_by_role('button', name='會員登入').click()
        await dialog.wait_for()
        logout_gate.set()
        await page.wait_for_timeout(150)
        assert await dialog.count() == 1
        await dialog.get_by_role('button', name='關閉視窗').click()
        await page.get_by_role('button', name='關於本網站').click()
        await page.get_by_role('button', name='更新日誌').click()
        changelog = page.get_by_role('dialog')
        await changelog.wait_for()
        await page.keyboard.press('Escape')
        assert await changelog.is_visible(), 'non-login modal must preserve existing Escape behavior'
        await changelog.get_by_role('button', name='關閉視窗').click()
        assert not await changelog.is_visible(), 'non-login modal close button must still work'
        print(json.dumps({'method': method, 'login_calls': len([url for url in calls if url.endswith('/login/' + method)]),
                          'verify_calls': len([url for url in calls if url.endswith('/token/verify')]),
                          'dialog_closed': True, 'focus_returned': True, 'logout_during_pending': True,
                          'late_logout_kept_new_dialog': True, 'ordinary_modal_unchanged': True}, ensure_ascii=False))
    finally:
        login_gate.set()
        verify_gate.set()
        logout_gate.set()
        await context.close()

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        try:
            for method in ('password', 'email'):
                await run(browser, method)
        finally:
            await browser.close()

asyncio.run(main())
