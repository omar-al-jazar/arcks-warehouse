---
description: Pick up the ARC project where the last Cursor or Claude session stopped, build the next task, and open a pull request.
argument-hint: "[task, optional]"
disable-model-invocation: true
---

Continue ARC from where the last session stopped.

1. Run `git status`. If there are uncommitted changes, stop and ask the user what to do with them. Otherwise run `git fetch origin`.
2. Read `docs/STATUS.md`, then check GitHub, which is newer:
   - `gh pr list --repo omar-al-jazar/arcks-warehouse --state all --limit 10`, or `git log --oneline -15 origin/main` if `gh` isn't available.
   - `git branch -r --no-merged origin/main`: a branch with no pull request may be unfinished work from a session that ran out. Read it before starting anything that overlaps.
3. Tell the user where things stand in at most 5 lines. Don't wait for a reply.
4. Choose the task: the user's request at the bottom, if there is one. Otherwise the first "Next up" item that needs nothing from the user and isn't blocked by an open pull request. If every item is blocked, say which pull request to merge and stop.
5. Branch from `origin/main` as `claude/<short-name>`. Build it following `CLAUDE.md`, one commit per logical change.
6. Run the checks in `CLAUDE.md` and fix any failure you caused.
7. In the same branch, update `docs/STATUS.md`: the step's status, Open work, Next up, the log, and "Last updated" with Riyadh time and "by Claude".
8. Push the branch and open a pull request against `main` with `gh pr create`: what changed, how you checked it, and what you couldn't test. If you can't open it, give the user the title and body. Don't merge it.
9. Reply with the pull request link and what it does, then one next action for the user.

User's request: $ARGUMENTS
