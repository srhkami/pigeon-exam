import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8')
const assertV3UserRoot = (source) => assert.match(source, /ROOT_IP\s*\+\s*['"]\/v3\/user['"]/)
const assertV3WebRoot = (source) => assert.match(source, /ROOT_IP\s*\+\s*['"]\/v3\/web['"]/)

const profile = await read('../src/features/User/UserProfile/UserProfile.tsx')
assertV3UserRoot(profile)
assert.match(profile, /V3_USER_API\s*\+\s*['"]\/me['"]/)
assert.match(profile, /method:\s*'GET'/)
assert.doesNotMatch(profile, /get_self_detail/)

const password = await read('../src/features/User/UserProfile/ModalChangePassword.tsx')
assertV3UserRoot(password)
assert.match(password, /V3_USER_API\s*\+\s*['"]\/me\/password['"]/)
assert.match(password, /method:\s*"POST"/)
assert.doesNotMatch(password, /change_pwd/)
const passwordPattern = password.match(/value:\s*\/(.+)\/,/)
assert.ok(passwordPattern, '必須使用正式元件的密碼規則')
const validatePassword = new RegExp(passwordPattern[1])
for (const [value, valid] of [
  ['Abcdef12', true], ['Abcdef1!', true], ['Abcdef1漢', true],
  ['A1' + '!'.repeat(30), true], ['Abcd12!', false],
  ['A1' + '!'.repeat(31), false], ['abcdefgh', false], ['12345678', false],
]) assert.equal(validatePassword.test(value), valid, `密碼規則不符：長度 ${value.length}，預期 ${valid}`)
assert.match(password, /details\?\.fields/)

const managers = await read('../src/features/About/ModalManagers.tsx')
assertV3UserRoot(managers)
assert.match(managers, /V3_USER_API\s*\+\s*['"]\/managers['"]/)
assert.match(managers, /method:\s*'GET'/)
assert.doesNotMatch(managers, /\bUSER_API\b\s*\+\s*['"]\/managers/)

const feedback = await read('../src/features/Feedback/FeedbackWeb.tsx')
assertV3WebRoot(feedback)
assert.match(feedback, /V3_WEB_API\s*\+\s*['"]\/feedback['"]/)
assert.match(feedback, /method:\s*'POST'/)
assert.doesNotMatch(feedback, /feedback\/web\/send/)

console.log('api-v3-retirement-batch2-contract=pass')
