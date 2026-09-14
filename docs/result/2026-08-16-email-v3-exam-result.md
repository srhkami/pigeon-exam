---
id: result.pigeon-exam.email-v3.2026-08-16
type: implementation-result
title: Exam EmailCode V3 切換結果
scope: pigeon-exam
historical_status: completed_source_contract_typecheck_build_review_pass
canonical: true
created: 2026-08-16
completed_at: 2026-08-16
implements: plan.pigeon-exam.email-v3.2026-08-16
historical_review:
  status: pass
  initial_handle: deleg_dde3bb62
  final_handle: deleg_27a198a9
verification_scope: source_contract_typecheck_build_cross_repo_guard_no_browser
historical_approval_gates:
  frontend_source_write: approved_consumed_2026-08-16
  api_runtime: closed_not_executed
  browser_uat: closed_not_executed
  frontend_cutover: closed_not_executed
  production_deploy: closed_not_executed
  commit: closed_not_executed
  push: closed_not_executed
updated: 2026-09-14
status: completed
execution_status: completed_user_attested
closure_date: 2026-09-14
closure_basis: user_attested
closure_result: ../docs/result/2026-09-14-completed-work-status-reconciliation-result.md
followups: []
approval_gates:
  new_product_runtime_db_deploy_git_actions: closed_requires_new_explicit_approval
---

# Exam EmailCode V3 切換結果

## 目前完成狀態（2026-09-14）

使用者於 2026-09-14 明確確認本輪盤點所列相關工作及原延後驗收／啟用／發布事項已完成，要求停止追蹤；本文件生命週期改為完成，沒有待補驗或待發布清單。完成依據與跨專案處置見 `../docs/result/2026-09-14-completed-work-status-reconciliation-result.md`。本輪未重新執行資料庫、外部傳輸、正式部署或 Git；使用者確認不改寫原代理驗測結果，也不授權新的副作用。

# 原計畫與歷史證據（截至本輪校正前）

以下保留原交付時點的契約、核准及驗測紀錄；其未完成／延後敘述不再建立目前追蹤義務。

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
