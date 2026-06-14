# P1-C Authenticated Exam Permission Smoke Plan

> **Runner:** Hermes manual browser/API smoke（不是 OpenCode 執行計畫）
> **Result report required:** `docs/result/2026-06-12-1634-p1c-authenticated-exam-permission-smoke-smoke-result.md`
> **Repo:** `/Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam`
> **Backend repo dependency:** `/Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-hand-api`
> **Scope:** no production DB、no external paid provider、no broad DB mutation；只允許本機/測試環境登入與少量可回滾測試資料。

**Goal:** 用真實登入 session 驗證 P1-C backend + `pigeon-exam` frontend 權限收斂後的 E / EH / EM / AM 角色行為，補齊前一份 frontend result 缺少 authenticated browser smoke 的證據。

**Architecture:** 後端 permission/queryset/serializer 是安全邊界；前端頁面權限、endpoint 選擇、payload shape 與錯誤訊息只作為 UX 與契約相容驗證。本 smoke 先做 no-mutation auth preflight，確認可用本機服務與測試帳號後，才建立或操作可回滾的測試資料。

**Tech Stack:** Django/DRF backend、React/Vite frontend、pnpm、Playwright/browser tools 或 Hermes browser、curl/http API probes、PostgreSQL local test DB。

---

## 1. 前置條件與停止條件

### 必須存在的已驗收文件

1. Backend P1-C result：
   - `../pigeon-hand-api/docs/result/2026-06-12-1443-p1c-exam-record-scope-backend-backend-result.md`
2. Frontend P1-C result：
   - `docs/result/2026-06-12-1443-p1c-exam-record-scope-frontend-frontend-result.md`
3. Frontend P1-C commit 已完成：
   - commit message: `修正考試紀錄權限前端流程`

### Auth source gate

本計畫需要可登入的本機測試帳號或短期 token，至少覆蓋：

- E：一般考生
- EH：選擇題管理者
- EM：申論/試卷管理者
- AM 或 superuser：全域管理者

若缺任一角色，仍可做已具備角色的 no-mutation preflight，但不得把缺角色的 smoke 標為通過；result report 必須標記 `BLOCKED_AUTH_SOURCE_INCOMPLETE` 並列出缺少的角色。

### mutation gate

在確認登入有效、API base URL 正確、backend 指向測試 DB 前，不得建立或修改測試資料。

若沒有安全測試 DB 或無法確認環境，停止在 no-mutation preflight，寫 BLOCKED result report。

## 2. Task S0：Preflight 工作樹、服務與環境確認

**Objective:** 確認兩個 repo 狀態、服務啟動方式與測試環境安全性。

**Commands:**

```bash
cd /Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam
git status --short --untracked-files=all
git log -1 --oneline
pnpm --version

cd /Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-hand-api
git status --short --untracked-files=all
git log -1 --oneline
```

**Expected:**

- `pigeon-exam` 除本 plan 外不應有未預期 source change。
- `pigeon-hand-api` 不應有未預期 source change。
- 若有未提交變更，先記錄並判斷是否為本 smoke 必須；不明變更不得被 smoke 覆蓋或自動提交。

## 3. Task S1：啟動或確認本機 backend/frontend 服務

**Objective:** 使用本機/測試環境執行 smoke，不碰 production。

**Backend preferred env:**

```bash
cd /Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-hand-api
export DJANGO_SETTINGS_MODULE=config.settings.development
export DATABASE_URL=postgresql://postgres:postgres_password@localhost:5433/legal_db
```

若 backend 服務未啟動，可用專案既有方式啟動本機 API；若需要另開 terminal/background process，result report 要記錄 pid/session id、URL、健康檢查結果與 cleanup。

**Frontend preferred command:**

```bash
cd /Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam
pnpm dev --host 127.0.0.1
```

**Health checks:**

- frontend URL 可開啟。
- backend API base URL 與 frontend 設定一致。
- browser console 無啟動階段 fatal error。

## 4. Task S2：No-mutation auth preflight

**Objective:** 在不寫 DB 的情況下確認四種角色可登入，並能呼叫安全的 current-user/permission endpoint。

**Steps:**

1. 以 E / EH / EM / AM 或 superuser 分別登入。
2. 只呼叫目前登入資訊、權限資訊、或 read-only profile endpoint。
3. 記錄每個角色的：
   - 帳號代稱（不得寫入密碼/token 原文）
   - role / groups / permission flags
   - auth response status
   - frontend local/session storage key 名稱可記錄，但 token 值要遮蔽
4. 若使用 browser automation，截圖只保留非敏感畫面。

**Acceptance:**

- 四種角色皆能取得有效登入狀態。
- token/secret 不得出現在 result report、artifact 或 git diff。
- 若任何角色登入失敗，停止該角色後續 mutation/browser smoke，result report 標記 blocker。

## 5. Task S3：E 考生個人紀錄與 owner-spoofing smoke

**Objective:** 驗證 E 只能看自己的紀錄，且 submit/create 不送 `user` / `user_id`。

**Browser/API checks:**

1. E 開啟選擇題作答/紀錄頁。
   - Network 應使用 `/select_records/self/` 讀個人紀錄。
   - 提交選擇題答案時 payload 只允許 `question_id`、`user_answer` 等必要欄位，不得有 `user` / `user_id`。
2. E 開啟申論題作答/紀錄頁。
   - Network 應使用 `/essay_records/self/`。
   - 建立學生申論紀錄應打 `/essay_records/create_for_student/`，payload 不得有 owner 欄位。
3. E 開啟試卷作答/紀錄頁。
   - Network 應使用 `/paper_records/self/`。
   - 試卷提交 payload 不得有 owner 欄位。
4. 嘗試以 E 直接呼叫 generic records list/detail。
   - SelectRecord generic list/retrieve 應被拒絕或不可用。
   - EssayRecord generic list/retrieve 應被拒絕或不可用。
   - PaperRecord generic detail 若不是 own-safe endpoint，E 不應透過前端依賴它。

**Expected UI behavior:**

- 無權或不存在資料時，前端顯示可理解錯誤：
  - 403：權限不足，請確認帳號權限或重新登入。
  - 404：資料不存在或無權查看此資料。
- 不應 blank page 或 uncaught runtime error。

## 6. Task S4：EH 管理者 smoke

**Objective:** 驗證 EH 只具備選擇題紀錄管理能力，不誤開申論/試卷紀錄管理入口。

**Checks:**

1. EH 登入後，可進入 Select records 管理頁。
2. Select records list/detail API 回 2xx，且畫面能顯示資料或空狀態。
3. EH 不應看到 Essay records / Paper records 管理入口；若直接輸入 URL，應由前端擋下或後端回 403。
4. 403 時錯誤訊息可讀，不 crash。

**Acceptance:**

- Select records = EH 可用。
- Essay/Paper records 未被 EH 誤授權。

## 7. Task S5：EM 管理者 smoke

**Objective:** 驗證 EM 具備申論/試卷紀錄管理能力，但不取代 EH 的選擇題紀錄管理權限。

**Checks:**

1. EM 登入後，可進入 Essay records 管理頁。
2. EM 登入後，可進入 Paper records 管理頁。
3. Essay/Paper records list/detail API 回 2xx，畫面能顯示資料或空狀態。
4. EM 不應因本次修正被視為 Select records 管理者；若直接輸入 Select records 管理 URL，應由前端擋下或後端回 403。

**Acceptance:**

- Essay records = EM 可用。
- Paper records = EM 可用。
- Select records 不被 EM 誤授權。

## 8. Task S6：AM / superuser 全域管理 smoke

**Objective:** 驗證 AM 或 superuser 能查閱三類紀錄管理頁。

**Checks:**

1. AM/superuser 可開 Select records 管理頁。
2. AM/superuser 可開 Essay records 管理頁。
3. AM/superuser 可開 Paper records 管理頁。
4. 三類 list/detail API 回 2xx 或合理空狀態。

**Acceptance:**

- 全域管理角色不因 P1-C 收斂被誤擋。

## 9. Task S7：PaperRecord self detail pagination 風險確認

**Objective:** 驗證目前 frontend 用 `/paper_records/self/` 後在回傳頁面中尋找 id 的 workaround 是否會受 pagination 影響。

**Checks:**

1. 檢查 `/paper_records/self/` 是否分頁。
2. 若分頁，確認 PaperRecord detail 頁面打開舊紀錄時是否可能找不到。
3. 不在本 smoke 直接改 code；只輸出決策建議：
   - 若無分頁或目前資料量安全：標記為 `ACCEPTED_WITH_RISK`。
   - 若有明確分頁風險：建議下一份 P1-D backend + frontend plan 補 self-safe detail endpoint。

**Acceptance:**

- result report 必須明確回答是否需要 P1-D。

## 10. Task S8：Cleanup / rollback

**Objective:** 清理 smoke 建立的測試資料與 process，避免污染後續驗證。

**Required:**

1. 若本 smoke 建立任何測試作答紀錄，記錄其 id。
2. smoke 結束後刪除或 rollback 這些測試資料。
3. fresh-query 確認測試資料不殘留，或明確標記保留原因。
4. 關閉本 smoke 啟動的 backend/frontend process。

## 11. Task S9：Result report

Hermes 必須建立：

- `docs/result/2026-06-12-1634-p1c-authenticated-exam-permission-smoke-smoke-result.md`

Report 必須包含：

1. 執行時間、runner、repo path、服務 URL。
2. preflight/final `git status --short --untracked-files=all`。
3. Auth source 狀態與每個角色是否可登入；不得記錄 token/password 原文。
4. E / EH / EM / AM 每個角色的 browser/API evidence 摘要。
5. Network/payload 檢查摘要，特別是 owner 欄位是否不存在。
6. 403/404/429/400 錯誤訊息檢查。
7. PaperRecord self detail pagination 風險判斷。
8. 測試資料 cleanup/rollback 證據。
9. verification commands exit code。
10. Acceptance decision：`ACCEPTED` / `ACCEPTED_WITH_RISK` / `BLOCKED_AUTH_SOURCE_INCOMPLETE` / `BLOCKED_ENVIRONMENT_UNSAFE` / `FAILED_PERMISSION_REGRESSION`。

## 12. Required verification commands

Smoke 後至少執行：

```bash
cd /Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam
pnpm exec eslint src/features/Essay/for-manager/Question/ModalEssayQuestionEdit.tsx src/features/Essay/for-user/Record/ModalRecordEdit.tsx src/features/Layout/ErrorLogToast.tsx src/features/Paper/for-manager/Record/PaperRecordDetail.tsx src/features/Paper/for-user/Paper.tsx src/features/Paper/for-user/PaperRecord.tsx src/features/Select/for-manager/Manage/Edit/ModalSelectEdit.tsx src/features/Select/for-user/Random/SelectSingle.tsx src/func/form.ts src/func/index.ts src/func/api-error.ts
pnpm build
git diff --check
```

若服務或 browser smoke 需要暫存 artifact，所有 artifact 必須放在 repo-local `docs/result/` 或 `docs/artifacts/`，不得放 `/tmp` 作為唯一證據來源。

## 13. Non-goals

- 不修改 application code；若 smoke 發現 bug，先寫 result report 與下一份 remediation plan。
- 不使用 OpenCode 執行本 smoke。
- 不連 production DB。
- 不呼叫外部 paid provider / LLM。
- 不改 auth 架構，不做 httpOnly cookie / CSRF / CORS credentials migration。
- 不把前端 route guard 當作安全邊界；後端才是最終權限依據。

## 14. 後續決策

若本 smoke 通過但 `PaperRecord` self detail 存在 pagination 風險，下一步建議建立 P1-D full-stack plan：

1. Backend：新增 self-safe PaperRecord detail endpoint 或 self endpoint id filter。
2. Backend tests：E 只能讀自己的 record；不能讀他人；EM/AM/superuser generic detail 保持可用。
3. Frontend：`PaperRecord.tsx` 改用正式 endpoint，不再依賴 self list 搜尋。
4. Verification：backend targeted tests + frontend changed-files eslint/build + authenticated smoke rerun。
