---
id: plan.pigeon-exam.frontend-chunk-optimization.2026-08-13
type: implementation-plan
title: Exam 最小 chunk 效能優化
status: scope_change_required
execution_status: scope_change_required
canonical: true
path_convention: project-root-relative
created: 2026-08-13
updated: 2026-08-13
owner: pigeon-exam
owner_state: STATE.md
workstream: frontend-chunk-optimization
parent_plan:
  id: plan.frontend-chunk-optimization.coordination.2026-08-13
  path: ../docs/plans/2026-08-13-frontend-chunk-optimization-coordination.md
result_path: docs/result/2026-08-13-frontend-chunk-optimization-result.md
review:
  status: pass
  handle: deleg_e234bae7
  history:
    - handle: deleg_5d63de38
      verdict: request_changes
      disposition: manager_initial_closure_verification_corrected
    - handle: deleg_e234bae7
      verdict: pass
      disposition: focused_plan_rereview_closed
approval_gates:
  planning_docs: approved_consumed_2026-08-13
  frontend_source_write: approved_consumed_2026-08-13
  package_install: not_required_closed
  browser_uat: closed
  frontend_cutover: closed
  production_deploy: closed
  commit: approved_consumed_2026-08-13
  push: closed
allowed_paths:
  - STATE.md
  - vite.config.ts
  - src/routes/routes.tsx
  - src/lib/pages.tsx
  - docs/plans/2026-08-13-frontend-chunk-optimization.md
  - docs/result/2026-08-13-frontend-chunk-optimization-result.md
protected_paths:
  - package.json
  - pnpm-lock.yaml
  - src/features/**
  - src/routes/select.tsx
  - src/routes/essay.tsx
  - src/routes/paper.tsx
  - src/auth/**
  - src/App.tsx
---

# Exam 最小 chunk 效能優化實作計畫

## 1. 目標與基線

修正 `.pnpm` 巨型 chunk，並在不重寫三組 route object 的前提下，從 `src/lib/pages.tsx` 隔離管理端頁面，再於主路由延遲載入 `FilePreview`。基線初始 JavaScript為 2545.66 kB raw／729.79 kB gzip，其中 `.pnpm-CziQE5ST.js` 為 2308.80 kB raw／663.08 kB gzip。

## 2. 實作設計

- `vite.config.ts`：移除目前 pnpm 不相容的 `manualChunks`，不新增全域 vendor 兜底；加入 root C0 的最小 chunk-module-map 外掛，以 Rollup `OutputChunk.modules` 提供模組歸屬證據。
- `src/lib/pages.tsx`：保留 `Page`、URL、label、icon、auth 與所有 menu 陣列；只把 `SelectPagesForManager`、`EssayPagesForManager`、`PaperPagesForManager` 使用的實際頁面改成直接 `lazy(() => import(actual-file))`，以共用 `Suspense` fallback 包裝後再交給既有 `Page`。使用者頁面與 `WebPages` 第一輪不變。
- 管理端 `question`／`record` 目前為 `null` 的內容維持 `null`，不得自行補功能。
- `src/routes/routes.tsx`：從 `@/features` 靜態匯入移除 `FilePreview`，改為直接 lazy import；保留 `/l/:url`、`/f/:url` 與 `code` prop。
- 保護 `select.tsx`、`essay.tsx`、`paper.tsx`，因它們只讀既有 Page content；本輪不重寫 route object。

## 3. 執行步驟

### E0：基線與 RED

1. 記錄 dirty／untracked 與 allowed-path 雜湊基線。
2. 執行 build 與 root probe 的 Exam RED 模式；預期失敗原因為 `.pnpm` 或初始 gzip，不得由環境錯誤冒充。
3. 盤點 manager content 實際檔案路徑後才寫 lazy import，不猜路徑；明確追蹤 `pages.tsx`、`select.tsx`、`essay.tsx`、`paper.tsx` 及所有 sidebar/menu consumer，記錄哪些首頁入口會匯入 manager Page metadata。
4. 將 `SelectRecordManage` 的既有 direct import 納入 manager content inventory，不得只處理從 `@/features` barrel 進入的元件。

### E1：最小來源修改

1. 移除錯誤 `manualChunks`。
2. 在 `pages.tsx` 只替換管理端的非 null component imports；每個 lazy component 維持原 `AuthLayout`，因權限仍由 `Page` constructor 的 `auth` 包裝。
3. 在 `routes.tsx` 延遲載入 `FilePreview` 並提供載入 fallback。
4. 不修改管理 URL、auth code、menu 順序、一般使用者頁面或功能元件。

### E2：驗證與結果

```bash
pnpm exec eslint vite.config.ts src/routes/routes.tsx src/lib/pages.tsx
pnpm exec tsc -p tsconfig.app.json --noEmit --pretty false
pnpm run build
cd .. && python3 scripts/probe_frontend_chunk_optimization.py --project pigeon-exam
cd pigeon-exam
git diff --check
```

另外由來源 probe／審查逐項比對所有 `SelectPagesForManager`、`EssayPagesForManager`、`PaperPagesForManager` 的 URL、auth、menu 順序與 null content 未變。root probe 必須由 `chunk-module-map.json` 證明所有 manager component module IDs 不在首頁 entry／`modulepreload` 的遞迴靜態 closure；`pages.tsx` 或 menu consumer 本身可在首頁，但其 `lazy()` 的 manager 目標只能存在於 dynamic closure。若任一 manager component 仍在初始 closure，回報 `SCOPE_CHANGE_REQUIRED`，不得以來源出現 `lazy()` 冒充完成。建立 result 並揭露仍存在的延遲大型 chunk／PDF.js 警告。

## 4. 驗收條件

- AC-E1：首頁不引用 `.pnpm-*.js` 巨型合併資產。
- AC-E2：初始 gzip 至少比 729.79 kB 下降 15%。
- AC-E3：所有既有非 null 管理端 Page content 由直接動態匯入建立，且真實 module IDs 不在首頁靜態 closure；一般使用者 Page content 不在本輪重寫。
- AC-E4：`FilePreview` 不在首頁靜態模組圖；`/l/:url`、`/f/:url` 與 `code` 不變。
- AC-E5：管理端 URL、權限代碼、menu 順序及既有 null content 完全不變。
- AC-E6：沒有功能元件、API、套件、lockfile、PWA 或部署變更。
- AC-E7：scoped ESLint、TypeScript、build、root probe 與 diff hygiene 通過。
- AC-E8：menu／sidebar 可繼續使用同一份 Page metadata，但不會把 manager component 提前載入；module map 無法證明時 fail closed。

## 5. 停止條件

- `Page.content` 的 module-scope ReactNode 結構無法安全容納 lazy component，必須重寫路由或側邊欄契約。
- 達標需要延遲載入使用者端、Statistics／Analyze 或修改 protected route files。
- 需要修改功能元件、認證、套件、lockfile、Service Worker 或 production。
- 兩輪聚焦修正後仍有循環依賴、型別或 build failure。

不 commit、push、deploy 或執行 browser UAT。