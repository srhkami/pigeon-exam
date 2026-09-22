---
id: result.pigeon-exam.law-reference-list-refresh.2026-09-22
status: completed
execution_status: source_offline_contract_build_verified_browser_deferred
canonical: true
created: 2026-09-22
updated: 2026-09-22
---

# 題目關聯法條列表刷新修正

使用者明確核准最小修正、不撰寫計畫。本輪只修改三個產品元件及既有回歸腳本，另保存本結果與 STATE 導航。

## 修改

- 選擇題、申論題管理卡片在編輯視窗要求刷新時，遞增該卡片的關聯刷新序號，同時保留原本題目列表的 `onRefetch()`。
- `ArticleLink` 新增選用的 `refreshKey`，使同一道題目可重新讀取 V3 關聯；沿用既有取消與晚到回應防護。其他使用點不須變更。
- 未更動編輯視窗、兩階段儲存、後端、資料庫或介面文案。既有結果未知分支若呼叫刷新，也僅重新讀取，不新增業務重送。

## 驗證

執行目錄為 `pigeon-exam/`。

- 修正前：`node --experimental-strip-types scripts/exam-law-reference-contract.mjs`，退出碼 1；新增回歸明確失敗於「Select 儲存後不切換顯示開關也必須重新讀取關聯」，實際請求 1 次、預期 2 次。
- 修正後：同一命令退出碼 0。兩題型均驗證初次讀取、一般重繪不重送、儲存後重新讀取、保留題目刷新、取消舊讀取、再次儲存仍刷新及正確 GET 端點。測試轉譯並執行真實 TSX 接線，React 掛鉤與傳輸使用受控替身，不是實際瀏覽器驗收。
- `pnpm exec eslint src/features/Link/ArticleLink/ArticleLink.tsx src/features/Select/for-manager/Question/QsCardForEdit.tsx src/features/Essay/for-manager/Question/QsCardForEdit.tsx`，退出碼 0。
- `pnpm build`，退出碼 0，包含 TypeScript 與 Vite 建置；仍有既有 `pdfjs-dist` 的 `eval` 及大型產物警告。
- 本輪前快照差異及既有未提交內容保留檢查通過；未暫存、提交或推送。

## 未執行

未操作真實瀏覽器、API、資料庫、部署或正式切換；未改寫前一輪人工驗收或代理驗證的歷史證據。此次修正仍待使用者在既有畫面複驗。
