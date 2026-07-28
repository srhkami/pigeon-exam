---
id: architecture.pigeon-exam.legacy-project-state-snapshot.2026-07-27
type: architecture
status: accepted
canonical: true
scope: pigeon-exam
created: 2026-07-27
replaces:
  - pigeon-exam legacy plan/status entry points
replacement_for:
  - pigeon-exam/docs/plans/*.md as historical execution sources
---

# pigeon-exam 舊治理架構快照

## 遷移前狀態

在本次遷移前，`pigeon-exam` 沒有 child-local `AGENTS.md` 或 `STATE.md`，只有專案根目錄的 React/Vite 設定與歷史計畫文件。因此依 root 規則，該專案屬於 `legacy`；舊計畫在 cutover 前不能被新 `STATE.md` 取代，也不能被本快照直接重新執行。

## 舊計畫清單

| 舊計畫 | 主題 | 本次分類 |
|---|---|---|
| `docs/plans/2026-06-12-1124-p1b-permission-frontend-compat.md` | P1-B 權限修正後前端相容 | 歷史計畫，保留原檔 |
| `docs/plans/2026-06-12-1443-p1c-exam-record-scope-frontend.md` | P1-C 測驗紀錄權限前端相容 | 歷史計畫，保留原檔 |
| `docs/plans/2026-06-12-1634-p1c-authenticated-exam-permission-smoke.md` | P1-C 已登入權限驗證 | 歷史計畫，保留原檔 |
| `docs/plans/2026-06-12-1655-p1c-essay-create-endpoint-contract-remediation.md` | 申論建立端點契約修正 | 歷史計畫，保留原檔 |
| `docs/plans/2026-06-14-1908-p1c-post-remediation-authenticated-smoke-rerun.md` | 修正後權限驗證重跑 | 歷史計畫，保留原檔 |

## 舊執行證據

目前工作樹另保留 5 份 2026-06 的 `docs/result/*.md` 與 2 份 2026-06 的 `docs/artifacts/*.json`。它們是歷史執行證據與機器產物，保留原路徑；不因本次遷移自動提升為目前工作，也不補造其中引用但不存在的跨專案文件。

## 共同依賴與邊界

- 舊計畫均與 `pigeon-hand-api` 的權限或 API 契約有關；本次 child 遷移不重新驗證後端契約。
- 舊計畫中出現的資料庫、測試帳號、登入、API smoke、結果文件與 cleanup 要求，均不因本快照而重新開啟。
- 舊計畫引用的部分 result 路徑不在目前 `pigeon-exam` 工作樹中；本快照不補造缺失證據。
- 舊計畫曾使用 OpenCode、Hermes smoke 或前端檢查等執行角色；這些歷史 runner 設定不構成目前 active workstream。

## 新治理替代入口

- 目前狀態：`pigeon-exam/STATE.md`
- 根層協調計畫：`../docs/plans/2026-07-27-pigeon-exam-project-state-migration.md`
- child 遷移結果：`docs/result/2026-07-27-pigeon-exam-project-state-migration-result.md`
- workspace 治理規則：`../docs/governance.md`

## 保留與刪除決策

本次只建立 replacement 與 provenance，不刪除任何舊計畫，不將舊計畫標記為 deprecated。未來若要刪除零散歷史治理文件，仍須通過 replacement、快照、真實低風險試跑、參照搜尋與使用者明確刪除核准等獨立條件。
