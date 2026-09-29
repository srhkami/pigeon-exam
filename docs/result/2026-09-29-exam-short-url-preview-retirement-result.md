---
id: result.pigeon-exam.short-url-preview-retirement.2026-09-29
type: result
status: completed
acceptance: source_contract_type_build_and_browser_route_retirement_verified
implements: plan.pigeon-exam.short-url-preview-retirement.2026-09-29
plan: docs/plans/2026-09-29-exam-short-url-preview-retirement.md
created: 2026-09-29
updated: 2026-09-29
scope: pigeon-exam
candidate_files: 13
candidate_combined_sha256: 4d98a2b537c777d5452de48805c81272c61b6b03be2c1fa7904190f85a274192
---

# Exam 短網址預覽退役結果

## 實際變更

- 從 `src/routes/routes.tsx` 移除 `FilePreview` 延遲載入，以及 `/f/:url`、`/l/:url` 兩條短網址預覽 route。
- 刪除 `src/features/FilePreview/**` 五個檔案與空目錄樹；Exam 不再解析 `/web/short_url/`、取得 HappyWork 檔案 Blob 或掛載 PDF 工具列。
- 刪除無其他消費者的 `src/types/happywork-types.ts`；將歷史題目 API 回應仍需要的 `HappyFileLink` 收回 `exam-types.ts`，保留 `file_link` 讀取相容，不恢復檔案介面或送出欄位。
- 從 `package.json` 與 `pnpm-lock.yaml` 移除 `@react-pdf-viewer/core`、`@react-pdf-viewer/default-layout` 及其 69 個不再需要的相依套件。
- 更新檔案關聯退役、錯誤回報退役與 Hand 認證同等契約；後兩者不再讀取已刪除的 FilePreview 來源。

## 驗證

- `pnpm run test:file-link-retirement` 修正前退出 1，依預期因 FilePreview 目錄仍存在而 RED。
- 產品來源刪除後第一次執行仍退出 1，原因是 Git 不追蹤但本機仍存在的空目錄；精確確認三個目錄皆為空後移除，再執行退出 0，16／16 項通過。
- `pnpm run test:errorlog-retirement`：退出 0。
- `node --experimental-strip-types scripts/hand-auth-parity-contract.mjs`：退出 0，55／55 項離線合成契約通過。
- `pnpm exec eslint src/routes/routes.tsx src/types/exam-types.ts`：退出 0。
- `pnpm exec tsc -b --pretty false`：退出 0。
- `pnpm exec vite build --outDir /tmp/exam-short-url-retirement-build --emptyOutDir`：退出 0；僅有既有大於 500 kB chunk 警告。產物中沒有 `PDFViewer`、`react-pdf-viewer`、`pdf.worker`、`FilePreview` 或 `/web/short_url/`。
- Exam `src` 搜尋沒有 FilePreview、預覽 helper、HappyWork 型別 import、`@react-pdf-viewer` 或 `/f`、`/l` route 殘留；套件與鎖定檔亦無 PDF viewer 套件。
- 目前 Vite 開發入口以隔離瀏覽器實測 `/f/synthetic-retired-route`、`/l/synthetic-retired-route` 均顯示 404，且零 `/web/short_url/` 請求。
- 13 路徑候選含 6 個刪除墓碑，combined SHA-256 為 `4d98a2b537c777d5452de48805c81272c61b6b03be2c1fa7904190f85a274192`；工作樹範圍盤點沒有本工作線外新增變更。

## 邊界

未修改 Hand、Manage、後端短網址 API、既有短網址資料或題目歷史 `file_link` 回應；未寫入資料庫、未正式部署、未執行前端正式切換、未提交或推送。舊 Exam `/f/*`、`/l/*` 現在走一般不存在頁面，未新增轉址。
