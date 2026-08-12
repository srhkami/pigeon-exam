---
id: plan.pigeon-exam.errorlog-frontend-retirement.2026-08-12
type: implementation-plan
title: Exam 舊 ErrorLog 回報退役與安全提示
status: completed
execution_status: completed_source_build_verified_review_pass_runtime_not_executed
canonical: true
path_convention: project-root-relative
created: 2026-08-12
updated: 2026-08-12
owner: pigeon-exam
owner_state: STATE.md
workstream: errorlog-retirement
parent_plan:
  id: plan.errorlog-retirement.coordination.2026-08-12
  path: ../docs/plans/2026-08-12-errorlog-retirement-coordination.md
result_path: docs/result/2026-08-12-errorlog-frontend-retirement-result.md
review:
  status: pass
  handle: deleg_3e3aa391
approval_gates:
  planning_docs: approved_consumed_2026-08-12
  frontend_source_write: approved_consumed_2026-08-12
  package_install: not_required
  browser_uat: closed
  frontend_cutover: closed
  production_deploy: closed
  commit: closed
  push: closed
allowed_paths:
  - STATE.md
  - package.json
  - src/func/api-error.ts
  - src/func/error.tsx
  - src/func/form.ts
  - src/func/index.ts
  - src/func/toast.ts
  - src/func/copy.tsx
  - src/hooks/useCacheApi.tsx
  - src/hooks/useDataBrowser.tsx
  - src/hooks/useToastApi.tsx
  - src/types/user-types.ts
  - src/features/Layout/ErrorLogToast.tsx
  - src/features/FilePreview/FilePreview.tsx
  - src/features/Feedback/FeedbackWeb.tsx
  - src/features/Link/FileLink/ModalSelectFile.tsx
  - src/features/Paper/for-manager/Manage/ModalQuestionToText.tsx
  - src/features/User/Login/BtnEmailCode.tsx
  - src/features/User/Login/EmailForm.tsx
  - src/features/User/Login/PasswordForm.tsx
  - src/features/User/UserProfile/MenuUser.tsx
  - src/features/User/UserProfile/UserProfile.tsx
  - src/features/index.ts
  - scripts/errorlog-retirement-contract.mjs
  - docs/plans/2026-08-12-errorlog-frontend-retirement.md
  - docs/result/2026-08-12-errorlog-frontend-retirement-result.md
---

# Exam 舊 ErrorLog 回報退役與安全提示實作計畫

## 1. 目標

停止 Exam 向 `/web/feedback/error/send/` 上傳未知錯誤，移除「回報作者」與 `ErrorLogToast`，以共同安全提示契約處理 13 個有效呼叫點。保留既有測驗、登入、檔案預覽與網站回報業務流程。

## 2. 共同 helper 收斂

Exam 已有 `src/func/api-error.ts`，本次直接將它收斂成 root 協調計畫定義的 `getUserFacingErrorMessage(error, options)`，不得另建第二套 parser：

- 補 `401`、網路／無回應、`500` 固定訊息及呼叫點 status override。
- 任意 `code` 不直接顯示；改用 `codeMessages` 白名單。
- Server 訊息只接受狀態／精確 key／情境／原始值映射四重白名單；不得因狀態或 key 相符就顯示任意 detail／欄位字串。
- 移除遞迴展開任意巢狀物件與任意 `data` string 顯示，加入字串數量、長度、控制字元與 HTML 限制。
- `src/func/error.tsx` 改為 `showUserFacingError` 的純 toast adapter，不輸出完整錯誤。
- `src/func/toast.ts` 使用同一安全 parser，不 JSON stringify payload。
- `src/hooks/useToastApi.tsx` 與 `src/func/form.ts` 納入 touched chain，移除原始 server JSON、完整 error console output 與任意欄位遞迴顯示。

## 3. RED 契約

建立 `scripts/errorlog-retirement-contract.mjs` 與 `pnpm run test:errorlog-retirement`，驗證：

- parser 的四重白名單允許／拒絕矩陣；`[REDACTED]` 敏感字串即使位於允許 status、key、情境，只要 value 未映射仍須 fallback。
- 13 個既有檔案不再呼叫 `errorLogger`。
- 不存在 `/feedback/error/send/`、`回報作者`、`ErrorLogToast`、完整 error console output 或 JSON stringify fallback。
- `getUserFacingErrorMessage` 不顯示 Axios `message/config/request/stack`。

先取得舊來源 RED，再做最小 GREEN。

## 4. 呼叫點矩陣

### 4.1 保留既有精確提示

- `FilePreview.tsx`：保留預覽頁錯誤狀態與檔案存取訊息；`404` 使用「查無此檔案或連結已失效。」。
- `EmailForm.tsx`、`PasswordForm.tsx`：保留表單／狀態碼分流；未知錯誤「登入失敗，請稍後再試。」。
- `MenuUser.tsx`：保留登出提示與本機狀態清理。
- `UserProfile.tsx`：保留會員資料載入失敗狀態。
- `copy.tsx`：保留「複製失敗」。

### 4.2 操作專屬 fallback

- `FeedbackWeb.tsx`：「網站回報送出失敗，請稍後再試。」
- `ModalSelectFile.tsx`：「檔案搜尋失敗，請稍後再試。」
- `ModalQuestionToText.tsx`：「題目複製失敗，請確認瀏覽器已允許剪貼簿權限。」
- `BtnEmailCode.tsx`：已盤點的 `400` 欄位／值映射或「驗證碼寄送失敗，請稍後再試。」
- `useDataBrowser.tsx`：「資料載入失敗，請稍後再試。」並保留安全狀態碼分流。

### 4.3 靜默快取

- `useCacheApi.tsx`：移除回報與集中 toast，保留 loading 結束；不新增遙測。

## 5. 移除項目

- 刪除 `src/features/Layout/ErrorLogToast.tsx`。
- 移除 `src/features/index.ts` export。
- 移除 ErrorLog payload 與 endpoint 字串；一般網站回報 API 保留。
- 從 `src/types/user-types.ts` 移除後端不再回傳的 `error_log_count`。

## 6. 驗證

```bash
pnpm run test:errorlog-retirement
python3 ../scripts/probe_errorlog_retirement.py
pnpm exec eslint <本計畫修改的 ts/tsx 檔案>
pnpm build
git diff --check
```

另執行 root 跨前端 helper 一致性與禁止字串探測。未執行 browser UAT 時不得宣稱真實互動已驗收。

## 7. 停止條件

- 既有 `api-error.ts` 的其他 consumer 依賴任意巢狀 JSON 顯示且無法安全收斂。
- 發現盤點外 ErrorLog writer。
- 需要 package install、後端、DB、正式切換、production、commit 或 push。
