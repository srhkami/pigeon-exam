# P1-C Exam Record Scope Frontend Compatibility Plan

> **Runner:** OpenCode（必須等後端 P1-C 通過 Hermes 驗收後，且使用者再次授權，才可執行）
> **Result report required:** `docs/result/2026-06-12-1443-p1c-exam-record-scope-frontend-frontend-result.md`
> **Repo:** `/Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam`
> **Backend dependency:** `pigeon-hand-api/docs/plans/2026-06-12-1443-p1c-exam-record-scope-backend.md`

**Goal:** 讓 `pigeon-exam` 前端與後端 P1-C 權限契約一致：E 使用者只走 self/action 流程，管理端紀錄查閱角色與後端一致，並在 403/404/429 等錯誤時顯示可理解的訊息。

**Architecture:** 後端 permission/queryset/serializer 是安全邊界；前端 AuthLayout/Page 權限只做 UX 與避免誤操作。此 plan 不應繞過後端限制，只調整路由權限、API 呼叫 endpoint、payload shape 與錯誤呈現。

**Tech Stack:** React、Vite、TypeScript、pnpm、React Router、既有 API hooks/helpers。

---

## 1. 前置條件

此 frontend plan 不可先於後端 plan 執行。執行前必須確認：

1. 後端 P1-C result report 已存在：
   - `pigeon-hand-api/docs/result/2026-06-12-1443-p1c-exam-record-scope-backend-backend-result.md`
2. Hermes 已接受後端驗收。
3. 後端契約確認如下：
   - SelectRecord 全量查閱：EH / AM / superuser。
   - EssayRecord 全量查閱：EM / AM / superuser。
   - PaperRecord 全量查閱：EM / AM / superuser。
   - E 只能走 self endpoint 與明確 submit/create action。
   - E 題目/試卷 list public-only。

若後端 result report 缺失或契約與此文件不同，OpenCode 必須停止並寫 BLOCKED result report，不得猜測修改。

## 2. Task F0：Preflight 與現況盤點

**Objective:** 確認 `pigeon-exam` 工作樹乾淨，並定位目前作答紀錄頁與 API 呼叫。

**Commands:**

```bash
cd /Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam
git status --short --untracked-files=all
git log -1 --oneline
```

**Expected:** 工作樹應乾淨。若有未提交程式碼變更，先停止並在 result report 標記 BLOCKED。

**Inspect files:**

- `src/lib/pages.tsx`
- `src/routes/select.tsx`
- `src/routes/essay.tsx`
- `src/routes/paper.tsx`
- `src/features/Select/**`
- `src/features/Essay/**`
- `src/features/Paper/**`
- `src/types/exam-types.ts`
- 既有 API hook/helper 檔案

## 3. Task F1：管理頁路由權限對齊

**Objective:** 前端管理頁顯示權限與後端全量查閱角色一致。

**Files:**

- Modify: `src/lib/pages.tsx`
- Possibly modify route/menu files if role checks duplicated elsewhere

**Required behavior:**

1. 選擇題紀錄查閱：維持 EH。
   - `SelectPagesForManager.records` 目前為 EH，應保持。
2. 申論題紀錄查閱：維持 EM。
   - `EssayPagesForManager.records` 目前為 EM，應保持。
3. 試卷紀錄查閱：維持 EM。
   - `PaperPagesForManager.records` 目前為 EM，應保持。
4. 若頁面內還有額外 `AuthComponent` 或 action button 權限，需同步確認不要與頁面角色衝突。

**Acceptance:**

- 前端不應把申論/試卷紀錄全量查閱降成 EH。
- 前端不應把選擇題紀錄全量查閱升成 EM，因使用者已決策維持 EH。

## 4. Task F2：E 使用者紀錄頁改走 self endpoint

**Objective:** E 使用者的作答紀錄列表/詳情不再依賴一般 list endpoint。

**Files:**

- Modify: `src/features/Select/for-user/Record/**`
- Modify: `src/features/Essay/for-user/Record/**`
- Modify: `src/features/Paper/for-user/**` only if still hitting generic list instead of self endpoint
- Modify: API hook/helper files if needed
- Modify: `src/types/exam-types.ts` if payload/read types need separation

**Required behavior:**

1. 使用者選擇題紀錄頁：
   - list 應使用後端 self endpoint。
   - detail 若目前用一般 retrieve，需確認後端是否支援 self-safe detail；若沒有，前端應由 self list 結果連到可用資料，或等待後端契約補齊。不可用一般 retrieve 假裝可行。
2. 使用者申論題紀錄頁：
   - list 應使用 self endpoint。
   - create 應使用 `create_for_student` 或後端認可的 action，不送 `user`。
3. 使用者試卷紀錄頁：
   - 先檢查是否已走 self endpoint；若不是，改為 self endpoint。
   - Paper submit payload 不得包含可偽造 `user`。

**Acceptance:**

- E 使用者頁面沒有呼叫一般 records list 來取得個人紀錄。
- create/submit payload 不含 `user` / `user_id` owner spoofing 欄位。
- 若後端沒有提供某個 self detail endpoint，result report 必須標記為 backend follow-up，不得以不安全 endpoint 替代。

## 5. Task F3：管理端紀錄頁維持 generic list，但只在正確角色出現

**Objective:** 管理端紀錄查閱繼續使用後端一般 list/filter，但只在對應角色頁面出現。

**Files:**

- Modify if needed: `src/features/Select/for-manager/**`
- Modify if needed: `src/features/Essay/for-manager/**`
- Modify if needed: `src/features/Paper/for-manager/**`

**Required behavior:**

1. Select manager records 可使用一般 SelectRecord list，因後端允許 EH。
2. Essay manager records 可使用一般 EssayRecord list，因後端允許 EM。
3. Paper manager records 可使用一般 PaperRecord list，因後端允許 EM。
4. 若 API 回 403/404，顯示權限不足/資料不存在訊息，不應空白或 crash。

## 6. Task F4：題目/試卷 public-only UX 檢查

**Objective:** E 使用者看到的題目與試卷列表應符合後端 public-only 行為。

**Files:**

- Modify if needed: `src/features/Select/for-user/**`
- Modify if needed: `src/features/Essay/for-user/**`
- Modify if needed: `src/features/Paper/for-user/**`

**Required behavior:**

- E 使用者頁面應能處理後端只回 public 題目的結果。
- 若篩選後沒有題目，顯示空狀態，而不是 crash。
- 管理端仍可顯示非公開題目/試卷，前提是使用正確管理角色。

## 7. Task F5：錯誤處理與 toast 相容

**Objective:** 後端權限收斂後，前端對 403/404/429/400 顯示清楚訊息。

**Files:**

- Modify if needed: `src/func/toast.ts`
- Modify if needed: feature-level catch blocks in Select / Essay / Paper

**Required behavior:**

- 403：顯示權限不足，請確認帳號權限或重新登入。
- 404：顯示資料不存在或無權查看此資料。
- 429：顯示操作太頻繁，請稍後再試；若後端有 `detail`，保留 detail。
- 400：顯示後端 field errors 或 detail。

注意：`src/func/toast.ts` 在三前端有 shared-looking baseline。若本次修改這個 shared helper，需同步檢查是否影響 `pigeon-hand` / `pigeon-manage` / `pigeon-exam` 的 shared probe；若不想跨 repo，優先只在 `pigeon-exam` feature 層處理。

## 8. Task F6：Result report

OpenCode 必須建立：

- `docs/result/2026-06-12-1443-p1c-exam-record-scope-frontend-frontend-result.md`

Report 必須包含：

1. 後端 result report 已被讀取與契約摘要。
2. `pwd` 與 repo 路徑證據。
3. preflight/final `git status --short --untracked-files=all`。
4. 實際修改檔案清單。
5. 哪些頁面改用 self endpoint，哪些管理頁仍用 generic list。
6. 每個 verification command 的 exit code 與摘要。
7. 若無法做 browser smoke，需列出原因與替代證據。
8. 未完成/blocked 項目，不得以成功口吻帶過。

## 9. Required verification commands

OpenCode 完成後必須至少跑：

```bash
cd /Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam
pnpm exec eslint src/lib/pages.tsx src/features/Select src/features/Essay src/features/Paper src/func/toast.ts src/types/exam-types.ts
pnpm build
git diff --check
```

若 `eslint` 對目錄參數不相容，改用明確 changed files 清單，但 result report 必須列出完整 changed files。

若有 shared frontend probe 可用，Hermes 驗收時會在 parent workspace 嘗試：

```bash
cd /Users/cksai/Desktop/Coding/piegon-hand-projects
python3 pigeon-hand/scripts/probe_frontend_unification.py
```

## 10. Non-goals

- 不修改後端；後端變更應已在 P1-C backend plan 完成。
- 不修改 `pigeon-hand` / `pigeon-manage`，除非 `toast.ts` shared baseline 被更動且使用者另行授權。
- 不改 auth 架構，不做 httpOnly cookie / CSRF / CORS credentials migration。
- 不新增權限定義 codegen。
- 不接 production DB。

## 11. Acceptance criteria

Frontend story 只有在以下條件都滿足時才可接受：

- result report 存在且內容完整。
- 使用者紀錄頁不依賴一般 records list 取得個人資料。
- create/submit payload 不送 owner 欄位。
- 管理頁角色與使用者決策一致：Select records = EH、Essay records = EM、Paper records = EM。
- 403/404/429/400 有可理解的錯誤訊息或既有 centralized formatter 可處理。
- `pnpm build` 通過。
- scoped eslint 針對 changed files 通過，或只剩明確標示的既有 warning。
- `git diff --check` 通過。
