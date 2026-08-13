---
id: result.pigeon-exam.frontend-chunk-optimization.2026-08-13
type: implementation-result
status: scope_change_required
plan: docs/plans/2026-08-13-frontend-chunk-optimization.md
completed_at: 2026-08-13
verification:
  build: pass
  scoped_lint: pass_with_existing_rule_warnings
  typescript: pass
  probe: fail_closed_scope_change_required
  diff_check: pass
approval_gates:
  browser_uat: not_run_closed
  frontend_cutover: not_run_closed
  production_deploy: not_run_closed
  commit: not_run_closed
  push: not_run_closed
---

# Exam 最小 chunk 效能優化結果

## 實際修改

- 移除 pnpm 路徑式 `manualChunks`，加入 `chunk-module-map.json` 建置證據。
- 將 FilePreview 與所有非 null 管理端 Page content 改為直接 `lazy()` 匯入，保留 URL、auth、menu 順序與 null content。

## 驗證證據

- scoped ESLint：退出碼 0；`pages.tsx`、`routes.tsx` 各一項 `react-refresh/only-export-components` warning。
- TypeScript：退出碼 0。
- production build：退出碼 0；保留 PDF.js `eval` 與 Vite 大型 chunk warning。
- root probe：退出碼 1，僅因 gzip 未達門檻；所有 FilePreview 與 manager target module IDs 均已位於 dynamic closure，首頁靜態 closure 無命中。
- `git diff --check`：退出碼 0。

## 效能結果

| 指標 | 基線 | 本輪 | 變化 |
|---|---:|---:|---:|
| 首頁 gzip | 729.79 kB | 688.76 kB | -41.03 kB（-5.6%） |
| 管理端與 FilePreview module IDs | 首頁靜態 closure | dynamic closure | 已達隔離契約 |

## 未達條件與停止原因

15% 門檻為 620.32 kB，本輪為 688.76 kB。依計畫，達標需要延遲載入使用者端、Statistics／Analyze 或改動受保護 route files，屬明確停止條件。因此標記 `scope_change_required`，不為達標擴張範圍。

## 未做事項

未執行 browser UAT、正式切換、production、commit 或 push。
