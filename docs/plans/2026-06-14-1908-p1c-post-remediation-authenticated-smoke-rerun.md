# P1-C Post-Remediation Authenticated Smoke Rerun Plan

> **Runner:** Hermes manual API/static smoke（不是 OpenCode 執行計畫）
> **Repo:** `/Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam`
> **Backend dependency:** `/Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-hand-api`
> **Result report required:** `docs/result/2026-06-14-1908-p1c-post-remediation-authenticated-smoke-rerun-smoke-result.md`
> **Machine artifact required:** `docs/artifacts/2026-06-14-1908-p1c-post-remediation-authenticated-smoke-rerun-api.json`
> **Scope:** no production DB、no external paid provider、no broad DB mutation；只允許本機 DEBUG/test-like DB 的短期 smoke users/rows，且必須 cleanup residual=0。

## Goal

在 `ModalRecordEdit.tsx` 已改用 `/essay_records/create/` 後，重跑 P1-C authenticated API/static smoke，確認前一次唯一 blocker（學生申論新增 endpoint mismatch）已解除，並更新 acceptance decision。

## Current verified state

已驗收的 remediation result：

- `docs/result/2026-06-12-1655-p1c-essay-create-endpoint-contract-remediation-frontend-result.md`
- OpenCode 修改：`src/features/Essay/for-user/Record/ModalRecordEdit.tsx`
- Hermes post-verification：
  - `create_for_student` absent
  - `/essay_records/create/` present
  - `question_id` present
  - no `user:` / `user_id`
  - scoped eslint exit 0
  - `pnpm build` exit 0
  - `git diff --check` exit 0

前次 failed smoke：

- `docs/result/2026-06-12-1634-p1c-authenticated-exam-permission-smoke-smoke-result.md`
- 只有 frontend endpoint mismatch 是實際 blocker。
- EH essay-management 403 與 EM select-management 403 依原 plan 屬可接受 deny，不應在本輪再誤判為 regression。

## Acceptance decision rules

本輪 result 的 `acceptance_decision` 只能是以下之一：

1. `ACCEPTED`
   - endpoint mismatch 已解除；
   - E/EH/EM/AM API/static permission checks 全部符合預期；
   - cleanup residual=0；
   - no PaperRecord self-detail pagination risk observed in bounded probe。

2. `ACCEPTED_WITH_RISK`
   - 權限與 endpoint mismatch 均通過；
   - cleanup residual=0；
   - 但 PaperRecord self detail 仍保留 pagination/design risk，需要另開 P1-D。

3. `FAILED_PERMISSION_REGRESSION`
   - 任何權限越權、owner spoofing 成功、frontend endpoint/payload contract 仍錯、或 E 使用者 create/submit 仍失敗。

4. `BLOCKED_ENVIRONMENT_UNSAFE`
   - 無法確認 local DEBUG/test-like DB，或服務指向疑似正式環境。

5. `BLOCKED_AUTH_SOURCE_INCOMPLETE`
   - 無法建立/登入 E、EH、EM、AM 四種 smoke role。

## Important expectation calibration

本輪要修正前次 artifact 的判斷邏輯：

- EH 對 `/exam/essay_records/` 回 403：可接受，因 EH 不應管理 EssayRecord。
- EM 對 `/exam/select_records/` 回 403：可接受，因 EM 不應管理 SelectRecord。
- 不要把「可接受 deny」計入 `errors`。

真正必驗項：

- E 新增申論紀錄要使用 `/exam/essay_records/create/` 且成功建立 owner=request user。
- Frontend static contract 必須證明 `ModalRecordEdit.tsx` 沒有 `create_for_student`。

## Task S0 — Preflight: repo state and service provenance

**Objective:** 確認目前工作樹、服務、工具狀態，不覆蓋既有變更。

Run in `pigeon-exam`:

```bash
git status --short --untracked-files=all
git log -1 --oneline
pnpm --version
```

Run in `pigeon-hand-api`:

```bash
git status --short --untracked-files=all
git log -1 --oneline
```

Check services:

```bash
lsof -nP -iTCP:8000 -sTCP:LISTEN || true
lsof -nP -iTCP:5173 -sTCP:LISTEN || true
curl -sS -o /tmp/p1c_backend_health.txt -w '%{http_code}\n' http://127.0.0.1:8000/user/token/verify/ -X POST || true
curl -sS -o /tmp/p1c_frontend_health.html -w '%{http_code}\n' http://127.0.0.1:5173/ || true
```

If frontend is not running, start it with Hermes background process:

```bash
cd /Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam
pnpm dev --host 127.0.0.1
```

Record any process session id and cleanup it in S8.

## Task S1 — Environment safety gate before mutation

**Objective:** Before creating smoke rows, prove backend script context points to local DEBUG/test-like DB.

Run Django probe from `pigeon-hand-api/core` using project `.env` and localhost Docker DB override used by prior successful smoke:

```bash
set -a; . ../.env; set +a; SQL_HOST=127.0.0.1 SQL_PORT=5432 uv run python - <<'PY'
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pigeon_hand.settings')
import django; django.setup()
from django.conf import settings
print('DEBUG=', settings.DEBUG)
d=settings.DATABASES['default']
print('DB=', d.get('HOST'), d.get('PORT'), d.get('NAME'))
PY
```

Acceptance:

- `DEBUG=True`
- DB host is `127.0.0.1` or `localhost`
- DB name is local/test-like project DB
- If unsafe, stop and write blocked report without creating users/rows.

## Task S2 — Auth preflight with temporary smoke roles

**Objective:** Create short-lived local smoke users for E/EH/EM/AM and verify login/token without persisting secrets.

Use marker:

```text
p1c_rerun_smoke_20260614_1908
```

Roles:

- E: 일반考生
- EH: 選擇題管理
- EM: 申論/試卷管理
- AM: 全域管理
- OTHER_E: cross-owner negative control

Rules:

- Generate random password in memory only.
- Do not write password/token to result or artifact.
- Store only account aliases and response status/body keys.
- If any role login or `/user/token/verify/` fails, stop mutation checks and cleanup.

## Task S3 — Seed minimal smoke data

**Objective:** Create the smallest rows required for permission tests.

Create:

- 1 public SelectQuestion owned by EH
- 1 private SelectQuestion owned by EH
- 1 public EssayQuestion owned by EH or EM-compatible user
- 1 SelectRecord for E
- 1 SelectRecord for OTHER_E
- 1 EssayRecord for E
- 1 EssayRecord for OTHER_E
- 1 PaperRecord for E, linked to E records
- 1 PaperRecord for OTHER_E, linked to OTHER_E records

Record created IDs in JSON artifact only; cleanup all ids in `finally`.

## Task S4 — E role permission and owner-spoofing checks

**Objective:** Verify E can only access own records and cannot spoof owner.

API checks with E token:

- `GET /exam/select_records/self/`
  - status 200
  - contains E record
  - excludes OTHER_E record
- `GET /exam/select_records/`
  - status 200 with `total_count=0`, or backend-deny if implementation intentionally chooses deny
  - must not expose OTHER_E record
- `GET /exam/select_records/<other_id>/`
  - 404 or 403 acceptable; must not return data
- `GET /exam/essay_records/self/`
  - status 200
  - contains E record
  - excludes OTHER_E record
- `GET /exam/essay_records/`
  - status 200 with `total_count=0`, or backend-deny if implementation intentionally chooses deny
  - must not expose OTHER_E record
- `GET /exam/essay_records/<other_id>/`
  - 404 or 403 acceptable; must not return data
- `GET /exam/paper_records/self/`
  - status 200
  - contains E record
  - excludes OTHER_E record
- `GET /exam/paper_records/<other_id>/`
  - 404 or 403 acceptable; must not return data

Owner spoofing:

- POST `/v2/exam/select/submit/single` with extra `user` and `user_id=OTHER_E.id`
  - expected status 200
  - DB owner must be E
- POST `/exam/essay_records/create/` with extra `user` and `user_id=OTHER_E.id`
  - expected status 201
  - DB owner must be E

Stale endpoint regression probe:

- POST `/exam/essay_records/create_for_student/`
  - This may still return 405 if backend has no alias; do not treat as regression by itself.
  - The acceptance criterion is that frontend no longer calls it.

## Task S5 — Role matrix checks for EH / EM / AM

**Objective:** Verify manager role scoping without misclassifying acceptable denies.

EH:

- `GET /exam/select_records/` => 200, can list SelectRecord management data.
- `GET /exam/essay_records/` => 403 OR 200-empty both acceptable; must not expose records.
- `GET /exam/paper_records/` => 403 OR 200-empty both acceptable; must not expose records.

EM:

- `GET /exam/essay_records/` => 200, can list EssayRecord management data.
- `GET /exam/paper_records/` => 200, can list PaperRecord management data.
- `GET /exam/select_records/` => 403 OR 200-empty both acceptable; must not expose records.

AM:

- `GET /exam/select_records/` => 200
- `GET /exam/essay_records/` => 200
- `GET /exam/paper_records/` => 200

For each check, record status, total_count/result_count, and whether it is accepted under the role policy.

## Task S6 — Frontend static contract checks

**Objective:** Verify user-facing frontend call sites match backend-safe endpoints and payloads.

Check source files:

- `src/features/Select/for-user/Random/SelectSingle.tsx`
- `src/features/Essay/for-user/Record/ModalRecordEdit.tsx`
- `src/features/Paper/for-user/PaperRecord.tsx`
- `src/features/Paper/for-user/PaperRecords.tsx`
- `src/features/Essay/for-user/Record/EssayRecords.tsx`
- `src/features/Select/for-user/Record/SelectRecords.tsx`

Acceptance:

- `ModalRecordEdit.tsx` contains `/essay_records/create/`.
- `ModalRecordEdit.tsx` does not contain `create_for_student`.
- Create payload contains `question_id`.
- User create/submit payloads do not contain `user:` or `user_id`.
- User record lists use self endpoints:
  - `/select_records/self/`
  - `/essay_records/self/`
  - `/paper_records/self/`
- `PaperRecord.tsx` detail workaround still uses `/paper_records/self/` plus id filtering; record this as P1-D risk if no self-detail endpoint exists.

## Task S7 — Error-shape and pagination-risk probes

**Objective:** Confirm frontend-compatible errors and whether PaperRecord self detail remains a follow-up risk.

Error shape:

- 403 sample: EH calling `/exam/paper_records/` if denied.
- 404 sample: E calling other user's SelectRecord detail.
- 400 sample: E calling `/exam/essay_records/create/` without `question_id`.

Acceptance:

- JSON body can be parsed.
- Error shape works with frontend `getApiErrorMessage` expectations.

Pagination risk:

- `GET /exam/paper_records/self/?page_size=1`
- If `next=true` and target record may be off first page, mark `paper_self_detail_pagination_risk=true` and recommend P1-D.
- If not observed, still state the design risk if frontend lacks a self-safe detail endpoint.

## Task S8 — Cleanup and residual verification

**Objective:** Remove all smoke rows and stop only processes started by this smoke.

Required cleanup:

- Delete created PaperRecord rows.
- Delete created EssayRecord rows.
- Delete created SelectRecord rows.
- Delete created Paper rows if any.
- Delete created EssayQuestion rows.
- Delete created SelectQuestion rows.
- Delete created smoke users.
- Fresh-query residual marker counts:
  - users
  - select_questions
  - essay_questions
  - paper_records
- All residuals must be 0 for acceptance.

## Task S9 — Verification commands

Run frontend checks in `pigeon-exam`:

```bash
pnpm exec eslint src/features/Essay/for-manager/Question/ModalEssayQuestionEdit.tsx src/features/Essay/for-user/Record/ModalRecordEdit.tsx src/features/Layout/ErrorLogToast.tsx src/features/Paper/for-manager/Record/PaperRecordDetail.tsx src/features/Paper/for-user/Paper.tsx src/features/Paper/for-user/PaperRecord.tsx src/features/Select/for-manager/Manage/Edit/ModalSelectEdit.tsx src/features/Select/for-user/Random/SelectSingle.tsx src/func/form.ts src/func/index.ts src/func/api-error.ts
pnpm build
git diff --check
```

Run backend targeted tests in `pigeon-hand-api/core`:

```bash
set -a; . ../.env; set +a; SQL_HOST=127.0.0.1 SQL_PORT=5432 uv run python manage.py test exam.tests.PaperRecordPermissionTestCase exam.tests.ExamScopePermissionTestCase -v 2
```

If backend test class names differ, search `core/exam/tests.py` and rerun with actual class names; do not leave an AttributeError as final evidence.

## Task S10 — Write result report and artifact

Write machine artifact:

- `docs/artifacts/2026-06-14-1908-p1c-post-remediation-authenticated-smoke-rerun-api.json`

Minimum JSON fields:

- `run_id`
- `executed_at`
- `runner`
- `base_url`
- `auth_source`
- `created_ids`
- `checks[]`
- `error_count`
- `errors[]`
- `cleanup`
- `paper_self_detail_pagination_risk`
- `acceptance_decision`

Write human report:

- `docs/result/2026-06-14-1908-p1c-post-remediation-authenticated-smoke-rerun-smoke-result.md`

Report must include:

- preflight/service provenance
- auth role table
- E/EH/EM/AM role matrix summary
- owner-spoofing result
- frontend static contract result
- stale endpoint blocker status
- PaperRecord self-detail risk decision
- cleanup residual counts
- exact verification commands and exit codes
- final acceptance decision
- recommended next step:
  - if accepted: commit/PR packaging or P1-D self-detail endpoint plan
  - if accepted with risk: P1-D planning for PaperRecord self-safe detail
  - if failed/blocked: exact remediation plan needed

## Non-goals

- Do not implement P1-D in this smoke.
- Do not change backend or frontend source code during smoke unless the result itself is a separate user-authorized remediation.
- Do not call paid providers.
- Do not touch production DB.
- Do not persist credentials/tokens/passwords in docs/artifacts.
