---
id: plan.pigeon-exam.file-link-frontend-retirement.2026-09-22
type: plan
status: completed
execution_status: source_offline_contract_build_review_verified_browser_deferred
canonical: true
created: 2026-09-22
updated: 2026-09-22
scope: pigeon-exam
state_ref: STATE.md
result_path: docs/result/2026-09-22-file-link-frontend-retirement-result.md
---

# 小試鴿手前端檔案關聯停用

## 目標與範圍

停止小試鴿手逐題維護檔案關聯：一般使用者與管理員不再看到題目附帶的檔案連結，新增／編輯題目不再提供檔案查詢、加入或移除功能；關聯法條與其他題目功能維持原樣。

本計畫只修改 `pigeon-exam`。先前本機唯讀盤點為 219 題、291 筆關聯、75 個去重項目，其中 72 個屬作業程序；這是方向判斷的本機證據，不代表正式環境即時統計，不需為前端退役重跑資料盤點。

不做事項：

- 不修改後端 API、模型、資料庫欄位或既有 `file_link` 資料；不刪檔、不遷移至新版 SOP、不新增自動關聯。
- 不影響開心上班、作業程序專區及其他前端專案。保留 Exam 的 `/f/:url`、`/l/:url` 預覽路由及 `FilePreview`，不順便移除 PDF 套件或調整建置分包。
- 保留現有「有／無關聯物件」篩選及一般搜尋。後端 `link_is_null` 同時計算法條與檔案，搜尋亦包含 `file_link`；本輪不將其改名為法條專用，也不在前端對單頁結果另行過濾。因此歷史檔案仍可能影響搜尋／篩選命中，本計畫不宣稱整套後端檔案關聯已退役。
- 不改 `showLinks` 設定或儲存格式，它仍控制關聯法條顯示；不新增停用通知、副標題或功能開關。

## 必要做法

1. 從已確認的選擇題三種卡片、申論題兩種卡片移除 `FileLink` 匯入與渲染；保留 `ArticleLink`、法條刷新、答案、註解、擬答與既有顯示設定。
2. 兩個新增／編輯表單移除 `FileLinkEdit`、檔案關聯狀態及明確送出欄位；移除兩種表單型別的 `file_link`。讀取型別及其 `HappyFileLink` 相容定義保留，以反映尚未變動的後端回應，不對其他檔案型別進行清理。
3. 在既有 `buildQuestionPayload` 同時排除 `article_link` 與 `file_link`，更新其回傳型別，且不可修改輸入物件。理由：`react-hook-form` 的 `defaultValues` 直接取自題目物件，僅刪除按鈕或 TypeScript 欄位不能阻止舊 `file_link` 經由物件展開再次送出。
   - 新增 `POST` 與編輯 `PATCH` 都不送 `file_link`，也不送空陣列或 `null` 代替；編輯應保留既有資料，新題由後端既有預設值處理。
   - 保留「先儲存題目、再儲存 V3 法條」流程，以及關聯尚未讀完不可儲存、部分成功只重試法條、建立結果未知不重送、防重複提交與成功後刷新。
4. 確認引用歸零後移除三個檔案關聯專用元件。同步調整既有錯誤回報退役測試中讀取 `ModalSelectFile.tsx` 的項目：改驗證該專用檔已不存在，不以泛用略過缺檔削弱其他安全斷言。
5. 更新既有法規關聯測試中「保留 `file_link`」的舊斷言，補上前端停用契約；新增一份聚焦測試並登錄指令，不新增套件或通用框架。

已核對的來源依據：`ModalSelectEdit.tsx:31-44`、`ModalEssayQuestionEdit.tsx:28-34`、`lawReferenceController.ts:63-66,99-127`；後端唯讀參照為 `../pigeon-hand-api/core/exam/select/views.py:59-74,94-95`、`../pigeon-hand-api/core/exam/essay/views.py:45-60,71` 與兩題型既有序列化器。前述短檔名的完整路徑見下列清單。

### 允許修改路徑

除明示 `../` 的唯讀參照外，路徑均相對於 `pigeon-exam` 儲存庫根目錄。

修改：

- `src/features/Select/for-manager/Question/QsCardForEdit.tsx`
- `src/features/Select/for-manager/Question/QsCardForView.tsx`
- `src/features/Select/for-user/Question/QsCardForRecord.tsx`
- `src/features/Essay/for-manager/Question/QsCardForEdit.tsx`
- `src/features/Essay/for-user/Question/QsCardForView.tsx`
- `src/features/Select/for-manager/Manage/Edit/ModalSelectEdit.tsx`
- `src/features/Essay/for-manager/Question/ModalEssayQuestionEdit.tsx`
- `src/features/Link/ArticleLink/lawReferenceController.ts`
- `src/types/exam-types.ts`
- `scripts/exam-law-reference-contract.mjs`
- `scripts/errorlog-retirement-contract.mjs`
- `package.json`：只登錄 `test:file-link-retirement`。

移除專用前端原始碼（須隨本計畫取得實作核准，不代表可刪後端 API 或文件）：

- `src/features/Link/FileLink/FileLink.tsx`
- `src/features/Link/FileLink/FileLinkEdit.tsx`
- `src/features/Link/FileLink/ModalSelectFile.tsx`

新增：`scripts/exam-file-link-retirement-contract.mjs`。

治理文件限本計畫、`STATE.md` 及實作完成後的 `docs/result/2026-09-22-file-link-frontend-retirement-result.md`。不修改根目錄狀態或其他工作線；執行前重新檢查 Exam 的 Git 狀態，保留並行修改。

## 驗收與驗證

以一次前端實作交付，不拆成多個行政核准階段：

- 使用含非空舊檔案關聯的合成題目，驗證五種實際卡片都不產生檔案連結，兩個表單均無關聯檔案及查詢入口；既有關聯法條仍可顯示、編輯與刷新。退役元件不再被匯入，題目操作不再發出 `/happywork/sop_search/` 請求。
- 離線呼叫實際送出流程，覆蓋兩題型的 `POST`、`PATCH`：即使表單預設值或輸入物件含非空 `file_link`，實際題目請求也不含該欄位，原始物件不變，其他欄位及 V3 法條請求保留。僅刪除型別或字串不能作為防止清空資料的證據。
- 先讓新增退役契約在舊來源失敗，再修改來源；保留既有法條讀取、保存、部分成功、未知結果與刷新測試，不重跑無關認證或跨專案建置。
- 在 Exam 根目錄執行：
  - `pnpm run test:file-link-retirement`（對應新增 Node 腳本；需要載入 TypeScript 時沿用 `--experimental-strip-types`）。
  - `node --experimental-strip-types scripts/exam-law-reference-contract.mjs`。
  - `pnpm run test:errorlog-retirement`。
  - 修改原始碼限定的 `pnpm exec eslint <實際修改檔案>`、`pnpm build`、`git diff --check`；新檔另檢查空白錯誤。
- 完成後做一次聚焦獨立審查，只檢查檔案功能是否退出、送出欄位是否可能破壞歷史資料，以及法條功能／測試有無回歸；主代理核對實際差異與命令輸出。
- 不執行真實題目新增／修改、登入或資料庫測試。瀏覽器人工複驗可於使用者另行開放時確認兩題型的閱覽與編輯畫面；未做時在結果中明列，不把離線與建置通過寫成瀏覽器或正式環境驗收。

## 核准與停止條件

2026-09-22 使用者於計畫建立後明確要求「請開始執行」，已核准以上前端原始碼修改、三個專用元件移除、測試更新及離線驗證；本輪原始碼與離線驗證核准已消耗。原始碼、15 項退役契約、既有法條及錯誤回報契約、聚焦 ESLint 與建置完成，聚焦獨立複審 `deleg_1c4a91bd` 通過且無阻擋問題。本計畫以 `completed`／`source_offline_contract_build_review_verified_browser_deferred` 收束，STATE 改留近期結果導航。實際證據見 `docs/result/2026-09-22-file-link-frontend-retirement-result.md`；瀏覽器缺口保留，不宣稱已部署。

後端修改、資料庫寫入／刪除、真實業務操作、瀏覽器驗證、前端正式切換、部署、提交、推送及歷史改寫均未開放。本計畫不建立必須清除歷史資料或移除預覽路由的後續義務。

若必須改動允許路徑以外的檔案、發現專用元件有新的有效使用處、既有 `PATCH` 省略欄位無法保留資料、法條功能回歸或並行修改使契約衝突，停止並提出最小範圍修訂；不為完成前端停用而自行改後端或清資料。
