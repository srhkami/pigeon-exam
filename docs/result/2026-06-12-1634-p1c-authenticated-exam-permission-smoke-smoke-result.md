# P1-C Authenticated Exam Permission Smoke Result

> Runner: Hermes manual API/static/browser-adjacent smoke
> Plan: `docs/plans/2026-06-12-1634-p1c-authenticated-exam-permission-smoke.md`
> Artifact: `docs/artifacts/2026-06-12-1634-p1c-authenticated-exam-permission-smoke-api.json`
> Acceptance decision: `FAILED_PERMISSION_REGRESSION`

## 1. 執行摘要

本次已在本機 `pigeon-hand-api` Docker backend（`http://127.0.0.1:8000`）與 `pigeon-exam` frontend dev server（`http://127.0.0.1:5173`）完成 P1-C authenticated API/static smoke。

主要結論：

1. E / EH / EM / AM 四種角色都能以本機臨時 smoke 帳號登入並通過 `/user/token/verify/`。
2. 後端 record scope 的核心權限收斂大致符合 P1-C：
   - E 只能透過 self endpoints 看到自己的 Select / Essay / Paper records。
   - EH 可看 SelectRecord 管理資料。
   - EM 可看 EssayRecord / PaperRecord 管理資料。
   - AM 可看三類 record 管理資料。
   - owner spoofing payload 不會改變後端 owner，後端以 `request.user` / JWT user 為準。
3. Cleanup 已執行，smoke marker 殘留為 0。
4. 但發現一個前後端契約不一致，足以阻擋本 smoke 驗收：
   - `pigeon-exam/src/features/Essay/for-user/Record/ModalRecordEdit.tsx` 送出學生申論答案時使用 `/exam/essay_records/create_for_student/`。
   - live backend 對此 path 的 POST 回 `405`。
   - backend 目前可用且測試覆蓋的學生申論建立 endpoint 是 `/exam/essay_records/create/`。
   - 因此前端 E 使用者新增申論答案會失敗，需修正後再重跑 authenticated smoke。

## 2. Preflight / 環境

### pigeon-exam

- 最新 commit：`986a4ec 修正考試紀錄權限前端流程`
- pre/final working tree：
  - `?? docs/plans/2026-06-12-1634-p1c-authenticated-exam-permission-smoke.md`
  - `?? docs/artifacts/2026-06-12-1634-p1c-authenticated-exam-permission-smoke-api.json`
  - `?? docs/result/2026-06-12-1634-p1c-authenticated-exam-permission-smoke-smoke-result.md`

### pigeon-hand-api

- 最新 commit：`a1ee678 修正權限與安全設定`
- working tree 在本 smoke 前後都有既有 P1-C backend 變更與 plan/result 文件，未由本 smoke 修改 application code。
- 已觀察狀態：
  - `M core/exam/essay/serializer.py`
  - `M core/exam/essay/views.py`
  - `M core/exam/general.py`
  - `M core/exam/paper/views.py`
  - `M core/exam/select/serializer.py`
  - `M core/exam/select/views.py`
  - `M core/exam/tests.py`
  - `M core/user/auth.py`
  - `?? docs/plans/2026-06-12-1443-p1c-exam-record-scope-backend.md`
  - `?? docs/result/2026-06-12-1443-p1c-exam-record-scope-backend-backend-result.md`

### 服務

- Backend：既有 Docker service 監聽 `127.0.0.1:8000`，Django `DEBUG=True`，DB host 為本機 Docker DB。
- Frontend：本 smoke 啟動 `pnpm dev --host 127.0.0.1`，健康檢查 `http://127.0.0.1:5173/` 回 200；smoke 結束後已 kill Hermes 啟動的 frontend process。
- Backend runserver 嘗試啟動時因 8000 已被既有 Docker service 使用而退出；未保留額外 backend process。

## 3. Auth source 狀態

本次使用本機 DEBUG DB 建立短期 smoke users，完成後刪除。result/artifact 沒有保存 token、password 原文。

角色登入結果：

| 角色 | 登入 | token verify | 備註 |
|---|---:|---:|---|
| E | pass | pass | 一般考生 |
| EH | pass | pass | 選擇題管理 |
| EM | pass | pass | 申論/試卷管理 |
| AM | pass | pass | 全域管理 |

## 4. API / 權限 smoke 摘要

### E 一般考生

通過項目：

- `/exam/select_records/self/` 只回自己的 SelectRecord。
- `/exam/select_records/` 回 200 但 total_count=0，未暴露其他使用者 records。
- `/exam/select_records/<other_id>/` 回 404。
- `/exam/essay_records/self/` 只回自己的 EssayRecord。
- `/exam/essay_records/` 回 200 但 total_count=0，未暴露其他使用者 records。
- `/exam/essay_records/<other_id>/` 回 404。
- `/exam/paper_records/self/` 只回自己的 PaperRecord。
- `/exam/paper_records/<own_id>/` 後端目前允許 own detail 回 200；前端未依賴此 generic detail。
- `/exam/paper_records/<other_id>/` 回 404。
- `/v2/exam/select/submit/single` 即使 payload 夾帶 `user` / `user_id`，DB owner 仍是 request user。
- `/exam/essay_records/create/` 即使 payload 夾帶 `user` / `user_id`，DB owner 仍是 request user。

失敗項目：

- 前端目前使用 `/exam/essay_records/create_for_student/`，live backend POST 回 405。
- 此問題會讓 E 使用者在前端新增申論題回答時失敗。

### EH 管理者

通過項目：

- `/exam/select_records/` 回 200 且可看到 SelectRecord 管理資料。
- `/exam/paper_records/` 回 403，符合 EH 不應管理 PaperRecord 的方向。

補充：artifact 中 `EH_essay_records_list_denied_empty` 被記為 `ok=false`，原因是 smoke script 原先期待 200 empty；依 plan 第 6 節，直接輸入 URL 由前端擋下或後端回 403 皆可接受，因此這列應視為期待校準問題，不是權限 regression。

### EM 管理者

通過項目：

- `/exam/essay_records/` 回 200 且可看到 EssayRecord 管理資料。
- `/exam/paper_records/` 回 200 且可看到 PaperRecord 管理資料。

補充：artifact 中 `EM_select_records_list_denied_empty` 被記為 `ok=false`，原因是 smoke script 原先期待 200 empty；依 plan 第 7 節，直接輸入 Select records 管理 URL 由前端擋下或後端回 403 皆可接受，因此這列應視為期待校準問題，不是權限 regression。

### AM 管理者

通過項目：

- `/exam/select_records/` 回 200。
- `/exam/essay_records/` 回 200。
- `/exam/paper_records/` 回 200。

## 5. Frontend static/network contract 檢查

通過：

- `SelectSingle.tsx` 使用 V2 select submit payload：`question_id`、`user_answer`，未送 `user` / `user_id`。
- `ModalRecordEdit.tsx` 新增申論答案 payload 包含 `question_id`，未送 `user` / `user_id`。
- 使用者紀錄列表使用 self endpoints：
  - `/select_records/self/`
  - `/essay_records/self/`
  - `/paper_records/self/`
- `PaperRecord.tsx` detail workaround 使用 `/paper_records/self/` 並帶 `params: { id }`。

失敗：

- `ModalRecordEdit.tsx` 使用 `/exam/essay_records/create_for_student/`；backend live path 不接受 POST。
- 需要二選一修正：
  1. 前端改用 backend 現有 `/exam/essay_records/create/`；或
  2. 後端新增/保留 `/exam/essay_records/create_for_student/` alias，並補測試。

建議優先採用前端改 path，因為 backend tests 目前已明確覆蓋 `/exam/essay_records/create/`。

## 6. 錯誤 shape 檢查

- 403：`/exam/paper_records/` with EH 回 403，JSON body 可解析。
- 404：E 讀 other SelectRecord detail 回 404，JSON body 可解析。
- 400：E 呼叫 EssayRecord create 缺 `question_id` 回 400，JSON body 可解析。

## 7. PaperRecord self detail pagination 風險

Probe：`/exam/paper_records/self/?page_size=1`

- status：200
- result_count：1
- total_count：1
- next：false
- 本次 smoke 資料下未重現 pagination miss。

判斷：仍建議保留 P1-D 風險項，因為 frontend detail 目前靠 `/paper_records/self/` page results 再找 id；資料量變大或預設分頁時，舊紀錄仍可能不在第一頁。後續可規劃 self-safe detail endpoint，例如 `/paper_records/self/<id>/` 或 `/paper_records/self/?id=<id>` 的正式後端契約。

## 8. Cleanup / rollback

Smoke artifact 顯示 cleanup 成功：

- deleted users：5
- deleted select_questions：2
- deleted select_records：3
- deleted essay_questions：1
- deleted essay_records：3
- deleted paper_records：6（包含關聯刪除影響）
- residual users：0
- residual select_questions：0
- residual essay_questions：0
- residual paper_records：0
- cleanup errors：0

## 9. Verification commands

### pigeon-exam required commands

Command:

```bash
pnpm exec eslint src/features/Essay/for-manager/Question/ModalEssayQuestionEdit.tsx src/features/Essay/for-user/Record/ModalRecordEdit.tsx src/features/Layout/ErrorLogToast.tsx src/features/Paper/for-manager/Record/PaperRecordDetail.tsx src/features/Paper/for-user/Paper.tsx src/features/Paper/for-user/PaperRecord.tsx src/features/Select/for-manager/Manage/Edit/ModalSelectEdit.tsx src/features/Select/for-user/Random/SelectSingle.tsx src/func/form.ts src/func/index.ts src/func/api-error.ts
pnpm build
git diff --check
```

Result: exit 0.

Notes:

- `pnpm build` 成功。
- Vite 顯示既有 chunk size warning 與 `pdfjs-dist` eval warning；非本次 smoke 新增錯誤。

### pigeon-hand-api targeted backend tests

第一次誤用不存在的 test class name，得到 `AttributeError: module 'exam.tests' has no attribute 'ExamPermissionScopeTests'`。

修正後執行：

```bash
set -a; . ../.env; set +a; SQL_HOST=127.0.0.1 SQL_PORT=5432 uv run python manage.py test exam.tests.PaperRecordPermissionTestCase exam.tests.ExamScopePermissionTestCase -v 2
```

Result: exit 0, 8 tests ran, OK.

## 10. Acceptance decision

`FAILED_PERMISSION_REGRESSION`

阻擋原因只有一項：frontend `ModalRecordEdit.tsx` 使用的學生申論新增 endpoint 與 backend live/API/tests 不一致。

必修修正：

- `pigeon-exam/src/features/Essay/for-user/Record/ModalRecordEdit.tsx`
- 將新增申論答案 endpoint 從 `/essay_records/create_for_student/` 改為 `/essay_records/create/`，或後端新增 alias 並補測試。

建議下一步：先寫一份很小的 P1-C follow-up remediation plan，交由 OpenCode 或由 Hermes 在取得授權後直接修 frontend single-line endpoint，再重跑本 smoke 的 API/static + scoped frontend verification。
