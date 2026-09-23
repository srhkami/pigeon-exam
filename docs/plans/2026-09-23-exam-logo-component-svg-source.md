---
id: plan.pigeon-exam.logo-component-svg-source.2026-09-23
type: plan
status: completed
execution_status: logo_svg_source_lint_types_build_verified
canonical: true
created: 2026-09-23
updated: 2026-09-23
scope: pigeon-exam
state_ref: STATE.md
workstream_id: exam-logo-component-svg-source
implementation_authorized: true
result_path: docs/result/2026-09-23-exam-logo-component-svg-source-result.md
---

# Exam 導覽圖標改讀雙色 SVG

依使用者本輪要求，只將 `src/features/Logo/Logo.tsx` 的舊色內嵌圖形改讀現行 `public/Web_Logo.svg`；維持 `LogoLink.tsx` 的連結、文字與原本 28×28 圖示配置。圖片為相鄰名稱的裝飾，避免重複朗讀。沿用既有公開資產 URL，不複製 SVG、不引入套件。

僅允許寫入元件、本計畫、結果與 `STATE.md`；不更動 `public/Web_Logo.svg`、其他圖檔、`index.html`、其餘元件或並行工作。驗收：來源引用正確、舊色內嵌圖形不再由此元件渲染、聚焦 ESLint／型別檢查與隔離建置通過，建置確實含現行 SVG。正式切換、部署、提交、推送均未核准。
