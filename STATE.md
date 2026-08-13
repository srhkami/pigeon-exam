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
last_reconciled: 2026-08-13
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
  - id: result.pigeon-exam.errorlog-frontend-retirement.2026-08-12
    path: docs/result/2026-08-12-errorlog-frontend-retirement-result.md
    status: completed_source_build_verified_review_pass
    completed_at: 2026-08-12
  - id: result.pigeon-exam.project-state-migration.2026-07-27
    path: docs/result/2026-07-27-pigeon-exam-project-state-migration-result.md
    status: completed
    implements: plan.pigeon-exam.project-state-migration.2026-07-27
---

# Project State

## 目前摘要

`pigeon-exam` 已由 `legacy` 原子切換至 Project-State v1。專案本身目前沒有已知的大型功能修改；既有 5 份 P1-B/P1-C 計畫保留為歷史來源，不重新啟動，也不在本次遷移中宣告為已完成或已失效。日後任何新工作都必須從本檔建立新的工作線與正式計畫。

`errorlog-retirement` 已完成來源／建置驗證與最終聚焦複審 PASS；舊錯誤上傳已退役，未執行 browser、正式切換或 Git。

## 歷史來源分類

既有計畫的共同主題是測驗前端與後端權限契約、作答紀錄 owner scope、申論建立端點與 authenticated smoke。它們涉及 `pigeon-hand-api` 的後端依賴，不能在沒有新的 child workstream、plan 與核准的情況下直接恢復執行。

## 本地阻塞事項

- 無目前 blocker。
- 既有計畫引用但目前工作樹不存在的 result 不補造；若日後需要恢復相關工作，必須從目前 source 重新驗證。

## 父層協調

- Root STATE：`../STATE.md`
- Root migration plan：`../docs/plans/2026-07-27-pigeon-exam-project-state-migration.md`
- Root migration result：`../docs/result/2026-07-27-pigeon-exam-project-state-migration-result.md`

## 導航

- Legacy 架構快照：`docs/architecture/legacy-project-state-snapshot.md`
- Child migration result：`docs/result/2026-07-27-pigeon-exam-project-state-migration-result.md`
- Child-local 新計畫與結果應放在 `docs/plans/` 與 `docs/result/`；root coordination plan 僅引用，不複製。
