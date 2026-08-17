import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'

const config = readFileSync(new URL('../src/lib/config.ts', import.meta.url), 'utf8')
const source = readFileSync(new URL('../src/features/User/Login/BtnEmailCode.tsx', import.meta.url), 'utf8')
assert.ok(config.includes('export const V3_USER_API'))
assert.ok(source.includes("${V3_USER_API}/email-code"))
assert.ok(!source.includes('/get_email_code/'))
assert.ok(source.includes('useRef'))
assert.ok(source.includes('isEmailCodeRequestInFlight'))
assert.ok(source.includes("typeof res.data?.is_user !== 'boolean'"))
assert.ok(source.includes('email_code_too_frequent'))
assert.ok(source.includes('email_delivery_unknown'))
for (const status of ['status === 422', 'status === 429', 'status === 502', 'status === 503']) assert.ok(source.includes(status))
console.log('email-code-v3-contract=pass')
