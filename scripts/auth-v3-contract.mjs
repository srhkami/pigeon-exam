import assert from 'node:assert/strict'
import {createRefreshCoordinator} from '../src/auth/refreshCoordinator.ts'

const success = createRefreshCoordinator()
let calls = 0
const refresh = async () => { calls += 1; return 'access-token' }
assert.deepEqual(await Promise.all([success.run(refresh, () => {}), success.run(refresh, () => {})]), ['access-token', 'access-token'])
assert.equal(calls, 1)

const failure = createRefreshCoordinator()
let failures = 0
let rejectRefresh
const rejected = new Promise((_, reject) => { rejectRefresh = reject })
const waiting = [failure.run(() => rejected, () => { failures += 1 }), failure.run(() => rejected, () => { failures += 1 })]
rejectRefresh(new Error('refresh_failed'))
for (const result of await Promise.allSettled(waiting)) assert.equal(result.status, 'rejected')
assert.equal(failures, 1)
console.log('auth-v3-contract=pass')
