# P1-C Essay Create Endpoint Contract Remediation Frontend Result

> Runner: OpenCode
> Plan: `docs/plans/2026-06-12-1655-p1c-essay-create-endpoint-contract-remediation.md`
> Result: `ACCEPTED`

## Changed Files

- `src/features/Essay/for-user/Record/ModalRecordEdit.tsx`
- `docs/result/2026-06-12-1655-p1c-essay-create-endpoint-contract-remediation-frontend-result.md`

## Implementation

- Changed the new-record POST endpoint in `ModalRecordEdit.tsx` from `EXAM_API + '/essay_records/create_for_student/'` to `EXAM_API + '/essay_records/create/'`.
- Preserved payload semantics: `question_id` remains present, and no `user` or `user_id` owner field was added.

## Static Contract Check

Command:

```bash
rg -n "create_for_student" src/features/Essay/for-user/Record/ModalRecordEdit.tsx; s1=$?; rg -n "/essay_records/create/" src/features/Essay/for-user/Record/ModalRecordEdit.tsx; s2=$?; rg -n "question_id" src/features/Essay/for-user/Record/ModalRecordEdit.tsx; s3=$?; rg -n "user_id|user:" src/features/Essay/for-user/Record/ModalRecordEdit.tsx; s4=$?; printf 'create_for_student_exit=%s\ncreate_path_exit=%s\nquestion_id_exit=%s\nowner_fields_exit=%s\n' "$s1" "$s2" "$s3" "$s4"
```

Result:

```text
52:          url: EXAM_API + '/essay_records/create/',
55:            question_id: q.id,
create_for_student_exit=1
create_path_exit=0
question_id_exit=0
owner_fields_exit=1
```

Interpretation:

- `create_for_student` absent: pass (`exit 1` from no matches)
- `/essay_records/create/` present: pass (`exit 0`)
- `question_id` present: pass (`exit 0`)
- `user:` / `user_id` absent: pass (`exit 1` from no matches)

## Verification Commands

### `pnpm exec eslint src/features/Essay/for-user/Record/ModalRecordEdit.tsx src/func/api-error.ts src/func/index.ts`

- Outcome: pass
- Exit code: `0`
- Transcript: no output

### `pnpm build`

- Outcome: pass
- Exit code: `0`
- Transcript:

```text
$ tsc -b && vite build
vite v6.4.3 building for production...
transforming...
/*! 🌼 daisyUI 5.5.23 */
✓ 1446 modules transformed.
node_modules/.pnpm/pdfjs-dist@3.11.174/node_modules/pdfjs-dist/build/pdf.js (1982:23): Use of eval in "node_modules/.pnpm/pdfjs-dist@3.11.174/node_modules/pdfjs-dist/build/pdf.js" is strongly discouraged as it poses security risks and may cause issues with minification.
rendering chunks...
computing gzip size...
dist/index.html                     1.38 kB │ gzip:   0.73 kB
dist/assets/.pnpm-BcMAg_Zp.css     56.03 kB │ gzip:   6.99 kB
dist/assets/index-B4-NSMGq.css    153.40 kB │ gzip:  23.73 kB
dist/assets/index-BjMZAcfE.js     233.13 kB │ gzip:  65.35 kB
dist/assets/.pnpm-DDLmXG5Y.js   2,309.07 kB │ gzip: 663.27 kB
✓ built in 5.28s

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
```

### `git diff --check`

- Outcome: pass
- Exit code: `0`
- Transcript: no output

## Smoke Blocker Status

- The blocker from `docs/result/2026-06-12-1634-p1c-authenticated-exam-permission-smoke-smoke-result.md` is fixed at the frontend contract level.
- The stale student create endpoint is no longer used by `ModalRecordEdit.tsx`.

## Hermes Post-Verification

After OpenCode completed, Hermes independently verified the result.

Command bundle:

```bash
set -e
if rg -n "create_for_student" src/features/Essay/for-user/Record/ModalRecordEdit.tsx; then exit 1; else echo 'OK: create_for_student absent'; fi
rg -n "/essay_records/create/" src/features/Essay/for-user/Record/ModalRecordEdit.tsx
rg -n "question_id" src/features/Essay/for-user/Record/ModalRecordEdit.tsx
if rg -n "user_id|user:" src/features/Essay/for-user/Record/ModalRecordEdit.tsx; then exit 1; else echo 'OK: owner fields absent'; fi
pnpm exec eslint src/features/Essay/for-user/Record/ModalRecordEdit.tsx src/func/api-error.ts src/func/index.ts
pnpm build
git diff --check
```

Result: exit `0`.

Notes:

- `create_for_student` is absent.
- `/essay_records/create/` and `question_id` are present.
- `user:` / `user_id` owner fields are absent.
- Scoped eslint passed with no output.
- `pnpm build` passed; existing Vite/pdfjs chunk/eval warnings remain non-blocking.
- `git diff --check` passed.
- Hermes temporary OpenCode prompt file was removed after verification.

## Follow-up

- Rerun the full authenticated smoke after this remediation.
- Keep the smoke focused on the existing API/static pattern; no additional backend or DB changes were made here.
