---
id: result.pigeon-exam.api-base-url-audit.2026-09-21
type: result
status: completed
canonical: true
created: 2026-09-21
updated: 2026-09-21
scope: [pigeon-exam]
implements: plan.pigeon-exam.api-base-url-audit.2026-09-21
plan: docs/plans/2026-09-21-api-base-url-audit.md
acceptance: source_offline_contract_and_build_verified
---

# Exam API 基底網址盤點與修正結果

## 結論

共用 `useAxios` 的基底由 `USER_API` 改成 `ROOT_IP`。選擇題及申論題關聯儲存的 `/v3/exam/questions/.../law-references` 不再變成 `/user/v3/exam/...`；原有完整 API 網址保持原樣。正式產品原始碼只有 `src/hooks/useAxios.ts` 的匯入、基底設定及一行說明變更，沒有修改控制器、認證流程或後端。

## 盤點

語法樹掃描 `src/` 共列出 73 個相關呼叫節點；排除 Axios 建構、錯誤辨識及鏈式 `.then` 後為 69 個請求／包裝呼叫位置。這是包含轉送層的來源位置數，不是 69 支獨立 API；另追蹤共用實例的認證重送及兩個題型表單的控制器輸入。

| 設定 | 基底／前綴 | 判定 |
|---|---|---|
| `ROOT_IP` | 開發預設 `http://localhost:8000`，可用 `VITE_API_PORT` 改埠；正式 `https://api.pigeonhand.tw` | 保持原環境選擇 |
| 共用 `useAxios` | 原本 `ROOT_IP + /user`，修正為 `ROOT_IP` | 本次根因 |
| `USER_API`、`V3_USER_API` | `/user`、`/v3/user` | 會員呼叫皆明確組完整網址，不依賴隱含 `/user` |
| `EXAM_API`、`EXAM_API_V2`、`V3_EXAM_API` | `/exam`、`/v2/exam`、`/v3/exam` | 保持領域前綴 |
| `WEB_API`、`POLICE_API`、`V3_API`、`AI_API_V2` | `/web`、`/police`、`/v3`、`/v2/ai` | 設定及完整網址無本次串接缺陷；AI 常數沒有因此新增呼叫 |
| `MEDIA_IP` | 等於 `ROOT_IP` | 保持原樣 |
| 法規顯示、編輯讀取與搜尋 | `V3_API` 組完整網址 | 原本不受錯誤基底影響 |
| 選擇／申論法規儲存控制器 | 回傳 `/v3/exam/...` 根路徑，再交共用 Axios | 兩題型新增、修改、只重試關聯皆受影響，已由共用基底修復 |
| `useCacheApi`、`useToastApi`、`useDataBrowser` | 傳遞呼叫者 `config.url` | 呼叫端已使用完整領域網址，無隱含會員前綴依賴 |
| 檔案預覽／下載 | `normalizeHappyWorkFileUrl` 以 `ROOT_IP` 正規化並驗同源 | 保持原政策；不允許的外站／相對檔名不送出請求 |
| Hand 註冊／認證、外部連結與 PDF 資源 | 獨立導覽或資源網址 | 不經此共用基底，不自行改域名或遷移功能 |

未發現第二個需要修改的基底網址位置。這個結論只涵蓋來源與網址組合契約，不宣稱所有後端端點目前皆可用。

## 實際驗證

命令均從 `pigeon-exam/` 執行，未代送任何真實業務 API：

- 修正前 `node scripts/hand-auth-parity-contract.mjs`：退出碼 1；57 項中 24 項因實際最終網址多出 `/user` 而失敗，其餘通過。不是匯入或測試初始化失敗。
- 修正後同一命令：退出碼 0，57 項全部通過。新增情境涵蓋開發預設埠、自訂埠、正式設定；兩題型新增／修改／關聯重試；完整與根路徑、查詢參數；認證更新後最終網址與標頭；檔案同源拒絕。載入真實 `useAxios`／控制器，以真實 Axios 加合成傳輸及 `axios.getUri()` 驗證，沒有真實網路請求。
- `node --experimental-strip-types scripts/exam-law-reference-contract.mjs`：退出碼 0，PASS。
- `pnpm test:auth-v3`、`pnpm test:email-code-v3`：各退出碼 0，PASS。
- `pnpm exec eslint src/hooks/useAxios.ts scripts/hand-auth-parity-contract.mjs`：退出碼 0。
- `pnpm build`：退出碼 0，TypeScript 與 Vite 建置成功；保留既有 `pdfjs-dist` 的 eval 與大型輸出區塊警告。
- `git diff --check`：退出碼 0。另檢查本輪未追蹤文件／測試的空白、文件標頭與計畫／結果／狀態連結。
- 本輪前快照精確比對：產品來源僅上述基底變更；25 個既有非目標變更內容及既有暫存區未變。原有測試內容保留，僅新增情境及提供標準 `URL` 給測試執行環境。

初次以系統 `python3` 驗證 YAML 因沒有 PyYAML 退出碼 1，尚未進行解析；改用既有工具 Python 環境後解析及導航驗證通過，沒有安裝新依賴。這是驗證工具環境問題，不是產品測試失敗。

暫存盤點／修改前快照／預期失敗輸出位置：`/var/folders/03/_3yk_l_x62144x2tvysk4mh00000gp/T/exam-api-base-8xf2ac2o/`。正式可重跑回歸保留於 `scripts/hand-auth-parity-contract.mjs`。

## 界線

未修改其他前端或後端；未寫資料庫、重建服務、登入真實帳號、執行瀏覽器人工驗收、部署、正式切換、提交或推送。本機 `dist/` 已由建置產生，但不代表正式站已載入修正。既有未提交工作保留；根狀態檔未由本輪修改，單一子專案計畫由本地 `STATE.md` 導航。
