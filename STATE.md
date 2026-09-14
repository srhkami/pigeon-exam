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
last_reconciled: 2026-09-14
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

本專案依 Project-State v1 管理；根目錄協調見 `../STATE.md`。前端效能優化（若列於上方）維持原狀；其餘仍列出的工作保持既有處置，不由本輪擴張或啟動。

2026-09-14 使用者確認的驗收、啟用、發布、LINE 與法規擴充元件事項已完成，不再追蹤。AI 使用概況的現行來源核對與完成依據見 `../docs/result/2026-09-14-completed-work-status-reconciliation-result.md`。法規匯入第二階段已完成，不再沿用「只核准規劃」的過期摘要。

已完成計畫與結果原地保留，按任務需要讀取；歷史失敗或未執行紀錄不是目前待辦。使用者確認不改寫代理歷史驗測，也不授權新的資料庫、正式切換、部署、刪除或 Git 操作。既有手動功能與外部供應商常設授權依根目錄 AGENTS.md 維持。
