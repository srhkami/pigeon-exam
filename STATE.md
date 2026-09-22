---
state_version: project-state-v1
state_id: pigeon-exam
scope:
  workspace: piegon-hand-projects
  type: single-project
  primary_project: pigeon-exam
  affected_projects:
    - pigeon-exam
parent_state: ../STATE.md
canonical: true
governance_mode: project-state-v1
last_reconciled: 2026-09-22
parent_workstream: workstream.pigeon-exam.project-state-migration.2026-07-27
legacy_sources:
  - path: docs/plans/2026-06-12-1124-p1b-permission-frontend-compat.md
    classification: historical-plan
    status: retained
  - path: docs/plans/2026-06-12-1443-p1c-exam-record-scope-frontend.md
    classification: historical-plan
    status: retained
  - path: docs/plans/2026-06-12-1634-p1c-authenticated-exam-permission-smoke.md
    classification: historical-plan
    status: retained
  - path: docs/plans/2026-06-12-1655-p1c-essay-create-endpoint-contract-remediation.md
    classification: historical-plan
    status: retained
  - path: docs/plans/2026-06-14-1908-p1c-post-remediation-authenticated-smoke-rerun.md
    classification: historical-plan
    status: retained
  - path: README.md
    classification: generic-template-documentation
    status: retained
  - path: docs/result/2026-06-*.md
    classification: historical-result-evidence
    status: retained
  - path: docs/artifacts/2026-06-*.json
    classification: historical-machine-evidence
    status: retained
workstreams:
  - id: frontend-chunk-optimization
    title: Exam 最小 chunk 效能優化
    status: scope_change_required
    affected_projects:
      - pigeon-exam
    affected_areas:
      - vite.config.ts
      - src/routes/routes.tsx
      - src/lib/pages.tsx
    plans:
      - id: plan.pigeon-exam.frontend-chunk-optimization.2026-08-13
        path: docs/plans/2026-08-13-frontend-chunk-optimization.md
        role: implementation
        execution_status: scope_change_required
        current_checkpoints:
          - C0-C5 已執行；管理端與 FilePreview 已隔離，但 gzip 未達 15% 門檻
    blockers:
      - 達成 15% gzip 門檻需擴張到使用者端、Statistics／Analyze 或 protected route 範圍
    approval_gates:
      planning_docs: approved_consumed_2026-08-13
      frontend_source_write: approved_consumed_2026-08-13
      browser_uat: closed
      frontend_cutover: closed
      production: closed
      commit: approved_consumed_2026-08-13
      push: closed
    next_action: 如需繼續，先建立新計畫與範圍核准；不得以提高 warning limit 取代驗收。
    shared_paths:
      - vite.config.ts
      - src/routes/routes.tsx
      - src/lib/pages.tsx
    conflicts_with: []
recent_results:
- id: result.exam-law-reference-filter-search.2026-09-22
  path: ../docs/result/2026-09-22-exam-law-reference-filter-search-result.md
  status: completed
  completed_at: 2026-09-22
  acceptance: source_offline_build_verified_preexisting_lint_errors_runtime_deferred
  summary: 兩題型篩選選項改為有／無關聯法條，參數及分頁不變；17 項前端契約與建置通過。兩元件四個 ESLint 錯誤、兩個警告均已證明為既有，無新增診斷；未做瀏覽器、部署或 Git 交付。
- id: result.pigeon-exam.file-link-frontend-retirement.2026-09-22
  path: docs/result/2026-09-22-file-link-frontend-retirement-result.md
  status: completed
  completed_at: 2026-09-22
  acceptance: source_offline_contract_build_review_verified_browser_deferred
  summary: 五種題目卡片及兩題型編輯入口已移除檔案關聯，POST／PATCH 明確省略 file_link；15 項退役契約、既有法條及錯誤回報契約、ESLint、建置與聚焦複審通過。保留法條、混合搜尋／篩選、預覽路由及歷史資料；未做瀏覽器、資料庫、部署或 Git 交付。
- id: result.pigeon-exam.law-reference-list-refresh.2026-09-22
  path: docs/result/2026-09-22-law-reference-list-refresh-result.md
  status: completed
  completed_at: 2026-09-22
  acceptance: source_offline_contract_build_verified_browser_deferred
  summary: 依使用者要求直接最小修正、不建計畫；兩題型編輯後同步刷新該題V3關聯，離線接線回歸、ESLint與建置通過，瀏覽器複驗未執行。未改後端、資料庫、部署或Git交付。
- id: result.pigeon-exam.law-picker-manage-port.2026-09-21
  path: docs/result/2026-09-21-law-picker-manage-port-result.md
  status: completed
  completed_at: 2026-09-21
  acceptance: source_offline_contract_build_review_verified_browser_deferred
  summary: Exam 加入關聯法條視窗已改用局部法規篩選、條文搜尋與結果卡片；20／10筆 V3 讀取契約、取消／序號晚到防護與既有儲存邊界已由離線合成契約、ESLint、建置及聚焦獨立複審驗證。未啟動服務或瀏覽器互動，未送真實 API／業務寫入、資料庫、部署或 Git 交付。
- id: result.pigeon-exam.api-base-url-audit.2026-09-21
  path: docs/result/2026-09-21-api-base-url-audit-result.md
  status: completed
  completed_at: 2026-09-21
  acceptance: source_offline_contract_and_build_verified
  summary: 共用 Axios 基底改用 ROOT_IP，修復兩題型法規關聯被串入 /user 的問題；來源盤點未發現其他隱含會員前綴依賴。57項離線情境、法規及認證契約、聚焦ESLint與建置通過；未執行真實業務請求、部署或Git交付。
- id: result.exam-v3-improvement-reference.2026-09-18
  path: ../docs/result/2026-09-18-exam-v3-improvement-reference-result.md
  status: completed_with_local_runtime_validation_and_deferred_cutover
  completed_at: 2026-09-18
  acceptance: source_db_http_registry_verified_local_dev_cutover_deferred
  summary: 選擇題與申論題關聯法條已改用 V3 provision／collection；兩階段保存、部分成功、未知 POST、讀取前置條件與競態護欄完成，契約、ESLint、建置、可拋棄 DB／authenticated HTTP 及 v5 複審 PASS。兩筆本機 registry 已精確套用；未做長駐 authenticated 業務操作、瀏覽器或正式切換。
- id: result.pigeon-exam.hand-auth-parity.2026-09-18
  path: docs/result/2026-09-18-hand-auth-parity-result.md
  status: completed
  completed_at: 2026-09-18
  summary: B 方案完成；API 自動區分環境、登入與重送契約同步 Hand、註冊及認證導向 Hand。30 項離線回歸、既有認證檢查、三前端建置與獨立審查通過；共用 toast 既有差異保留。未做真實登入、資料庫、部署、提交或推送。
- id: result.completed-work-status-reconciliation.2026-09-14
  path: ../docs/result/2026-09-14-completed-work-status-reconciliation-result.md
  status: completed
  completed_at: '2026-09-14'
- id: result.pigeon-exam.errorlog-frontend-retirement.2026-08-12
  path: docs/result/2026-08-12-errorlog-frontend-retirement-result.md
  status: completed_source_build_verified_review_pass
  completed_at: 2026-08-12
- id: result.pigeon-exam.project-state-migration.2026-07-27
  path: docs/result/2026-07-27-pigeon-exam-project-state-migration-result.md
  status: completed
---

# 目前狀態

2026-09-21，Exam 法規選取介面移植已完成來源、離線合成契約、ESLint、建置與聚焦獨立複審；結果見 `docs/result/2026-09-21-law-picker-manage-port-result.md`。未啟動服務或瀏覽器互動，未送真實 API／業務寫入、資料庫、部署或 Git 交付；這些缺口不改寫為執行期驗收。

2026-09-21，API 基底網址盤點修正已完成；共用 Axios 使用 API 主機根位址，法規關聯儲存不再誤加 `/user`。結果見 `docs/result/2026-09-21-api-base-url-audit-result.md`；驗證限原始碼、離線合成傳輸與建置，不取代長駐服務或瀏覽器驗收。

2026-09-21，選擇題與申論題關聯法條已完成 V3 來源接線；兩階段保存、只重試 links、未知 POST 停止重送、既有關聯未讀回前禁止 PUT，以及搜尋競態護欄均已納入契約。前端契約、聚焦 ESLint、建置、可拋棄 PostgreSQL／authenticated HTTP 矩陣及 v5 最終獨立複審通過；兩筆 Exam operation 已精確套用本機開發 registry。結果見 `../docs/result/2026-09-18-exam-v3-improvement-reference-result.md` 及 `../pigeon-hand-api/docs/result/2026-09-21-exam-v3-runtime-registry-validation-result.md`。長駐 authenticated 業務操作、瀏覽器驗收、正式切換與部署未執行。

本專案依 Project-State v1 管理；根目錄協調見 `../STATE.md`。前端效能優化（若列於上方）維持原狀；其餘仍列出的工作保持既有處置，不由本輪擴張或啟動。

2026-09-14 使用者確認的驗收、啟用、發布、LINE 與法規擴充元件事項已完成，不再追蹤。AI 使用概況的現行來源核對與完成依據見 `../docs/result/2026-09-14-completed-work-status-reconciliation-result.md`。法規匯入第二階段已完成，不再沿用「只核准規劃」的過期摘要。

已完成計畫與結果原地保留，按任務需要讀取；歷史失敗或未執行紀錄不是目前待辦。使用者確認不改寫代理歷史驗測，也不授權新的資料庫、正式切換、部署、刪除或 Git 操作。既有手動功能與外部供應商常設授權依根目錄 AGENTS.md 維持。
