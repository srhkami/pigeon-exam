---
id: result.pigeon-exam.file-link-frontend-retirement.2026-09-22
type: result
status: completed
execution_status: source_offline_contract_build_review_verified_browser_deferred
canonical: true
created: 2026-09-22
updated: 2026-09-22
scope: pigeon-exam
implements: plan.pigeon-exam.file-link-frontend-retirement.2026-09-22
plan_ref: docs/plans/2026-09-22-file-link-frontend-retirement.md
state_ref: STATE.md
review:
  status: PASS
  delegation_id: deleg_1c4a91bd
  model: gpt-5.6-terra
  blocking_findings: []
  snapshot_sha256: 280b02d12ee759535853c37e9ec49b38af5f3597d804fa7add1622f3930e1318
followups: []
---

# 小試鴿手前端檔案關聯停用結果

## 核准與交付邊界

2026-09-22 使用者於正式計畫建立後要求「請開始執行」，本輪限 Exam 前端原始碼、具名專用元件移除及離線驗證。原始碼、離線驗證與一次聚焦獨立複審已完成，本計畫範圍結案；未宣稱瀏覽器或正式環境功能已切換。前端原始碼與離線驗證核准已消耗，其餘核准限制維持關閉。

## 實際修改

- 選擇題三種、申論題兩種卡片不再掛載檔案關聯；既有 `ArticleLink`、`showLinks` 及編輯後法條刷新接線保留。
- 兩題型新增／編輯視窗移除檔案關聯狀態及選取入口，兩種表單型別不再宣告 `file_link`；後端回應型別及 `HappyFileLink` 保留。
- `buildQuestionPayload` 在既有題目保存邊界以物件副本排除 `article_link` 與 `file_link`。即使預設表單值含舊檔案關聯，`POST`／`PATCH` 也不會送出該欄位；沒有改送空陣列或 `null`，沒有修改原始物件。
- 移除 `FileLink.tsx`、`FileLinkEdit.tsx`、`ModalSelectFile.tsx` 三個專用元件；同步將既有錯誤回報退役契約改為精確斷言搜尋元件不存在，而非略過所有缺檔。
- 更新既有法條契約中保留檔案欄位的過期斷言；新增 `scripts/exam-file-link-retirement-contract.mjs` 與 `test:file-link-retirement` 指令，未新增依賴。
- 保留混合法條／檔案的「有／無關聯物件」篩選及搜尋、`/f/:url`、`/l/:url`、`FilePreview` 與其他專區。歷史檔案仍可能影響後端搜尋／篩選命中，不宣稱後端整套功能已退役。

## 主代理驗證

執行目錄：`/Users/cksai/Desktop/Coding/pigeon-hand-projects/pigeon-exam`。Node `v26.8.2`、pnpm `12.4.1`；Git 基線 `ac9f2d66f494523df6c1748ff8799fd3868707c0`，未暫存、提交或推送。

| 實際命令／檢查 | 退出碼／結果 |
| --- | --- |
| 修改前既有法條契約與 `pnpm run test:errorlog-retirement` | 0，原有檢查通過 |
| 新增契約後、產品修改前：`node --experimental-strip-types scripts/exam-file-link-retirement-contract.mjs` | 1，退役驗收先失敗 |
| 修改後：`pnpm run test:file-link-retirement` | 0，15 項通過、0 項失敗 |
| `node --experimental-strip-types scripts/exam-law-reference-contract.mjs` | 0，既有法條契約通過 |
| `pnpm run test:errorlog-retirement` | 0，既有錯誤回報退役契約通過 |
| 下列九個原始碼檔案的聚焦 ESLint | 0 |
| `pnpm build` | 0，`tsc -b && vite build` 通過 |
| Exam 與工作區根目錄 `git diff --check` | 0 |
| 實際 `dist/chunk-module-map.json` | 不含 `/FileLink/` 專用元件，保留 `FilePreview` |
| 非目標工作線與既有近期結果 | 與規劃快取相同，未改其他工作線內容 |

聚焦檢查完整命令：

```sh
pnpm exec eslint src/features/Select/for-manager/Question/QsCardForEdit.tsx src/features/Select/for-manager/Question/QsCardForView.tsx src/features/Select/for-user/Question/QsCardForRecord.tsx src/features/Essay/for-manager/Question/QsCardForEdit.tsx src/features/Essay/for-user/Question/QsCardForView.tsx src/features/Select/for-manager/Manage/Edit/ModalSelectEdit.tsx src/features/Essay/for-manager/Question/ModalEssayQuestionEdit.tsx src/features/Link/ArticleLink/lawReferenceController.ts src/types/exam-types.ts
```

新增測試轉譯並執行五個實際卡片及兩個實際編輯元件；React 掛鉤、表單與傳輸使用合成替身，儲存控制器及法條請求映射使用實際函式。兩題型 `POST`／`PATCH` 均觸發真正保存事件，確認送出資料不含檔案欄位、原物件不變、其他題目欄位與 V3 法條請求保留、防重複保存與成功刷新仍有效。另覆蓋非空／空陣列／`null`、五種卡片顯示設定、專用元件不存在及型別邊界；不是瀏覽器操作證據。

既有法條測試保留讀取、部分成功只重試法條、未知建立不重送與管理卡片刷新等驗證。本輪建置仍有 `pdfjs-dist` 使用 `eval` 及大型分包警告，未為消除警告擴張範圍。

## 聚焦獨立複審

複審 `deleg_1c4a91bd`（模型 `gpt-5.6-terra`）回覆 `PASS`，無阻擋問題。範圍只限檔案功能是否退出、送出邊界是否會破壞既有資料，以及法條／測試回歸；本輪實作由主代理直接完成，子代理只讀審查，首次審查即通過，無修正輪次、主代理重寫或範圍漂移。

審查者重跑上述三份離線契約與 `git diff --check`，皆退出碼 0；15 項退役測試全數通過，29 項快照一致。主代理已親自完成前述測試、程式碼檢查、建置與實際差異核對；收束時再核對產品快照、計畫／結果／STATE 狀態及指標、新檔空白、差異與暫存區，僅修改結案文件，不重跑未變動的產品測試。

審查快照涵蓋計畫具名的 16 個來源／測試／套件路徑（含刪除標記），加上 13 個直接依賴／配置路徑，共 29 項；逐檔 SHA-256 或 `absent` 組成依路徑排序、無多餘空白的 JSON 後再計算 SHA-256。摘要為 `280b02d12ee759535853c37e9ec49b38af5f3597d804fa7add1622f3930e1318`。計畫、結果及 STATE 收束文字不納入產品指紋。

本機審查清單：`/var/folders/03/_3yk_l_x62144x2tvysk4mh00000gp/T/exam-file-link-review-5kitokk9/snapshot.json`；它是本輪暫存審查輔助，非正式執行來源。

## 未執行與核准限制

- 未操作真實題目新增／修改、登入、資料庫、外部供應商或瀏覽器。
- 未修改後端、資料庫、原始文件、預覽路由、其他前端或根目錄狀態；未執行正式切換、部署、提交、推送或歷史改寫。
- 未測試真實 `PATCH` 後資料庫保存結果；本輪證據限前端省略欄位與不修改合成輸入，不把離線成功寫成資料庫實測。
- 瀏覽器人工複驗未開放且未執行，保留驗證缺口；本計畫未要求以此阻擋離線交付，也不新增強制後端清理或人工補驗工作。
