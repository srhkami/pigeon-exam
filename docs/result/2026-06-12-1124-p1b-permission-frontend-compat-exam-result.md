# P1-B 權限修正後測驗前端相容結果報告

## 結論

前端已與 `pigeon-hand-api` `a1ee678` 的權限收斂合約相容。`Paper` 提交 payload 未包含 `user`，使用者紀錄頁已使用 self endpoint，管理者紙本紀錄頁也維持 `EM` gate。此次僅做 1 個前端修正：補齊 `Paper.tsx` 的 `useEffect` dependency array，使 scoped eslint 無 warning。

## E1-E5 對照

### E1：盤點作答/紀錄建立 payload 是否仍送 user

- 結果：已盤點。
- 發現：`src/features/Paper/for-user/Paper.tsx` 的 submit payload 未送 `user`。
- 補充：`Select` / `Essay` 相關檔案仍可見 `user: userInfo.id`，但屬於題目/編輯情境，不屬本次 Paper submit 必修範圍；未修改後端授權模型。

### E2：調整 Paper submit 型別與 payload

- 結果：`src/types/exam-types.ts` 的 `PaperSubmitForm` 已符合預期，不含 `user`。
- 修改：無需調整 `PaperSubmitForm` 型別內容。
- 額外修正：`src/features/Paper/for-user/Paper.tsx` 補上 `useEffect` dependencies，避免 lint warning。

### E3：確認使用者/管理者紀錄頁 endpoint 與權限 UX

- 結果：已驗證。
- 使用者端：`src/features/Paper/for-user/PaperRecords.tsx` 使用 `EXAM_API + '/paper_records/self/'`。
- 管理端：`src/lib/pages.tsx` 的 `PaperPagesForManager.records` / `record` 皆包在 `EM` gate 下；`src/routes/paper.tsx` 對應 manager route 已分流。
- 修改：無需調整頁面 endpoint。

### E4：處理登入/驗證錯誤訊息相容

- 結果：已檢視登入流程與 shared toast/error handling。
- 發現：現有 `PasswordForm` / `EmailForm` 已針對 400、500 做表單錯誤與 toast 處理；`BtnEmailCode` 失敗時也有 `errorLogger`。
- 修改：無需額外調整。

### E5：驗證

- 結果：完成。
- `pnpm exec eslint src/features/Paper/for-user/Paper.tsx src/features/Paper/for-user/PaperRecords.tsx src/types/exam-types.ts`
  - exit code: `0`
  - 重點輸出：無錯誤、無 warning。
- `pnpm build`
  - exit code: `0`
  - 重點輸出：`tsc -b && vite build` 成功完成。
  - 非阻塞警告：`pdfjs-dist` 的 `eval` 提示與 chunk size warning，屬既有建置警告，未阻塞建置。

### Shared frontend probe / final rerun

- Command: `python3 pigeon-hand/scripts/probe_frontend_unification.py`（於 workspace root 執行）
- Exit code: `0`
- Output: `FRONTEND_UNIFICATION_PROBE_OK`
- Hermes final rerun after toast sync:
  - Command: `pnpm exec eslint src/features/Paper/for-user/Paper.tsx src/features/Paper/for-user/PaperRecords.tsx src/types/exam-types.ts src/func/toast.ts && pnpm build`
  - Exit code: `0`
  - Output highlights: scoped eslint 無輸出；build 成功，僅有既有 `pdfjs-dist` eval warning 與 Vite chunk size warning。

## 實際修改檔案

- `src/features/Paper/for-user/Paper.tsx`
  - 補上 `useEffect` dependency array：`[api, navi, uuid]`。
- `src/func/toast.ts`
  - Hermes 驗收時發現 `pigeon-hand` 為 H4 修改了共用 `func/toast.ts`，導致 `pigeon-hand/scripts/probe_frontend_unification.py` 回報三前端共用工具不同步。
  - 已將同一個 toast error formatter 同步到本 repo，維持三前端 shared baseline 一致，並支援 `{detail}`、`{code}`、field shaped payload、HTTP 429 等錯誤訊息格式。
- `docs/result/2026-06-12-1124-p1b-permission-frontend-compat-exam-result.md`
  - 本結果報告。

## 手動 / API smoke

- 未執行。
- 原因：本次要求僅在本機 repo 內做前端相容修正與 build/lint 驗證，且不得呼叫外部或 staging/production 服務。

## 未完成項目 / Blockers

- 無。
- `SelectRecordViewSet`、`EssayRecordViewSet`、`ExamResultViewSet` 等 deferred backend owner-scope 項目未處理，僅在盤點中確認未影響本次 Paper 相容範圍。

## 約束聲明

- 未修改後端。
- 未修改 `pigeon-hand` 或 `pigeon-manage`。
- 未讀取 `.env` 或任何 secrets。
- 未呼叫外部 LLM/API 或任何 production/staging 服務。
- 未實作 httpOnly cookie、cookie refresh、CSRF cookie auth 或 CORS credentials 流程。
