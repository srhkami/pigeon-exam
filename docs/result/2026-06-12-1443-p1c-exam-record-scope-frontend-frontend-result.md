# P1-C Exam Record Scope Frontend Result

## 基本資訊

- Result path: `docs/result/2026-06-12-1443-p1c-exam-record-scope-frontend-frontend-result.md`
- Plan path: `docs/plans/2026-06-12-1443-p1c-exam-record-scope-frontend.md`
- Target repo: `/Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam`
- Runner: OpenCode started the implementation. The first run was blocked by sibling-repo permission while reading the backend report; the retry from the parent workspace applied code changes but stalled before writing this report. Hermes then performed finalization only: inspected the diff, made small lint/type cleanup in the changed files, ran verification, removed temporary prompt files, and wrote this result report.

## Backend dependency contract read

Read: `../pigeon-hand-api/docs/result/2026-06-12-1443-p1c-exam-record-scope-backend-backend-result.md`

Confirmed backend contract summary:

- `SelectRecord`: E generic list/retrieve should be treated as unavailable; E uses `self` / `submit`; EH, AM, superuser can read full records.
- `EssayRecord`: E generic list/retrieve should be treated as unavailable; E uses `self` / `create_for_student`; EM, AM, superuser can read full records.
- `Paper`: E list/retrieve only public papers; private UUID is not a readable entry point for E.
- `PaperRecord`: E reads own records only; EM, AM, superuser can read full records.
- Owner is determined by backend. Frontend should not submit spoofable `user` / `user_id` owner fields.

## pwd / repo evidence

OpenCode retry was launched from parent workspace with `--dir /Users/cksai/Desktop/Coding/piegon-hand-projects` so it could read both `pigeon-exam/**` and the backend result report using repo-relative paths.

Hermes finalization/verification was run from:

```text
/Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam
```

## Preflight git status

OpenCode preflight observed only authorized untracked docs prompt/plan files:

```text
?? docs/plans/2026-06-12-1443-p1c-exam-record-scope-frontend-opencode-prompt.md
?? docs/plans/2026-06-12-1443-p1c-exam-record-scope-frontend-opencode-retry-prompt.md
?? docs/plans/2026-06-12-1443-p1c-exam-record-scope-frontend.md
```

No pre-existing uncommitted source-code changes were present before implementation.

## Changed files

Source changes:

- `src/features/Essay/for-manager/Question/ModalEssayQuestionEdit.tsx`
- `src/features/Essay/for-user/Record/ModalRecordEdit.tsx`
- `src/features/Layout/ErrorLogToast.tsx`
- `src/features/Paper/for-manager/Record/PaperRecordDetail.tsx`
- `src/features/Paper/for-user/Paper.tsx`
- `src/features/Paper/for-user/PaperRecord.tsx`
- `src/features/Select/for-manager/Manage/Edit/ModalSelectEdit.tsx`
- `src/features/Select/for-user/Random/SelectSingle.tsx`
- `src/func/api-error.ts`
- `src/func/form.ts`
- `src/func/index.ts`

Docs:

- `docs/plans/2026-06-12-1443-p1c-exam-record-scope-frontend.md` was the authorized plan file and remains untracked if not yet added.
- Temporary OpenCode prompt files were removed after final verification.
- This result report was created.

## Implementation summary

### Self endpoint / owner-spoofing compatibility

- Existing E user list pages were verified to use self endpoints:
  - `src/features/Select/for-user/Record/SelectRecords.tsx` uses `/select_records/self/`.
  - `src/features/Essay/for-user/Record/EssayRecords.tsx` uses `/essay_records/self/`.
  - `src/features/Paper/for-user/PaperRecords.tsx` uses `/paper_records/self/`.
- `src/features/Paper/for-user/PaperRecord.tsx` no longer fetches `/paper_records/:id/` directly for E user detail. It fetches `/paper_records/self/` and selects the requested record from the self-owned list, showing a readable error if no matching record is available.
- `src/features/Essay/for-user/Record/ModalRecordEdit.tsx` now creates student essay records through `/essay_records/create_for_student/` and no longer sends `user`.
- `src/features/Select/for-user/Random/SelectSingle.tsx` submit payload remains limited to `question_id` and `user_answer`; no owner field is sent.
- `src/features/Paper/for-user/Paper.tsx` paper submit uses `PaperSubmitForm`, whose type contains no `user` / `user_id`; no owner field is sent.
- Manager question creation forms no longer send `user` when creating Select/Essay questions, aligning with backend-owned creator behavior.

### Manager pages / role compatibility

- `src/lib/pages.tsx` did not require modification. Current page-role mapping remains aligned with the user decision and backend contract:
  - Select records = EH.
  - Essay records = EM.
  - Paper records = EM.
- Manager record pages continue to use generic list/detail endpoints where the backend allows the corresponding manager role.

### Error handling

- Added `src/func/api-error.ts` as a centralized API error formatter for this frontend.
- 403 returns: `權限不足，請確認帳號權限或重新登入。`
- 404 returns: `資料不存在或無權查看此資料。`
- 429 returns: `操作太頻繁，請稍後再試。` and preserves backend `detail` when provided.
- 400 flattens backend field/detail messages into readable text.
- Updated changed Select / Essay / Paper paths and `ErrorLogToast` / `showFormError` to use the formatter where relevant.

## Verification commands

### Required full scoped eslint from plan

Command:

```bash
pnpm exec eslint src/lib/pages.tsx src/features/Select src/features/Essay src/features/Paper src/func/toast.ts src/types/exam-types.ts
```

Exit code: `1`

Result: failed only on existing broader-directory lint findings outside this story's changed surface:

- `src/features/Essay/for-manager/tools/ModalEssayFilter.tsx`
- `src/features/Essay/for-user/Random/EssayRandom.tsx`
- `src/features/Essay/for-user/tools/ModalEssayFilter.tsx`
- `src/features/Paper/for-manager/Manage/ModalAddSelectQuestion.tsx`
- `src/features/Paper/for-manager/Manage/PaperEdit.tsx`
- `src/features/Select/for-manager/Manage/ModalSelectFilter.tsx`
- `src/features/Select/for-user/Random/SelectRandom.tsx`

Representative errors are existing `_` unused / `any` / hook dependency warnings in untouched files. Changed files were then checked explicitly.

### Changed-files eslint

Command:

```bash
pnpm exec eslint \
  src/features/Essay/for-manager/Question/ModalEssayQuestionEdit.tsx \
  src/features/Essay/for-user/Record/ModalRecordEdit.tsx \
  src/features/Layout/ErrorLogToast.tsx \
  src/features/Paper/for-manager/Record/PaperRecordDetail.tsx \
  src/features/Paper/for-user/Paper.tsx \
  src/features/Paper/for-user/PaperRecord.tsx \
  src/features/Select/for-manager/Manage/Edit/ModalSelectEdit.tsx \
  src/features/Select/for-user/Random/SelectSingle.tsx \
  src/func/form.ts \
  src/func/index.ts \
  src/func/api-error.ts
```

Exit code: `0`

### Build

Command:

```bash
pnpm build
```

Exit code: `0`

Summary: `tsc -b && vite build` passed. Vite emitted existing bundle-size/eval warnings from dependencies, but build completed successfully.

### Whitespace check

Command:

```bash
git diff --check
```

Exit code: `0`

### Shared frontend probe

Command from parent workspace:

```bash
python3 pigeon-hand/scripts/probe_frontend_unification.py
```

Exit code: `0`

Output:

```text
FRONTEND_UNIFICATION_PROBE_OK
```

## Browser smoke

Browser smoke was not executed in this result because no local authenticated E/EH/EM session and running backend/browser harness were prepared in the plan. Substitute evidence:

- Static endpoint/payload inspection.
- TypeScript build.
- Changed-files eslint.
- Shared frontend probe.

## Final git status

After temporary OpenCode prompt cleanup and before adding/committing files, expected working tree state is:

```text
 M src/features/Essay/for-manager/Question/ModalEssayQuestionEdit.tsx
 M src/features/Essay/for-user/Record/ModalRecordEdit.tsx
 M src/features/Layout/ErrorLogToast.tsx
 M src/features/Paper/for-manager/Record/PaperRecordDetail.tsx
 M src/features/Paper/for-user/Paper.tsx
 M src/features/Paper/for-user/PaperRecord.tsx
 M src/features/Select/for-manager/Manage/Edit/ModalSelectEdit.tsx
 M src/features/Select/for-user/Random/SelectSingle.tsx
 M src/func/form.ts
 M src/func/index.ts
?? docs/plans/2026-06-12-1443-p1c-exam-record-scope-frontend.md
?? docs/result/2026-06-12-1443-p1c-exam-record-scope-frontend-frontend-result.md
?? src/func/api-error.ts
```

## Acceptance decision

Status: `ACCEPTED_WITH_NOTES`

Accepted because:

- Backend contract was read and reflected.
- E record list/detail paths no longer rely on generic list/detail for personal PaperRecord detail; existing Select/Essay/Paper list pages use self endpoints.
- Essay student create now uses `create_for_student` and no longer sends owner.
- Submit/create payloads in the touched student flows do not send `user` / `user_id` owner fields.
- Manager page roles remain aligned: Select records = EH、Essay records = EM、Paper records = EM.
- 403/404/429/400 handling is centralized and applied to touched flows.
- Changed-files eslint, build, `git diff --check`, and shared frontend probe passed.

Notes / remaining risks:

- The plan's broad directory eslint command still fails on pre-existing lint findings in untouched files. This result accepts only the changed-files lint surface plus build.
- No authenticated browser smoke was executed. If needed, run a separate browser smoke with real E/EH/EM sessions after backend/frontend services are started.
- PaperRecord E detail currently fetches `/paper_records/self/` and searches the returned page for the target id. This avoids unsafe generic retrieve, but if pagination hides older records, a backend self-safe detail endpoint or filter-supported self endpoint would be more robust.
