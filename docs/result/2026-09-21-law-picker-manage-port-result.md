---
id: result.pigeon-exam.law-picker-manage-port.2026-09-21
implements: plan.pigeon-exam.law-picker-manage-port.2026-09-21
status: completed
execution_status: source_offline_contract_build_review_verified_browser_deferred
canonical: true
created: 2026-09-21
updated: 2026-09-21
review: PASS (deleg_f5d9ced5)
---

# Exam 法規選取介面移植結果

## 實際變更

- 將「加入關聯法條」視窗接至局部的法規篩選、條文搜尋與結果卡片元件；既有 `ArticleLinkEdit.tsx` 的選取、去重與兩階段儲存流程未修改。
- 新增固定首批 20 筆啟用法規及首批 10 筆啟用條文的 V3 讀取契約。指定法規時帶入 `document_code`，選取全部法規時不帶該參數；未新增分頁或無限捲動。
- 法規候選與條文搜尋都以 `AbortController` 與請求序號拒絕條件變更、關閉或卸載後的晚到回應。切換法規篩選會取消舊條文搜尋並清空舊結果；已選法規以可見標籤保留。
- `Articles.tsx` 改由結果卡片呈現，已選 provision id 顯示「已加入」，父層原有去重仍是最後防線。

## 驗證

- RED：`node --experimental-strip-types scripts/exam-law-reference-contract.mjs` 因尚未建立 `lawPickerApi.ts` 以 `ERR_MODULE_NOT_FOUND` 結束（exit 1）。
- GREEN：同一契約命令通過（exit 0）；包含合成法規／條文回應正規化、20／10 筆 URL 參數、篩選條件、卡片、取消／序號及窄螢幕來源契約。
- `node scripts/hand-auth-parity-contract.mjs`：57 項離線合成驗證通過（exit 0）。
- 修改檔案 ESLint 通過（exit 0）。
- `pnpm build` 通過（exit 0）。Vite 仍輸出既有的大型 chunk 與 `pdfjs-dist` 的 `eval` 警告，本輪未處理。
- 髒工作樹基線護欄與目標／新檔空白檢查通過（exit 0）；未改動其他 26 個受保護並行路徑。

## 未執行範圍與驗證缺口

- 未啟動本機服務、未登入、未送出真實 API 或業務寫入；沒有資料庫、部署、正式切換、提交或推送。
- 沒有可在未登入且不觸發真實 API 的既有介面測試入口，因此桌面／窄螢幕的實際瀏覽器互動仍待人工或後續隔離測試驗證；本輪僅保留離線合成回應與來源／建置證據。

## 複審

聚焦獨立複審 `deleg_f5d9ced5` 已對目前凍結來源回覆 `PASS`。複審範圍涵蓋本計畫允許路徑、V3 讀取參數、晚到回應防護、既有儲存邊界與驗證主張；未執行服務、API／DB 寫入、Git 交付或秘密讀取。
