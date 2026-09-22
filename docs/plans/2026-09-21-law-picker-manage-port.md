---
id: plan.pigeon-exam.law-picker-manage-port.2026-09-21
type: plan
status: completed
execution_status: completed_source_offline_contract_build_review_verified_browser_deferred
canonical: true
created: 2026-09-21
updated: 2026-09-21
scope: [pigeon-exam]
result: docs/result/2026-09-21-law-picker-manage-port-result.md
---

# Exam 法規選取介面移植短計畫

## 目標與已確認取捨

在 Exam 選擇題與申論題的「加入關聯法條」視窗，採用 Manage 現有的「法規篩選＋條文搜尋＋結果卡片」，保留 Exam 的選取與儲存流程。使用者明確選擇不補分頁：法規候選維持首批 20 筆、條文結果維持首批 10 筆，以縮小搜尋條件尋找，不加入翻頁或無限捲動。

## 範圍與依據

本計畫由 pigeon-exam 單獨持有；本文路徑除明示外均相對本專案根目錄。根目錄 STATE.md、根目錄計畫、Manage、後端與其他前端均不修改，不等待主專案其他工作線，也不要求其停止或保持無變動。

唯讀移植參照：`../pigeon-manage/src/features/LawAdmin/components/` 的 `LawProvisionSearchPicker.tsx`、`LawDocumentFilterSelect.tsx`、`LawProvisionResultCard.tsx`，以及 `../pigeon-manage/src/features/LawAdmin/lawAdminApi.ts` 的兩個讀取契約。移植以目前已確認的介面結構為準，不追隨 Manage 其他工作線擴張功能。

核准實作後的可修改路徑：
- `src/features/Link/ArticleLink/ModalAddArticleLink.tsx`：保留視窗入口，接入新選取介面。
- `src/features/Link/ArticleLink/Articles.tsx`：改用結果卡片，不保留兩套使用入口。
- 同目錄新增 `LawProvisionSearchPicker.tsx`、`LawDocumentFilterSelect.tsx`、`LawProvisionResultCard.tsx`、`lawPickerApi.ts`：局部元件及最小讀取契約；不整份搬入管理 API。
- `scripts/exam-law-reference-contract.mjs`：調整拆檔後的契約檢查並補聚焦行為驗證。
- 本計畫、`STATE.md` 及完成後的 `docs/result/2026-09-21-law-picker-manage-port-result.md`。

沿用 `lawReferenceController.ts` 的型別與儲存邏輯、`ArticleLinkEdit.tsx` 的選取回呼及兩題型的既有接線，不預設修改它們。需要超出上述路徑時，先說明原因並確認範圍。既有未提交／未追蹤修改保留；只核對本輪目標檔案是否有併行衝突，不稽核其他工作線。

## 必要做法

- 保留彈出視窗與連續選取；選取後不關閉、不清空篩選或結果。關閉後沿用原本清空搜尋、重新開啟聚焦輸入的生命週期；已選法條仍由父層保存。
- 法規名稱篩選接既有 `GET /v3/law/documents`（`q`、`is_active=true`、`page_size=20`）；條文搜尋接 `GET /v3/law/search`（`q`、可選 `document_code`、`active_only=true`、`page_size=10`）。均沿用 Exam 的 `useAxios` 與 V3 主機設定，不修改共用基底。
- 維持 Manage 的卡片結構與摘要，條次沿用 Exam 的「第 X 條／第 X 點」中文標示；不新增副標題、全文預覽或進階搜尋。
- 已選取狀態依 provision id 判定；不重複加入、不改待存集合格式。變更法規名稱搜尋時保留已選法規的可見標籤，避免畫面與實際篩選條件不一致。
- 法規候選與條文請求都必須在條件變更、關閉或卸載後拒絕晚到結果；保留取消訊號與請求序號防護。更換所選法規時使舊條文結果失效，避免選到上一個篩選範圍的結果。
- 保留既有關聯載入前禁止儲存、兩階段保存、部分成功只重試關聯、結果未知停止重送。選取只改表單狀態，不立即寫入 API。

不做：分頁、混合／語意搜尋、歷史關聯修復、管理校正、學生端預覽改版、共用元件套件化、新相依套件、後端／權限／資料庫修改、部署與 Git 交付。

## 驗收與驗證

1. 兩題型共用視窗均呈現法規篩選、條文搜尋及結果卡片；指定／全部法規參數正確，維持首批結果且無分頁控制。
2. 已選項不可重複加入；連續選取保留條件；主畫面移除與原儲存流程不變。
3. 搜尋中、空結果及失敗可辨識；關閉重開、切換篩選與晚到回應不污染目前結果，已選法規標籤與篩選值一致。
4. 更新契約檢查時追蹤實際新元件，不能僅刪除原取消防護斷言。執行聚焦行為驗證、`node --experimental-strip-types scripts/exam-law-reference-contract.mjs`、既有 `node scripts/hand-auth-parity-contract.mjs`（包含最終網址回歸）、修改檔案 ESLint、`pnpm build` 與 `git diff --check`。
5. 以隔離合成回應驗證桌面／窄螢幕視窗的篩選、連續選取與關閉重開，不送真實業務寫入。瀏覽器驗證不可用時如實記錄缺口，不以來源測試冒稱介面驗收；不重跑其他前端建置或後端資料庫測試。

## 核准與停止條件

本輪僅核准在 Exam 建立計畫與狀態導航，實作未開始；取得明確實作核准後才將計畫改為 active，連續完成範圍內修改、驗證及結果收束，不逐小步重問。結果文件只在實際執行後建立。

資料庫寫入、正式切換、部署、提交與推送不在本計畫授權內。只有目標檔案的實際併行衝突、既有 API 契約不符、必要驗收阻擋或需要擴張範圍才停止釐清；主專案另一條工作線執行中本身不是阻擋。
