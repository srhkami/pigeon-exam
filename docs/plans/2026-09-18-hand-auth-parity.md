---
id: plan.pigeon-exam.hand-auth-parity.2026-09-18
type: plan
status: completed
execution_status: completed
canonical: true
created: 2026-09-18
updated: 2026-09-18
scope: pigeon-exam
state_ref: STATE.md
reference_project: pigeon-hand
result_path: docs/result/2026-09-18-hand-auth-parity-result.md
---

# Exam 設定與登入權限同步 Hand

## 目標與範圍

依使用者選定的 B 方案，Exam 自動區分開發／正式 API 環境，登入與權限判斷沿用 Hand 的現行行為；註冊及實名認證統一導回 Hand，不在 Exam 建立表單。

只修改 Exam；Hand 作唯讀參照。保留測驗 API、業務路由與各頁既有權限種類，不新增權限、不搬入 Hand 的搜尋快取、書籤、LINE 綁定、社群註冊或其他會員功能。不改後端、依賴套件、建置分包或資料庫。

## 必要做法

1. `src/lib/config.ts` 改以 `import.meta.env.DEV` 決定 API 環境：開發使用 `http://localhost:${import.meta.env.VITE_API_PORT ?? '8000'}`，正式使用 `https://api.pigeonhand.tw`；保留 `EXAM_API`、`EXAM_API_V2`、`AI_API_V2` 及其他現有衍生網址。
2. 同步密碼／驗證碼登入的安全錯誤取值、429 提示與 Hand 的登入結果處理；憑證更新沿用既有單次重送、並行請求共用更新機制，補齊 Hand 的 `skipAuthReplay` 支援，不擅自改動測驗呼叫端的重送政策。登入、驗證、登出仍使用現有 V3 契約；密碼變更的現有 API 與表單規則不變。
3. 註冊入口統一為 `https://pigeonhand.tw/signup`；會員選單、到期通知、未認證／已登入提示中的認證入口統一為 `https://pigeonhand.tw/user/accredit`。集中於設定檔管理，使用真正的跨站連結；另開分頁時設定 `noopener noreferrer`。開發模式也維持導往 Hand 正式站，與目前註冊入口一致，不另增 Hand 開發站設定。不得把存取憑證、更新憑證或會員資料夾入網址／跨站訊息；Hand 依自己的登入狀態驗證，不保證跨來源免登入。
4. `AuthLayout`、`AuthComponent`、`handleHasAuth`、`authContract`、`refreshCoordinator`、`AuthShow`、`BadgeAccredit` 目前已與 Hand 相同，驗證一致即可，不為同步而重寫。`AuthContext` 僅調整認證連結，不搬入 Hand 專屬搜尋快取清除依賴。會員選單保留 Exam 未登入時顯示登入入口的組合方式，只對齊登入／登出相關行為。

允許修改的既有原始碼：

- `src/lib/config.ts`
- `src/hooks/useAxios.ts`
- `src/features/User/Login/EmailForm.tsx`
- `src/features/User/Login/PasswordForm.tsx`
- `src/features/User/Login/Login.tsx`
- `src/features/User/UserProfile/MenuUser.tsx`
- `src/auth/AuthContext.tsx`
- `src/features/Layout/ErrorAlert.tsx`

新增一份聚焦回歸腳本：`scripts/hand-auth-parity-contract.mjs`。治理文件限本計畫、`STATE.md` 及上述結果路徑；不新增根目錄計畫，不修改其他工作線。路徑均以 Exam 儲存庫根目錄為基準。

## 驗收與驗證

- 離線執行實際設定與認證程式，驗證開發預設／自訂 API 埠、正式網址及 Exam 衍生網址；正式結果不得含本機 API。
- 以合成傳輸驗證密碼及驗證碼登入、無回應錯誤、429、登入後重新驗證、更新成功後單次重送、第二次 401／更新失敗／`skipAuthReplay` 不重送及登出清除憑證。不得呼叫真實登入、寄信、註冊或認證 API。
- 核對上述共用權限檔與 Hand 的一致性，驗證既有訪客／一般會員／指定權限的顯示與路由拒絕行為不被放寬；Exam 所有註冊與認證入口皆指向指定 Hand 網址，不再留下站內 `/user/accredit` 導覽，也不新增站內註冊／認證路由。
- 執行新腳本、既有 `pnpm test:auth-v3`、`pnpm test:email-code-v3`、修改檔案限定 ESLint 與 `git diff --check`。依共用前端規範，執行 Hand／Manage／Exam 的 `pnpm build`；若存在仍適用的共用一致性探測亦執行。Traffic 只做共用認證差異的唯讀評估，不改其原始碼。
- 原始碼完成後做一次登入／權限與跨站連結的獨立聚焦審查，主代理核對實際差異及證據；不擴大為全系統審查。來源、合成傳輸與建置通過不等同真實帳號或正式環境驗收。

## 核准、完成與停止條件

2026-09-18 使用者已明確要求直接執行本計畫；現已完成限定修改、離線驗證、三前端建置與獨立聚焦審查。結果見 `docs/result/2026-09-18-hand-auth-parity-result.md`，既有共用 toast 探測差異與未驗範圍如實保留。其他獨立副作用仍未核准。

不操作真實帳號、資料庫、正式環境、正式切換、端點註冊、刪除、提交或推送。若必須改動允許路徑以外的檔案、發現 Hand 契約有安全問題或必要驗證無法成立，停止並回報，不藉同步之名自行擴張。既有未提交工作須保留。

完成時建立精簡結果，記錄實際命令、退出碼、審查、未驗證事項；同步計畫生命週期與 STATE，保留既有效能優化工作線原狀。
