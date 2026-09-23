---
id: result.pigeon-exam.logo-raster-assets.2026-09-23
type: result
status: completed
execution_status: four_raster_assets_build_preview_verified
canonical: true
created: 2026-09-23
updated: 2026-09-23
scope: pigeon-exam
implements: plan.pigeon-exam.logo-raster-assets.2026-09-23
plan_ref: docs/plans/2026-09-23-exam-logo-raster-assets.md
state_ref: STATE.md
followups: []
---

# Exam 雙色圖標點陣資產結果

依[計畫](../plans/2026-09-23-exam-logo-raster-assets.md)，從現行青綠 `#298E86`、琥珀 `#B87A2F` 的 `public/Web_Logo.svg`，以本機 Chromium 透明渲染與 Pillow 縮圖，僅覆寫四個既有檔案：

| 路徑 | 產出規格 |
| --- | --- |
| `public/favicon.ico` | 透明背景，16×16、32×32、48×48 三影格 |
| `public/icons/Logo192.png` | 192×192，RGBA 透明背景 |
| `public/icons/Logo512.png` | 512×512，RGBA 透明背景 |
| `public/icons/apple-touch-icon.png` | 180×180，RGB 白底；中央 120×120 圖形 |

## 實際驗證

執行目錄：`/Users/cksai/Desktop/Coding/pigeon-hand-projects/pigeon-exam`。

- `python3 /tmp/exam-logo-raster-generate-20260923.py`：退出碼 0；來源 SVG 顏色、1200×1200 透明主圖、四個產物尺寸／格式／透明或白底及 ICO 三影格斷言均通過。先產出至 `/tmp/exam-logo-assets-20260923`，檢查目標檔尚無並行改動後，僅複製四個檔案回 `public/`，以 `filecmp.cmp(..., shallow=False)` 逐檔讀回一致：退出碼 0。
- `node --input-type=module -e 'import {build} from "vite"; await build({envDir:false,build:{outDir:"/tmp/exam-logo-raster-build-20260923",emptyOutDir:true}})'`：退出碼 0。四檔在隔離建置目錄與 `public/` 逐位元組一致；Pillow 再讀回 PNG 尺寸與模式、ICO 影格集合，退出碼 0。未讀取 `.env`、未覆寫專案 `dist`。
- 主代理檢視 `Logo512.png`、`apple-touch-icon.png` 與 ICO 16／32／48 像素於明暗背景放大的預覽：青綠與琥珀可辨識、無異常底色或裁切。`git diff --check` 在收束時檢查。本輪建置仍有既存的 `pdfjs-dist` `eval` 及大型分包警告，未在本範圍處理。

未修改 `public/Web_Logo.svg`、`index.html`、其他圖檔或其他專案；未暫存、提交、推送、部署或正式切換。`index.html` 目前的 `rel="icon"` SVG 引用仍指向工作樹已刪除的 `/PigeonHand_Logo.svg`，另有 `rel="shortcut icon"` 指向本輪更新的 `/favicon.ico`；本輪只核准重製四個檔案，不接管並行刪除或修改頁面圖示引用，因此不宣稱分頁圖示在所有瀏覽器均已完成切換。Apple／Android 實機安裝與快取更新未測。
