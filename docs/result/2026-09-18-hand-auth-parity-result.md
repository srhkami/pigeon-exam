---
id: result.pigeon-exam.hand-auth-parity.2026-09-18
type: result
status: completed
implements: plan.pigeon-exam.hand-auth-parity.2026-09-18
created: 2026-09-18
updated: 2026-09-18
scope: pigeon-exam
review_status: passed
---

# Exam 設定與登入權限同步結果

## 已完成修改

- `src/lib/config.ts` 使用 `import.meta.env.DEV`，開發預設 `localhost:8000`、接受 `VITE_API_PORT`，正式使用原 API 網域；Exam 專用衍生 API 保留。
- 密碼／驗證碼登入對齊 Hand 的斷線安全取值、429 與錯誤提示；`useAxios` 加入 Hand 同等的 `skipAuthReplay`，既有呼叫端政策不變。
- 註冊、會員選單、會員到期通知與兩種認證提示，都使用設定檔的 Hand 正式站網址，以原生連結另開分頁並設定 `noopener noreferrer`；不傳遞任何登入憑證。
- 會員選單登出錯誤沿用共用 toast 處理並在結束後重新驗證，保留 Exam 訪客登入入口。既有權限核心、密碼變更、測驗路由與權限種類未修改。
- 未搬入註冊／實名認證表單、Hand 搜尋快取或其他會員功能；Hand、Manage、Traffic 原始碼未修改。Traffic 與 Manage 已採自動 API 環境判斷，兩者缺少的 `skipAuthReplay` 不屬本次 Exam 同步範圍。

## 實際驗證

下列指令除特別註明外在 `pigeon-exam` 執行。

| 命令 | 退出碼 | 結果 |
|---|---:|---|
| `node scripts/hand-auth-parity-contract.mjs`（修改前） | 1 | 30 項中 13 項失敗，重現環境設定、錯誤處理、停止重送與跨站連結缺口 |
| `node scripts/hand-auth-parity-contract.mjs`（修改後） | 0 | 30 項全通過 |
| `pnpm test:auth-v3` | 0 | 並行更新成功及失敗協調通過 |
| `pnpm test:email-code-v3` | 0 | 既有寄送驗證碼來源契約通過，未寄真實郵件 |
| `pnpm exec eslint src/lib/config.ts src/hooks/useAxios.ts src/features/User/Login/EmailForm.tsx src/features/User/Login/PasswordForm.tsx src/features/User/Login/Login.tsx src/features/User/UserProfile/MenuUser.tsx src/auth/AuthContext.tsx src/features/Layout/ErrorAlert.tsx` | 0 | 限定原始碼檢查通過 |
| `pnpm build`，分別在 Exam、Hand、Manage | 各 0 | TypeScript 與 Vite 正式建置通過 |
| `python3 pigeon-hand/scripts/probe_frontend_unification.py`，工作區根目錄 | 1 | 既有 Hand／Exam `func/toast.ts` 與 Manage 不同，非本輪新增 |
| `git diff --check` | 0 | 已追蹤差異無空白錯誤 |
| `git diff --no-index --check /dev/null <新腳本或計畫路徑>` | 各 1 | 表示新增檔與空檔有差異；均無空白錯誤輸出 |

合成驗證執行實際 TypeScript／TSX 模組、登入表單回呼、AuthProvider 與 Axios 攔截器，僅以記憶體儲存、React 掛鉤替身及 Axios adapter 取代外部邊界；不是瀏覽器完整掛載或真實 HTTP 整合測試。涵蓋設定分支、兩種登入成功／429／500／斷線、未取得驗證碼、畸形回應、並行更新、第二次 401、更新失敗、停止重送、非 401、登出、會員驗證、連結與既有權限分支。

建置有既有 PDF.js `eval` 與大型分包警告，未為消除警告擴改建置。建置紀錄位於 `/tmp/exam-hand-auth-{exam,hand,manage}-build.log`。共用探測的 toast 差異已核對三前端該檔均無 Git 差異；不冒稱共用探測全通過，也不擴改其型別／工具行為。

## 審查與範圍

獨立聚焦審查 `deleg_203a19bb`（`gpt-5.6-terra`）回傳 `PASS`，未發現本輪可重現阻擋，並獨立執行 30 項回歸全部通過，未修改檔案。審查綁定 `/tmp/exam-hand-auth-review-manifest.json` 的八份產品原始碼與一份新測試腳本；主代理已讀回實際 Git 差異，並在審查後重算九份檔案 SHA-256，全部相符。審查後僅更新治理文件，無產品或測試修改。

基線 `/tmp/exam-hand-auth-parity-baseline.json` 的根目錄既有未提交／未追蹤文件未漂移，Hand、Manage 保持原狀；Exam 僅計畫允許路徑變更，各儲存庫分支與暫存區未改動。

## 未執行與核准邊界

未執行瀏覽器／真實帳號登入、寄信、註冊、實名認證、API／資料庫整合、正式部署／切換、端點註冊、提交或推送。未讀環境檔或真實憑證。Hand 使用自己的登入狀態，跨來源不承諾免登入。

本計畫已依限定來源、離線驗證與審查結果完成；STATE 移除本工作線並保留近期結果指標，原效能優化工作線不變。不因既有 toast 差異擴張本次功能範圍，也不將其失敗改寫為通過。
