---
id: plan.pigeon-exam.email-v3.2026-08-16
type: implementation-plan
title: Exam EmailCode V3 切換
status: completed
execution_status: completed_source_contract_typecheck_build_review_pass
canonical: true
path_convention: project-root-relative
created: 2026-08-16
updated: 2026-08-16
owner: pigeon-exam
owner_state: STATE.md
workstream: email-v3
parent_plan:
  id: plan.email-v3.coordination.2026-08-16
  path: ../docs/plans/2026-08-16-email-v3-coordination.md
producer_plan:
  id: plan.pigeon-hand-api.email-v3.2026-08-16
  path: ../pigeon-hand-api/docs/plans/2026-08-16-email-v3-api.md
result_path: docs/result/2026-08-16-email-v3-exam-result.md
review:
  status: passed
  final_review_id: deleg_d95ba794
  result_path: ../docs/result/2026-08-16-email-v3-plan-sanity-review-result.md
approval_gates:
  planning_docs: approved_consumed_2026-08-16
  frontend_source_write: approved_consumed_2026-08-16
  package_install: prohibited_not_required
  api_runtime: closed
  browser_uat: closed
  frontend_cutover: closed
  production_deploy: closed
  commit: closed
  push: closed
allowed_paths:
  - STATE.md
  - src/lib/config.ts
  - src/features/User/Login/BtnEmailCode.tsx
  - scripts/email-code-v3-contract.mjs
  - package.json
  - docs/plans/2026-08-16-email-v3-exam.md
  - docs/result/2026-08-16-email-v3-exam-result.md
---

# Exam EmailCode V3 切換實作計畫

## 1. 目標

將 Exam 登入元件的 EmailCode 寄送從 `/user/get_email_code/` 切換到 `POST /v3/user/email-code`。只遷移寄送端點；既有 Email 登入驗證仍可使用共享 cache 的 V1 login endpoint，不在本計畫擴張成整套登入遷移。

## 2. 修改設計

- `src/lib/config.ts` 依既有 ROOT_IP 增加 `V3_API`、`V3_USER_API`，不改 DEV_MODE／正式 host。
- `BtnEmailCode.tsx` 使用 `${V3_USER_API}/email-code`。
- Payload 只有 email；success 必須確認 `is_user` 是 boolean。
- 使用同步 `useRef` 防止同 render window 雙擊；成功後才開始 60 秒倒數。
- 422／429／502／503 使用互斥繁中訊息；unknown 要求先檢查信箱且不自動重送。
- 不新增 V1 fallback、不改 Email login、signup 或 Analyze UI。

## 3. 檢查點

### E0：基線與 producer

- 保存 branch/status；目前 branch ahead 1，禁止 rewrite／reset。
- 從 API source 確認 path、schema、固定 errors 與 registry/runtime gate。

### E1：Probe RED/GREEN

前置：核准 frontend source。

- 新增 `scripts/email-code-v3-contract.mjs` 與 `test:email-code-v3` package script，無新 dependency。
- RED 捕捉 V1 URL、缺 V3 constants、缺同步 in-flight。
- 實作最小 config/component 變更後轉 GREEN。

### E2：驗證與審查

從 `pigeon-exam/` 執行：

```text
pnpm test:email-code-v3
pnpm exec eslint src/lib/config.ts src/features/User/Login/BtnEmailCode.tsx
pnpm exec tsc -b
pnpm build
```

再執行 diff/staged/allowed-path guard。Fresh reviewer 檢查 URL、共享登入相容、double-click、unknown no-retry 與無 scope creep。Browser、cutover、production、Git 各自關閉。

## 4. 驗收條件

- AC-E-1：不再引用 `/user/get_email_code/`，只呼叫 V3。
- AC-E-2：V3 constants 由 ROOT_IP 組成，沒有硬編碼第二個 host。
- AC-E-3：response 必須有 boolean `is_user`；成功才倒數。
- AC-E-4：雙擊一個 request；422／429／502／503 無 fallback／自動重試。
- AC-E-5：Email login／signup／Analyze 功能不變，無新 dependency。
- AC-E-6：probe、lint、typecheck、build及未執行 gate 如實記錄。

## 5. 停止條件

Producer source 不存在／漂移；V3 與 V1 login 不再共享驗證碼服務；需改全域 request framework；ahead commit／dirty hunk 無法歸因；同檔修正三輪不收斂。
