---
id: result.pigeon-exam.logo-component-svg-source.2026-09-23
type: result
status: completed
execution_status: logo_svg_source_lint_types_build_verified
canonical: true
created: 2026-09-23
updated: 2026-09-23
scope: pigeon-exam
implements: plan.pigeon-exam.logo-component-svg-source.2026-09-23
plan_ref: docs/plans/2026-09-23-exam-logo-component-svg-source.md
state_ref: STATE.md
followups: []
---

# Exam 導覽圖標改讀雙色 SVG 結果

依[計畫](../plans/2026-09-23-exam-logo-component-svg-source.md)將 `src/features/Logo/Logo.tsx` 內嵌舊色圖形改為 `<img src="/Web_Logo.svg" width={28} height={28} alt="" />`，圖片沿用 `LogoLink.tsx` 的圖示尺寸，文字「小試鴿手」與首頁連結維持原樣。`alt=""` 避免導覽連結重複朗讀。公開圖檔 `public/Web_Logo.svg` 已有青綠 `#298E86`、琥珀 `#B87A2F`，本輪未修改或暫存該 SVG。

驗證均在 `pigeon-exam/` 執行：
- 替換前確認 `Logo.tsx` 仍含 `fill-rose-500` 與 `fill-sky-500`：退出碼 0；替換後來源探測確認舊 `<svg>` 已不存在，改為確定的圖片 URL：退出碼 0。
- `pnpm exec eslint src/features/Logo/Logo.tsx src/features/Logo/LogoLink.tsx`：退出碼 0。
- `pnpm exec tsc -p tsconfig.app.json --noEmit --tsBuildInfoFile /tmp/exam-logo-component-app-20260923.tsbuildinfo`，及對 `tsconfig.node.json` 的對應檢查：皆退出碼 0。
- `node --input-type=module -e 'import {build} from "vite"; await build({envDir:false,build:{outDir:"/tmp/exam-logo-component-build-20260923",emptyOutDir:true}})'`：退出碼 0。建置後的 SVG 與工作樹逐位元組相同，XML 有效且含兩個指定色值；建置程式碼含 `/Web_Logo.svg` 引用：驗證退出碼 0。既存 `pdfjs-dist` `eval` 與大型分包警告未在本輪處理。
- `git diff --check`：退出碼 0；本輪僅變更圖標元件及治理／結果文件，沒有更動 `LogoLink.tsx` 或其他並行路徑。

未執行真實瀏覽器導覽互動、正式切換、部署、提交或推送。既有 `index.html` 的舊 SVG 分頁圖示引用非本輪範圍；元件已改用現行 SVG，不代表該獨立的分頁引用問題已修復。
