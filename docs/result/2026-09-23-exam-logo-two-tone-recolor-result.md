---
id: result.pigeon-exam.logo-two-tone-recolor.2026-09-23
type: result
status: completed
execution_status: svg_xml_build_browser_preview_verified
canonical: true
created: 2026-09-23
updated: 2026-09-23
scope: pigeon-exam
implements: plan.pigeon-exam.logo-two-tone-recolor.2026-09-23
plan_ref: docs/plans/2026-09-23-exam-logo-two-tone-recolor.md
state_ref: STATE.md
followups: []
---

# Exam 啟動圖標雙色試色結果

依[試色計畫](../plans/2026-09-23-exam-logo-two-tone-recolor.md)，僅修改 `public/Web_Logo.svg` 內 `.st0` 的 `fill`：`#ec003f` → `#298E86`（青綠），以及 `.st1` 的 `fill`：`#45556c` → `#B87A2F`（琥珀）。不改圖形、其他圖示、介面主題或引用。使用者原已暫存的 SVG 版本保留；這次兩處變更只在工作樹，未執行 `git add`。

## 實際驗證

執行目錄：`/Users/cksai/Desktop/Coding/pigeon-hand-projects/pigeon-exam`。

- Python 標準庫 `xml.etree.ElementTree` 解析 SVG、將 `git show :public/Web_Logo.svg` 的兩個指定顏色依序替換後與目前工作樹全文比較：退出碼 0，恰好兩處填色變更。`git diff -- public/Web_Logo.svg` 顯示只有這兩行；`git status --short` 為 `AM public/Web_Logo.svg`（原已暫存、本輪未暫存修改）。`git diff --check`：退出碼 0。
- `node --input-type=module -e 'import {build} from "vite"; await build({envDir:false,build:{outDir:"/tmp/exam-logo-teal-amber-20260923",emptyOutDir:true}})'`：退出碼 0，未讀取 `.env` 或覆寫專案 `dist`；`cmp -s public/Web_Logo.svg /tmp/exam-logo-teal-amber-20260923/Web_Logo.svg`：退出碼 0。建置仍出現既有的 `pdfjs-dist` `eval` 與大分包警告，未擴張範圍處理。
- 只對隔離建置輸出的 SVG 啟動本機靜態伺服器，瀏覽器以明色 `#F1F3F6` 與暗色 `#353535` 背景並排呈現；兩張圖均成功解碼，主代理檢視兩色可見。無真實 API 呼叫。

未驗證正式站、Firefox／Safari 或其他媒體格式；沒有部署、前端正式切換、提交、推送、資料庫或外部服務操作。這是 SVG 試色，不表示已將 Exam 介面主色同步改成青綠與琥珀。
