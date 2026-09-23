---
id: result.pigeon-exam.startup-improvement.2026-09-23
type: result
status: completed
execution_status: source_isolated_browser_verified_review_pass
canonical: true
created: 2026-09-23
updated: 2026-09-23
scope: pigeon-exam
implements: plan.pigeon-exam.startup-improvement.2026-09-23
plan_ref: docs/plans/2026-09-23-exam-startup-improvement.md
state_ref: STATE.md
review:
  status: PASS
  delegation_id: deleg_9a864da3
  previous_failed_review: deleg_4add222b
  model: gpt-5.6-terra
  blocking_findings: []
followups: []
---

# Exam 啟動、模擬進度與登入互動改善結果

## 交付與邊界

依[核准計畫](../plans/2026-09-23-exam-startup-improvement.md)完成 Exam 原始碼、隔離建置、合成傳輸與 Chromium 瀏覽器驗證；不修改媒體內容、不同步其他前端。載入畫面使用既有 `public/Web_Logo.svg`；該檔是使用者原已暫存的工作，未由本輪改寫。前端正式切換、真實 API／帳號與部署不在核准範圍。

- `index.html`、`src/main.tsx`、`src/App.css`、`src/component/Loading/{StartupLoading,RouteLoading}.tsx`：HTML 與 React 共用固定定位載入樣式、圖示、旋轉與 50%→90% 分段假進度；入口停止 HTML 計時器，React 卸載清理；深連結不留動畫。字型改非阻擋，主題安全讀取、減少動態效果靜態呈現，沒有可見假百分比。
- `src/auth/AuthContext.tsx`、`src/auth/AuthLayout.tsx`、`src/auth/AuthComponent.tsx`、`src/hooks/useAxios.ts`：公開外殼先呈現，受保護元件等待驗證；10 秒驗證／更新逾時、取消與序號護欄、跨身分更新隔離，同身分合法輪替維持單次 401 重送及 `ROOT_IP`。`src/features/Home/Home.tsx` 延後會員資料至驗證完成後。
- `src/lib/pages.tsx`、`src/routes/routes.tsx`、`src/features/index.ts` 與四個 `*.lazy.tsx`：使用者測驗／紀錄、圖表及分析頁分包；共用匯出鏈延後拖曳及富文字實作，保留既有功能與元件介面。
- `src/features/User/Login/{Login,ModalLogin}.tsx`、`src/component/Modal/Modal.tsx`、`src/features/User/UserProfile/MenuUser.tsx`：登入視窗不因驗證切換卸載；等待與失敗保留輸入，成功關閉，取消／Escape／焦點返回只對登入啟用。登出發送舊 refresh 後立即撤除本地認證，不等待網路；晚到回應不重驗證。其他視窗維持原預設行為。

## 實際驗證

目錄：`/Users/cksai/Desktop/Coding/pigeon-hand-projects/pigeon-exam`，分支 `dev`。基線與候選以 Vite 程式介面 `build({envDir:false,build:{outDir:"/tmp/...",emptyOutDir:true}})` 分別建至 `/tmp/exam-startup-baseline-20260923` 與 `/tmp/exam-startup-final-c-20260923`；未載入 `.env`、未覆寫專案 `dist`。型別增量產物亦輸出到 `/tmp`。下列均為主代理實際執行結果；另曾錯用 `tsc -b --tsBuildInfoFile`（退出碼 1，該選項不相容），改為 `tsc -p` 後通過。

| 命令／條件 | 退出碼及結果 |
| --- | --- |
| `node scripts/exam-startup-continuity-contract.mjs`、`node scripts/exam-startup-routes-contract.mjs`、`node scripts/exam-login-contract.mjs` | 各 0 |
| `node --experimental-strip-types scripts/exam-startup-auth-contract.mjs`、`node --experimental-strip-types scripts/hand-auth-parity-contract.mjs` | 各 0；5/5 與 58/58，後者新增登出停滯斷言先失敗再修正通過 |
| `pnpm test:auth-v3`、`pnpm test:email-code-v3`、`node --experimental-strip-types scripts/exam-law-reference-contract.mjs`、`pnpm test:file-link-retirement` | 各 0；退役契約 17/17 |
| 本輪修改的 TypeScript／JavaScript 檔案之 `pnpm exec eslint` | 0，無本輪警告 |
| `pnpm exec tsc -p tsconfig.app.json --incremental --tsBuildInfoFile /tmp/exam-startup-app-20260923.tsbuildinfo` 與相同參數之 `tsconfig.node.json`（輸出 `/tmp/exam-startup-node-20260923.tsbuildinfo`） | 各 0 |
| `node --input-type=module -e 'import {build} from "vite"; await build({envDir:false,build:{outDir:"/tmp/exam-startup-final-c-20260923",emptyOutDir:true}})'` | 0，正式模式隔離建置 |
| `python3 scripts/exam-startup-browser.py /tmp/exam-startup-final-c-20260923 http://127.0.0.1:5192` | 0，手機／桌面、明／暗主題、減少動態效果、分段上限與卸載、深連結、慢驗證、測驗／紀錄／統計／分析／編輯器／富文字預覽均以合成回應通過；編輯器未送出寫入 |
| `python3 scripts/exam-login-browser.py http://127.0.0.1:5192` | 0，密碼／驗證碼登入、失敗與重試、取消／Escape、焦點、登出請求停滯及晚到回應、既有非登入視窗回歸 |
| `git diff --check`、`git diff --cached --check` | 各 0；使用者已暫存媒體維持原狀 |

`exam-startup-bundle.mjs` 對建置模組圖的入口加首頁必要模組遞迴去重統計：基線 719,812 gzip 位元組、候選 195,054 gzip 位元組，減少 524,758（72.90%）；候選入口閉包不含初始統計圖表、Tiptap 與拖曳模組，瀏覽器首頁請求亦未提前載入。相同冷快取、桌面視窗與合成網路條件下各三次，首頁可見時間中位數基線／候選為 821／817 毫秒，側欄可操作為 898／886 毫秒。兩項本機時間差很小，不推論真實網路或一般使用者體感的改善幅度；初始 HTML 提示與真正首頁分開驗證。

## 獨立審查與未做事項

首次雜湊綁定聚焦複審 `deleg_4add222b` 為 FAIL：`MenuUser` 原本等待登出網路返回才更新認證狀態。新增停滯契約先失敗，修正為立即撤除授權後，主代理重跑契約、隔離瀏覽器與建置。第二次唯讀聚焦複審 `deleg_9a864da3` 確認所列四個檔案 SHA-256 一致，結論 PASS，無剩餘阻擋問題：`MenuUser.tsx` `ba9aa8d4ed8dca8db41754409b35b35b8453a91c3591ac2639d5914349e49cb9`；`hand-auth-parity-contract.mjs` `9c5e2ccd97d475eae94c10597b8ca376c1d920cea84a0a2a76dd516dbdaf6dc1`；`AuthContext.tsx` `439f1ebd9d33d2f988b371b92f6a136f89a959bb155a1dec28fa1f8567f418fe`；`useAxios.ts` `034778591020270f3c567218e9a62959feb81fdfa04c662903dde9bd9e27e89c`。審查僅覆蓋認證與登出時序；其他部分由主代理的建置、差異及瀏覽器證據驗收，不把子代理摘要當成唯一證據。

瀏覽器測試使用 Chromium 與合成 API，沒有真實帳號、真實題目保存或正式站操作；Firefox、Safari 與真實網路未執行。Hand／Manage／其他前端只作必要唯讀參照，未同步，因本輪計畫只核准 Exam 原始碼。不修改後端、資料庫、registry、外部供應商設定或使用者暫存媒體；沒有部署、前端正式切換、提交、推送或改寫歷史。以上驗證缺口不等於已取得其他核准閘門。
