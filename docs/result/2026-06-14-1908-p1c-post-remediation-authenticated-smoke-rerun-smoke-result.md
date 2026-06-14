# P1-C Post-Remediation Authenticated Smoke Rerun Result

> Runner: Hermes manual API/static smoke
> Run id: `2026-06-14-1908-p1c-post-remediation-authenticated-smoke-rerun`
> Base URL: `http://127.0.0.1:8000`
> Machine artifact: `/Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam/docs/artifacts/2026-06-14-1908-p1c-post-remediation-authenticated-smoke-rerun-api.json`
> Final acceptance decision: `ACCEPTED_WITH_RISK`

## Preflight / service provenance

- Backend safety gate: DEBUG=True; DB=127.0.0.1:5432/pigeonhand
- Backend health: {'status': 401, 'body': {'detail': 'Authentication credentials were not provided.'}}
- Frontend health: {'status': 200, 'length': 1382}
- Frontend dev server started by this smoke: proc_2db5c2f1f343

## Auth role table

| Role | login status | verify status | verify body keys |
|---|---:|---:|---|
| E | 200 | 200 | ai_point,auth,bookmark,email,expiry_days,id,name,options,wait_accredit |
| OTHER_E | 200 | 200 | ai_point,auth,bookmark,email,expiry_days,id,name,options,wait_accredit |
| EH | 200 | 200 | ai_point,auth,bookmark,email,expiry_days,id,name,options,wait_accredit |
| EM | 200 | 200 | ai_point,auth,bookmark,email,expiry_days,id,name,options,wait_accredit |
| AM | 200 | 200 | ai_point,auth,bookmark,email,expiry_days,id,name,options,wait_accredit |

## E/EH/EM/AM role matrix summary

- E select_records self: PASS; status=200; total=1; note=
- E essay_records self: PASS; status=200; total=1; note=
- E paper_records self: PASS; status=200; total=1; note=
- E select_records management list: PASS; status=200; total=0; note=
- E essay_records management list: PASS; status=200; total=0; note=
- E select_records other detail denied: PASS; status=404; total=None; note=
- E essay_records other detail denied: PASS; status=404; total=None; note=
- E paper_records other detail denied: PASS; status=404; total=None; note=
- E owner spoof select submit: PASS; status=200; total=None; note=
- E owner spoof essay create: PASS; status=201; total=None; note=
- EH select_records management: PASS; status=200; total=4242; note=must_list
- EH essay_records acceptable deny: PASS; status=403; total=None; note=deny_or_empty
- EH paper_records acceptable deny: PASS; status=403; total=None; note=deny_or_empty
- EM essay_records management: PASS; status=200; total=7; note=must_list
- EM paper_records management: PASS; status=200; total=4; note=must_list
- EM select_records acceptable deny: PASS; status=403; total=None; note=deny_or_empty
- AM select_records management: PASS; status=200; total=4242; note=must_200
- AM essay_records management: PASS; status=200; total=7; note=must_200
- AM paper_records management: PASS; status=200; total=4; note=must_200
- E paper_records self page_size=1 bounded probe: PASS; status=200; total=1; note=design risk remains regardless of bounded next

## Owner-spoofing result

- E owner spoof select submit: PASS; status=200; owner_id=11203; expected_owner_id=11203
- E owner spoof essay create: PASS; status=201; owner_id=11203; expected_owner_id=11203

## Frontend static contract result

- static essay create endpoint: PASS; ModalRecordEdit uses create endpoint and no stale name
- static essay create payload question_id: PASS; question_id present
- static user create/submit payload no owner fields: PASS; checked ModalRecordEdit and SelectSingle submit payloads
- static self list endpoints: PASS; user record lists/detail workaround use self endpoint
- static paper detail workaround risk: PASS; PaperRecord.tsx uses /paper_records/self/ with params id; no self-safe detail endpoint observed

## Stale endpoint blocker status

- POST `/exam/essay_records/create_for_student/` was probed only as stale-endpoint evidence.
- Its result does not block acceptance by itself because the acceptance criterion is that frontend no longer calls it.

## Error-shape probes

- error shape 403 sample: PASS; status=403; keys=['detail']
- error shape 404 sample: PASS; status=404; keys=['detail']
- error shape 400 sample: PASS; status=400; keys=['question_id']

## PaperRecord self-detail risk decision

- `paper_self_detail_pagination_risk`: `true`
- Reason: frontend `PaperRecord.tsx` still uses `/paper_records/self/` plus id filtering instead of a self-safe detail endpoint. Even when the bounded page-size probe is not actively failing, this remains a P1-D design risk.

## Cleanup residual counts

```json
{
  "deleted": {
    "paper_records_deleted": 6,
    "essay_records_deleted": 3,
    "select_records_deleted": 3,
    "papers_deleted": 0,
    "select_questions_deleted": 2,
    "essay_questions_deleted": 1,
    "users_deleted": 5
  },
  "residuals": {
    "users": 0,
    "select_questions": 0,
    "essay_questions": 0,
    "select_records": 0,
    "essay_records": 0,
    "paper_records": 0,
    "papers": 0
  },
  "residual_zero": true
}
```

## Verification commands and exit codes

- `pnpm exec eslint src/features/Essay/for-manager/Question/ModalEssayQuestionEdit.tsx src/features/Essay/for-user/Record/ModalRecordEdit.tsx src/features/Layout/ErrorLogToast.tsx src/features/Paper/for-manager/Record/PaperRecordDetail.tsx src/features/Paper/for-user/Paper.tsx src/features/Paper/for-user/PaperRecord.tsx src/features/Select/for-manager/Manage/Edit/ModalSelectEdit.tsx src/features/Select/for-user/Random/SelectSingle.tsx src/func/form.ts src/func/index.ts src/func/api-error.ts` (cwd `/Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam`) => exit 0
- `pnpm build` (cwd `/Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam`) => exit 0
- `git diff --check` (cwd `/Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam`) => exit 0
- `set -a; . ../.env; set +a; SQL_HOST=127.0.0.1 SQL_PORT=5432 uv run python manage.py test exam.tests.PaperRecordPermissionTestCase exam.tests.ExamScopePermissionTestCase -v 2` (cwd `/Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-hand-api/core`) => exit 0

## Errors / blockers

- 無

## Recommended next step

- P1-C remediation smoke can be accepted with known risk. Next: plan P1-D self-safe PaperRecord detail endpoint to remove pagination/filter workaround.
