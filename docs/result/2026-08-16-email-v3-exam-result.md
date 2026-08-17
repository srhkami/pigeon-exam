---
id: result.pigeon-exam.email-v3.2026-08-16
type: implementation-result
title: Exam EmailCode V3 切換結果
scope: pigeon-exam
status: completed_source_contract_typecheck_build_review_pass
canonical: true
created: 2026-08-16
completed_at: 2026-08-16
implements: plan.pigeon-exam.email-v3.2026-08-16
review:
  status: pass
  initial_handle: deleg_dde3bb62
  final_handle: deleg_27a198a9
verification_scope: source_contract_typecheck_build_cross_repo_guard_no_browser
approval_gates:
  frontend_source_write: approved_consumed_2026-08-16
  api_runtime: closed_not_executed
  browser_uat: closed_not_executed
  frontend_cutover: closed_not_executed
  production_deploy: closed_not_executed
  commit: closed_not_executed
  push: closed_not_executed
---

# Exam EmailCode V3 切換結果

## 結論

EmailCode 寄送已切換為 `POST /v3/user/email-code`；既有 V1 Email login 驗證端點未變。前端使用 boolean response fail-closed、同步防重、成功才倒數，並處理 422／429／502／503 與 unknown 零自動重送。

## 驗證

- `pnpm test:email-code-v3`：exit 0
- `pnpm exec tsc -b --pretty false`：exit 0
- `pnpm build`：exit 0
- cross-repo diff、legacy V1 residue 與 allowed-path guard：PASS
- 初次整合複審 REQUEST_CHANGES 已修正；focused re-review `deleg_27a198a9` PASS。

## 未執行

未執行 API runtime、browser UAT、前端正式切換、production、commit 或 push。