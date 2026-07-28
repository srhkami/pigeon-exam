---
id: result.pigeon-exam.project-state-migration.2026-07-27
type: result
status: completed
canonical: true
scope: pigeon-exam
created: 2026-07-27
implements: plan.pigeon-exam.project-state-migration.2026-07-27
plan: ../../docs/plans/2026-07-27-pigeon-exam-project-state-migration.md
parent_result: ../../docs/result/2026-07-27-pigeon-exam-project-state-migration-result.md
---

# pigeon-exam Project-State v1 遷移結果

## 執行範圍

本 checkpoint 完成 `pigeon-exam` 的治理遷移，不執行任何舊功能計畫。實際變更只涉及 child `STATE.md`、legacy 架構快照與遷移證據；沒有修改 `src/**`、`package.json` 或既有 5 份舊計畫。

## 實際建立與更新

- 建立 `pigeon-exam/STATE.md`，完成 atomic cutover 為 `canonical: true`、`governance_mode: project-state-v1`。
- 建立 `pigeon-exam/docs/architecture/legacy-project-state-snapshot.md`，保留 5 份舊計畫的來源、用途與不可直接恢復執行的分類。
- 保留原有 5 份 `pigeon-exam/docs/plans/*.md`，未刪除、未搬移、未標記 deprecated。
- 保留原有 5 份 2026-06 `docs/result/*.md` 與 2 份 2026-06 `docs/artifacts/*.json`，分類為歷史證據，不提升為目前 active 工作。
- 根目錄 `STATE.md` 已將 `pigeon-exam` mode 更新為 `project-state-v1`，並保留 child pointer 與遷移結果。
- 根目錄 coordination plan 與本 child result 已以 `implements` 對應。

## 唯讀驗證

1. 路徑與 frontmatter 檢查：`execute_code`，exit code 0。
   - 5 個必要路徑存在。
   - root plan、child STATE、legacy snapshot 的 frontmatter 分隔符有效。
   - 5 份舊計畫均列於 child STATE。
   - 輸出：`PASS checks=13`。
2. `git diff --check`，exit code 0。
3. workspace 參照搜尋：`search_files`。
   - 找到 root STATE、root plan 與 child migration 入口的 13 筆參照。
4. 工作樹盤點：
   - `pigeon-exam` 原本乾淨；遷移後新增只包含 `STATE.md` 與 legacy snapshot。
   - root 原有使用者既存 dirty/untracked 內容均保留。

## 未執行事項

- 未執行 `pnpm install`、`pnpm build`、`pnpm lint` 或 application tests；本 checkpoint 沒有 application code 變更。
- 未啟動前端或後端服務，未登入，未執行 browser/API smoke。
- 未讀取或輸出 `.env*`、token、password、secret 或其他憑證內容。
- 未執行 DB write、外部 provider、production、deploy、commit、push 或 history rewrite。

## 遷移決策

`pigeon-exam` 已完成 Project-State v1 atomic cutover。舊計畫仍是歷史背景，不是目前 active plan；日後若要恢復其中任何主題，必須從目前 source 重新盤點，建立新的 child workstream 與 canonical plan，並重新取得適用核准。

## Rollback window

本次結果保留舊計畫與 legacy snapshot；若後續發現 child 入口或連結無法恢復工作，可將 child mode 暫時退回 `transitioning`，但不得同時啟用兩套 canonical current-state authority。
