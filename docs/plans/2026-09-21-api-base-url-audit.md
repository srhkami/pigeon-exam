---
id: plan.pigeon-exam.api-base-url-audit.2026-09-21
type: plan
status: completed
execution_status: completed
canonical: true
created: 2026-09-21
updated: 2026-09-21
scope: [pigeon-exam]
result: docs/result/2026-09-21-api-base-url-audit-result.md
---

# Exam API 基底網址盤點與修正

## 目標與範圍

盤點 Exam 的 API 主機、領域前綴、共用請求與動態網址來源，修復關聯法規儲存被串成 `/user/v3/exam/...` 的問題，並確認其他呼叫不依賴錯誤基底。路徑以本子專案根目錄為準。

僅修改 `src/hooks/useAxios.ts`、`scripts/hand-auth-parity-contract.mjs`、本計畫、對應結果及 `STATE.md`；完整網址與認證、重送、檔案同源政策保持原樣。如盤點發現其他必要修改位置，先補明確範圍再執行，不延伸成 API 遷移或 UI 改造。

## 必要做法

- 追蹤 `src/` 的 Axios、請求包裝函式、法規儲存控制器與檔案網址；用語法樹列舉呼叫，避免文字搜尋漏掉不同格式。
- 若確認沒有依賴隱含 `/user` 的呼叫，共用 Axios 改用 `ROOT_IP`，使 `/v3/...` 等根路徑正確解析；既有 `USER_API` 等完整網址不變。
- 沿用既有離線測試載入器與合成傳輸，執行真實 Axios，斷言最終網址，而非只斷言控制器回傳字串。先取得預期失敗，再最小修正。
- 保存本輪修改前快照，保留既有未提交內容。只保護本子專案，不要求其他並行專案停止。

## 驗收與驗證

- 開發預設埠、自訂埠與正式設定下，選擇題／申論題新增、修改與只重試關聯的最終網址皆無多餘 `/user`。
- 既有完整會員、Exam V1/V2/V3、Web、Police 網址保持一致；檔案根路徑仍以 API 主機解析並拒絕外站。
- 憑證更新後重送仍使用相同正確網址；認證既有契約不變。
- 執行 `node scripts/hand-auth-parity-contract.mjs`、`node --experimental-strip-types scripts/exam-law-reference-contract.mjs`、既有認證契約、聚焦 ESLint、`pnpm build` 及差異／文件連結檢查。

## 核准與界線

使用者已核准短計畫完成後直接實作及離線驗證。不得讀取秘密、修改後端、寫入資料庫、代送真實業務請求、部署、正式切換、提交或推送。離線通過不冒充瀏覽器及長駐服務驗收。
