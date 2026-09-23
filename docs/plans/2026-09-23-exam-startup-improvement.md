---
id: plan.pigeon-exam.startup-improvement.2026-09-23
type: plan
status: completed
execution_status: source_isolated_browser_verified_review_pass
canonical: true
created: 2026-09-23
updated: 2026-09-23
scope: pigeon-exam
state_ref: STATE.md
workstream_id: exam-startup-improvement
implementation_authorized: true
result_path: docs/result/2026-09-23-exam-startup-improvement-result.md
---

# Exam 啟動、模擬進度與登入互動改善

## 目標與範圍

縮短 Exam 不必要的啟動等待，讓 HTML → React → 可操作頁面連續呈現；**品牌圖示、轉圈圈與假進度條是必要交付**，並修正認證等待及登入視窗生命週期，不改變測驗功能或權限。

依據為使用者本輪需求、現行 Exam 原始碼，以及[前端改善參考](../../../docs/reference/2026-09-23-frontend-improvement-reference.md)。只修改 Exam；Hand／Manage 僅作唯讀參照。本文前置欄位與程式路徑相對 Exam 根目錄，Markdown 連結相對本文。

使用者已延後圖示色彩工作：啟動畫面直接使用現有 `public/Web_Logo.svg`，不修改 SVG、PNG、ICO 等媒體、不重新配色、不更改既有導覽 Logo、分頁及觸控圖示的引用。其現有外觀差異可保留，不構成阻擋；進度條與介面沿用既有色系。

不做首頁版型重設、圖片重製、題庫／作答／交卷／分析業務改造、API 或資料庫修改、套件升級、共用套件抽離、全站視窗重做、其他前端同步修改或部署。舊 `frontend-chunk-optimization` 工作線維持停止；本計畫是獨立新範圍，不承接其 15% 效能門檻。

## 已確認現況

- `index.html` 根節點為空，Google Fonts 樣式表阻擋呈現；`AuthContext.tsx` 驗證時回傳 `null`，內部路由及導覽均無法呈現。
- `AuthLayout`／`AuthComponent` 未處理認證等待；不能只移除上層阻擋。首頁 `Info.tsx` 直接呼叫 `/user_info`，不得因公開外殼提前掛載而推定資料可公開。
- `src/lib/pages.tsx` 靜態匯入使用者測驗、紀錄、統計與分析頁；統計依賴 Recharts，分析依賴 Markdown，題目顯示涉及 Tiptap。部分管理頁及 FilePreview 已延遲載入，應保留。
- 會員入口在 `Base → MenuUser`；`Login` 未接成功關閉回呼，重新驗證及會員分支切換會卸載視窗。Exam 的共用 Modal 尚無完整 Escape／焦點管理，不能假設與 Hand 相同。
- Exam 的 Axios 基底已修為 `ROOT_IP`，不可覆蓋成 Hand 的 `USER_API`。本輪盤點未重新建置或量測速度，Hand 的歷史數據不是 Exam 的基線。

## 必要做法

1. **啟動連續性。** HTML 先提供最小內嵌樣式、現有圖示、轉圈圈與無可見文字／百分比的模擬進度；React 初次路由等待沿用相同樣式與位置。HTML 上限 50%，React 上限 90%，各段約六秒緩出並接續當下值及旋轉相位，不歸零、不硬跳。頁面可呈現便立即交接，不等待公告、統計、全部圖片或登入完成，不設最低展示時間、不補跑 100%。進度留在不會被 React 替換的元素上，交接與卸載清理動畫；深連結同樣有效。保留載入無障礙名稱，不提供假百分比；`prefers-reduced-motion` 下停止連續動畫，採階段靜態位置。一般功能頁的 `Suspense` 等待改為內容區提示，不反覆全螢幕遮蔽。
2. **認證與公開外殼分離。** 對外提供 `isLoading`，公開首頁／導覽可先掛載，受保護元件仍等待後再判斷原權限。首頁資料維持原有認證完成後才掛載的時序，尤其 `Info`，不新增公開 API 或放寬契約。參照 Hand 的取消、請求序號與目前身分檢查，防止舊驗證／更新結果覆蓋登出或新身分；驗證與更新請求各設 10 秒逾時，不改成所有業務請求的共同逾時。保留 401 單次重送、`skipAuthReplay`、更新端點例外與取消語意；同身分合法憑證輪替可恢復請求，跨身分不得共用更新或重送。保留 `ROOT_IP`、V3 契約、原 E／EH／EM 等權限及註冊／認證導回 Hand 的行為，不搬入 Hand 專屬搜尋快取。
3. **啟動依賴減量。** 從入口、路由、頁面定義與共用匯出檔追蹤靜態依賴；優先將使用者測驗／紀錄、統計與分析移至路由動態邊界。若大型編輯器、拖曳或預覽仍被共用匯出鏈帶入，僅修該條鏈，保留既有元件介面與功能。建置分組只在產物證明必要時調整，不盲貼 Hand 設定，不以刪功能或提高警告門檻換取通過。先完成並驗證動態邊界，再處理仍存在的依賴，不預先重構全部重型元件。
4. **會員與登入生命週期。** 會員驗證採固定占位的小型轉圈圈，保留無障礙提示，等待時不顯示可操作登入／會員入口。登入視窗擁有者保持掛載；密碼與驗證碼登入統一在 `!isLoading && isAuthenticated` 時關閉，等待及失敗保留輸入。成功返回現存會員入口，取消返回登入按鈕或等待占位；保留嵌入式登入不跳頁。只補登入所需的標題、Escape 與焦點能力；共用 Modal 若有修改，使用選用能力及原預設行為避免改變其他視窗，並做代表性回歸。
5. **字型與主題銜接。** 保留 Google Fonts，改非阻擋載入；啟動提示使用系統字型。HTML 依既有 `theme` 設定呈現，安全處理儲存不可用或無效值，與 React 主題一致，不新增配色或主題功能。

## 允許修改的路徑

以下是核准實作後的上限，不要求每個檔案都修改；來源變更只能服務上述成果。

| 範圍 | 既有允許路徑 |
|---|---|
| 入口／主題／路由 | `index.html`、`src/main.tsx`、`src/App.tsx`、`src/App.css`、`vite.config.ts`、`src/routes/routes.tsx`、`src/lib/pages.tsx`、`src/features/index.ts` |
| 認證 | `src/auth/AuthContext.tsx`、`src/auth/AuthLayout.tsx`、`src/auth/AuthComponent.tsx`、`src/auth/refreshCoordinator.ts`、`src/auth/handleUser.ts`、`src/types/auth-types.ts`、`src/hooks/useAxios.ts` |
| 導覽／首頁等待 | `src/features/Layout/Base.tsx`、`src/features/Layout/ThemeToggle.tsx`、`src/features/Home/Home.tsx`、`src/features/Home/Info.tsx`、`src/features/Home/Announcement.tsx`、`src/features/User/UserProfile/MenuUser.tsx` |
| 登入／視窗 | `src/features/User/Login/Login.tsx`、`src/features/User/Login/ModalLogin.tsx`、`src/features/User/Login/EmailForm.tsx`、`src/features/User/Login/PasswordForm.tsx`、`src/component/Modal/Modal.tsx`、`src/hooks/useModal.tsx` |
| 載入／依賴邊界 | `src/component/Loading/Loading.tsx`、`src/component/index.ts`；必要時僅在 `src/component/TextEditor/ModalTextEditor.tsx`、`src/component/TextEditor/RichTextShow.tsx`、`src/component/List/DnDList.tsx`、`src/component/List/DnDListItem.tsx` 建立延遲包裝，不改編輯、內容處理或排序邏輯 |

允許新增 `src/component/Loading/StartupLoading.tsx`、`src/component/Loading/RouteLoading.tsx`；重型元件若需拆分，僅允許在其原目錄新增對應 `*.lazy.tsx`／`*.impl.tsx`，先核對真實引用與介面。新增驗證檔限 `scripts/exam-startup-*`、`scripts/exam-login-*`；可調整現有 `scripts/auth-v3-contract.mjs`、`scripts/hand-auth-parity-contract.mjs` 的相關替身／斷言，不移除原有效契約。

治理文件限本計畫、`STATE.md` 與前置欄位所列的未來結果文件。`public/**`、Logo 元件、套件清單／鎖定檔、其他專案、根目錄文件及 `.env*` 不在寫入範圍。

## 驗收與驗證

- **載入必交付：** 隔離瀏覽器延遲入口及首頁模組，於手機／桌面確認 HTML、React 兩段幾何一致、早交接不跳值、50%／90% 上限、頁面就緒立即出現、深連結與卸載清理；涵蓋深淺主題及減少動態效果。媒體檔案內容、既有 Logo 與分頁圖示引用不變。
- **認證安全：** 以合成傳輸和真實待測元件驗證無憑證、慢驗證、成功、失敗／逾時、登出、換身分、重複驗證；公開外殼可操作而受保護元件與資料請求不提前執行。驗證同時及錯開 401、合法輪替、跨身分、更新失敗、取消與禁止重送；`ROOT_IP` 不退步。
- **登入互動：** 密碼／驗證碼兩種登入均驗證成功關閉、等待／失敗保留輸入、取消、Escape、重開與焦點返回；取消後晚到結果不重新開啟視窗。共用 Modal 改動另驗一個既有非登入視窗，不以卸載假冒成功關閉。
- **效能與功能：** 修改前後各建置隔離產物，以入口加首頁必要模組為根，遞迴去重加總靜態依賴 gzip 大小；修改後小於本輪基線，首頁實際請求不再提前載入 Recharts、Tiptap 編輯器及其他本輪移至動態邊界的重型功能。以相同網路／CPU／快取／視窗條件比較首頁可見與側欄可操作時間，區分初始提示與真正頁面，不承諾 Hand 的百分比。操作受影響的測驗／紀錄、圖表、分析、編輯與預覽代表入口，證明延後功能可用；合成 API 不宣稱真實業務驗收。
- **限定檢查：** 新增聚焦契約、既有 `pnpm test:auth-v3`、`pnpm test:email-code-v3`、`node --experimental-strip-types scripts/hand-auth-parity-contract.mjs`；認證／路由變更另跑 `scripts/exam-law-reference-contract.mjs` 與 `pnpm test:file-link-retirement`。執行修改檔案 ESLint、Exam 型別檢查與正式模式建置、`git diff --check`。建置透過既有 Vite 程式介面設定 `envDir:false`，輸出至專案外新目錄，不讀 `.env`、不覆蓋現有 `dist`；型別增量輸出亦隔離。
- **審查與證據：** 認證候選完成後做一次雜湊綁定的獨立聚焦安全複審，主代理核對差異及實跑證據；修正後只重驗受影響部分。其他前端僅唯讀比較必要重複原始碼，不要求凍結或全站稽核；本計畫只改 Exam，其他前端的不同步理由記錄於結果。未執行的 Firefox／Safari、真實帳號及正式站驗證如實保留，不以歷史成功替代。

## 核准與停止條件

2026-09-23 使用者核准撰寫計畫，圖示改色明確延後；同日使用者明確要求執行本計畫與上述本機隔離驗證，已依「基線 → 認證／啟動 → 必要依賴減量 → 登入回歸與複審」完成。證據與未執行範圍見[結果](../result/2026-09-23-exam-startup-improvement-result.md)。不另建立品牌工作線，不為內部步驟再次索取核准。

真實 API／帳號操作、資料庫寫入、registry、正式環境、部署／前端正式切換、刪除、提交與推送不包含在本計畫授權內；外部供應商仍遵循工作區常設授權，但本計畫驗證不需要供應商呼叫。保留使用者已暫存的 `public/Web_Logo.svg` 與其他既存工作。

需要越過允許路徑、改後端契約或媒體、放寬權限、執行未核准副作用，或必要驗收無法成立時才停止回報；不得用假進度掩蓋錯誤、弱化斷言或擴張範圍。完成後寫入單份精簡結果，記錄實際命令／退出碼、基線與候選量測、合成邊界、審查及缺口，同步計畫與 STATE；僅撰寫本計畫不建立產品完成結果。
