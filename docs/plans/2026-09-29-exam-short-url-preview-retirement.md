---
id: plan.pigeon-exam.short-url-preview-retirement.2026-09-29
type: plan
status: completed
execution_status: completed_source_contract_type_build_browser_verified
canonical: true
created: 2026-09-29
updated: 2026-09-29
scope: pigeon-exam
affected_projects: [pigeon-exam]
workstream: exam-short-url-preview-retirement
result: docs/result/2026-09-29-exam-short-url-preview-retirement-result.md
---

# Exam 短網址預覽退役

## 目標與範圍

依使用者明確決策，Exam 的檔案功能已退役，HappyWork／函釋短網址也沒有任何正式流程導向 Exam 網域，因此刪除 Exam 的 `/f/:url`、`/l/:url` 路由與 `FilePreview` 功能來源。

本輪同步：

- 移除 `src/routes/routes.tsx` 的 `FilePreview` 延遲載入與兩條 route。
- 刪除 `src/features/FilePreview/**` 五個檔案。
- 移除只供此功能使用的 `@react-pdf-viewer/core`、`@react-pdf-viewer/default-layout` 與鎖定檔項目。
- 移除已無消費者的 HappyWork 目錄／檔案／表單型別；將 API 相容讀取仍需要的 `HappyFileLink` 收回 `exam-types.ts`，保留 `file_link` 回應欄位與既有題目資料相容，不刪後端資料或契約。
- 更新既有退役／認證契約，不再載入已刪除的預覽 helper，並新增來源缺席護欄。

不修改 Hand、Manage、後端短網址 API、既有短網址資料、資料庫、正式環境或其他 Exam 功能；舊 Exam `/f/*`、`/l/*` 不提供轉址，回到一般不存在頁面處理。

## 驗收與驗證

- 先在既有 `exam-file-link-retirement-contract.mjs` 加入目錄、路由、型別與依賴不存在斷言並取得 RED，再刪除產品來源取得 GREEN。
- 搜尋 Exam `src`、`scripts`、`package.json` 與鎖定檔，不得殘留 `FilePreview`、短網址 route、預覽 helper 或 `@react-pdf-viewer`；保留的 `file_link` 僅限 API 相容讀取型別與退役契約。
- 執行相關既有契約、修改檔 ESLint、`pnpm exec tsc -b --pretty false`、隔離 Vite 建置與 `git diff --check`。

## 核准與邊界

使用者於 2026-09-29 明確要求刪除 Exam 相關功能與路由，已核准上述前端 legacy source deletion。資料庫、後端 API／資料刪除、正式切換、部署、提交與推送均維持關閉。

## 完成處置

兩條 route、FilePreview 來源、專用 HappyWork 型別與 PDF viewer 相依均已退役；來源缺席契約、相鄰回歸、型別、隔離建置及目前 Vite 入口的雙路由 404 已驗證，見[結果](../result/2026-09-29-exam-short-url-preview-retirement-result.md)。後端 API 與歷史資料保持不變。
