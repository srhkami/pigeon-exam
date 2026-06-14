# P1-C Essay Create Endpoint Contract Remediation Plan

> Runner: OpenCode（或使用者授權後 Hermes direct single-file fix）
> Repo: `/Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam`
> Result report required: `docs/result/2026-06-12-1655-p1c-essay-create-endpoint-contract-remediation-frontend-result.md`
> Related failed smoke: `docs/result/2026-06-12-1634-p1c-authenticated-exam-permission-smoke-smoke-result.md`

## Goal

修正 P1-C authenticated smoke 發現的前後端契約不一致：

- Frontend currently calls: `/exam/essay_records/create_for_student/`
- Live/backend-tested endpoint is: `/exam/essay_records/create/`
- Live POST to `/exam/essay_records/create_for_student/` returns 405.

修正後，E 使用者新增申論題回答應能透過 backend student-safe create action 成功送出，且 payload 不得包含 `user` / `user_id` owner 欄位。

## Verified current state

From smoke result:

- `ModalRecordEdit.tsx` uses `EXAM_API + '/essay_records/create_for_student/'`.
- Backend API smoke proved `/exam/essay_records/create/` accepts E student create and ignores spoofed owner fields by using `request.user`.
- Backend targeted tests pass:
  - `exam.tests.PaperRecordPermissionTestCase`
  - `exam.tests.ExamScopePermissionTestCase`
- Frontend scoped eslint/build/diff-check pass before remediation.

## Scope

### In scope

1. Update `src/features/Essay/for-user/Record/ModalRecordEdit.tsx` new-record POST path to backend-supported endpoint:
   - from `/essay_records/create_for_student/`
   - to `/essay_records/create/`
2. Preserve payload shape:
   - keep `question_id`
   - keep form fields `content`, `is_public`, `is_anonymous`
   - do not add `user` or `user_id`
3. Run targeted frontend verification.
4. Write result report.

### Out of scope

- Do not modify backend code unless the implementer explicitly decides frontend path change is impossible and asks for separate approval.
- Do not change auth architecture.
- Do not touch production DB.
- Do not call paid providers.
- Do not broaden lint cleanup.

## Implementation tasks

### T1. Inspect exact call site

Read:

```bash
sed -n '35,65p' src/features/Essay/for-user/Record/ModalRecordEdit.tsx
```

Confirm only the create branch uses the stale path.

### T2. Apply minimal frontend fix

Change:

```ts
url: EXAM_API + '/essay_records/create_for_student/',
```

to:

```ts
url: EXAM_API + '/essay_records/create/',
```

Do not change payload owner semantics.

### T3. Static contract verification

Run a grep/check equivalent proving:

- `ModalRecordEdit.tsx` no longer contains `create_for_student`.
- `ModalRecordEdit.tsx` contains `/essay_records/create/`.
- create payload still contains `question_id`.
- create payload still does not contain `user:` or `user_id`.

### T4. Frontend verification commands

Run:

```bash
pnpm exec eslint src/features/Essay/for-user/Record/ModalRecordEdit.tsx src/func/api-error.ts src/func/index.ts
pnpm build
git diff --check
```

### T5. Optional quick live API confirmation

If local backend is still available at `http://127.0.0.1:8000`, do not create new long-lived data. It is enough to state that the previous smoke already proved `/exam/essay_records/create/` works with E role and ignores spoofed owner fields.

If doing a live re-smoke, use only the existing smoke pattern with marker cleanup and write artifacts under `docs/artifacts/`; never persist tokens/passwords.

## Acceptance criteria

- `ModalRecordEdit.tsx` calls `/essay_records/create/` for student create.
- No owner field is sent from frontend create payload.
- Scoped eslint exits 0.
- `pnpm build` exits 0.
- `git diff --check` exits 0.
- Result report exists at:
  - `docs/result/2026-06-12-1655-p1c-essay-create-endpoint-contract-remediation-frontend-result.md`
- Result report must include:
  - changed files
  - exact verification command outputs / exit codes
  - whether the failed smoke blocker is considered fixed
  - any remaining follow-up, especially whether to rerun full `2026-06-12-1634` smoke

## Recommended post-fix step

After this remediation is accepted, rerun the authenticated smoke plan or at minimum rerun the same API/static artifact generation and update the smoke result to `ACCEPTED` or `ACCEPTED_WITH_RISK` depending on PaperRecord self-detail pagination findings.
