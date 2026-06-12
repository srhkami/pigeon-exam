# P1-B 權限修正後測驗前端相容計畫

> Runner：OpenCode（待使用者另行授權後執行）
> Repo：`/Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam`
> Backend baseline：`pigeon-hand-api` commit `a1ee678 修正權限與安全設定`
> Result report：`docs/result/2026-06-12-1124-p1b-permission-frontend-compat-exam-result.md`

## 目標

讓 `pigeon-exam` 相容 P0/P1-A 後端權限收斂，尤其是 `PaperRecord` 建立時由後端強制使用目前登入者，不再接受前端可偽造的 `user` 欄位；並確認使用者/管理者作答紀錄頁仍能正常顯示。

## 背景與已驗證後端合約

後端已提交：`pigeon-hand-api` commit `a1ee678`。

與 `pigeon-exam` 有關的重點：

1. `PaperRecordViewSet`
   - 需要登入且具 `E`、`EM` 或 `AM`。
   - `E` 只能讀取自己的作答紀錄。
   - `EM` / `AM` 可讀取全量作答紀錄。
   - `perform_create()` 會 `serializer.save(user=request.user)`。
   - `PaperRecordSerializer.user` 為 read-only。

2. `POST /exam/paper_records/` 或 `POST /exam/v2/paper/submit` 相關前端 payload
   - 不應再送 `user` 來指定作答紀錄擁有者。
   - 若後端 endpoint 是 v2 submit 且 serializer 不接受 `user`，前端型別也不應鼓勵送 user。

3. `paper_records/self/`
   - 使用者端已傾向使用 self endpoint，方向正確。

## 非目標

- 不修改後端。
- 不修改 `pigeon-hand` 或 `pigeon-manage`。
- 不新增 httpOnly cookie、cookie refresh、CSRF cookie 或 CORS credentials 流程。
- 不讀取 `.env` 或 secrets。
- 不呼叫外部 LLM/API；本計畫僅為前端程式碼相容修正與本機 build/lint。
- 不擴大處理 `SelectRecordViewSet`、`EssayRecordViewSet`、`ExamResultViewSet` 等 P0 result 中標記的 deferred backend owner-scope 端點；若發現前端送 `user`，本計畫只移除/標記相容問題，不修改後端授權模型。

## 預期修改範圍

主要檔案：

- `src/features/Paper/for-user/Paper.tsx`
- `src/types/exam-types.ts`

需搜尋確認的檔案範圍：

- `src/features/Paper/**`
- `src/features/Essay/**`
- `src/features/Select/**`
- `src/hooks/**`
- `src/types/exam-types.ts`

## 實作任務

### E1：盤點作答/紀錄建立 payload 是否仍送 user

Objective：找出後端 P0/P1-A 後會被拒絕或具偽造風險的 payload。

步驟：

1. 在 repo 內搜尋：

```bash
cd /Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam
rg "user:\s*userInfo\.id|user_id|paper_records|PaperSubmitForm|SelectRecord|EssayRecord" src
```

2. 將搜尋結果分類：
   - PaperRecord submit：本計畫必修。
   - SelectRecord / EssayRecord：若目前仍送 `user`，只在 result report 標示是否受現有後端 deferred 影響；除非 build/type 需要，不擴大改後端或語意。
   - 單純讀取/顯示 `record.user`：可保留。

### E2：調整 Paper submit 型別與 payload

Objective：`PaperSubmitForm` 不包含使用者可偽造欄位，且 `Paper.tsx` 送出的資料符合後端合約。

目前已看到 `src/features/Paper/for-user/Paper.tsx` 的 `formData` 不含 `user`，方向正確，但仍需正式驗證與型別收斂。

步驟：

1. 檢查 `src/types/exam-types.ts`：
   - `PaperSubmitForm` 是否只包含：`title`、`subject`、`category`、`select_question_ids`、`select_answers`、`select_score`、`essay_question_ids`、`essay_answers`、`essay_score`。
   - 不應加入 `user`。
2. 若 `PaperSubmitForm` 已正確，保持不變，僅在 result report 記錄「已驗證不需修改」。
3. 若其他 Paper submit helper 有送 `user`，移除該欄位。
4. 確認 `PaperRecordData.user` 保留為 read-only response 欄位即可，不用從 response type 移除。

### E3：確認使用者/管理者紀錄頁 endpoint 與權限 UX

Objective：確保後端 owner-scope 後前端不依賴「一般使用者可看全部」。

步驟：

1. 確認使用者端紀錄頁使用 self endpoint：
   - `src/features/Paper/for-user/PaperRecords.tsx` 應使用 `EXAM_API + '/paper_records/self/'`。
2. 確認管理端紀錄頁仍使用全量 endpoint：
   - `src/features/Paper/for-manager/**` 或相關 route 使用一般 list endpoint，僅在 `EM` / `AM` route 下可進入。
3. 若路由缺少 `AuthLayout authType='EM'` 或管理權限 gate，列為必修；若已存在，記錄於 result report。
4. 不要用前端 gate 當安全邊界；前端只改善 UX，安全邊界已在後端。

### E4：處理登入/驗證錯誤訊息相容

Objective：後端新增 throttle 與 email code 一次性使用後，前端錯誤顯示仍可讀。

步驟：

1. 搜尋登入、email code、signup 表單：

```bash
rg "email_code|code|signup|login|BtnEmailCode|PasswordForm|EmailForm" src/features src/auth src/hooks
```

2. 確認 429 / `{detail: ...}` / serializer field errors 可被現有 `showToast` 或表單錯誤處理顯示。
3. 若目前只 `JSON.stringify(err.response.data)` 且 UX 可接受，可不改；若造成空白/崩潰，做最小修正。
4. 不改 token 儲存架構，不導入 cookie flow。

### E5：驗證

必跑：

```bash
cd /Users/cksai/Desktop/Coding/piegon-hand-projects/pigeon-exam
pnpm exec eslint src/features/Paper/for-user/Paper.tsx src/features/Paper/for-user/PaperRecords.tsx src/types/exam-types.ts
pnpm build
```

若 E1/E3 實際修改了其他 `.ts` / `.tsx` 檔案，scoped eslint 必須包含所有新增/修改檔案。

建議手動/半手動檢查：

- E 使用者：可提交試卷，network payload 不含 `user`，成功後導向 `/paper/record/{id}`。
- E 使用者：`/paper/records/1` 只顯示自己的紀錄。
- EM/AM 管理者：管理紀錄列表仍可讀取全量資料。
- 缺權限帳號：管理紀錄頁會顯示既有未授權 UX，而非空白崩潰。

## Definition of Done

- Paper submit payload 不含 `user`。
- 使用者紀錄頁使用 self endpoint，管理者紀錄頁權限 gate 符合 `EM` / `AM`。
- TypeScript build 通過。
- scoped eslint 通過，或明確證明失敗為既有 unrelated 問題。
- 建立 result report：`docs/result/2026-06-12-1124-p1b-permission-frontend-compat-exam-result.md`。

## OpenCode result report contract

執行完成後，OpenCode 必須建立：

`docs/result/2026-06-12-1124-p1b-permission-frontend-compat-exam-result.md`

內容至少包含：

1. 完成項目對照 E1-E5。
2. 實際修改檔案；若某項驗證後不需修改，也要寫明原因。
3. 實際 verification commands、exit code、重點輸出。
4. 是否有手動/API smoke；若沒有，說明原因。
5. 未完成項目與 blockers，尤其是 Select/Essay deferred backend owner-scope 是否只記錄未處理。
6. 明確聲明未修改後端、未讀 `.env`、未呼叫外部 LLM/API、未實作 httpOnly cookie。
