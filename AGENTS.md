# AGENTS.md

**Active work: the v3 rework in [`docs/plans/v3-plan.md`](docs/plans/v3-plan.md).** Read it before changing anything,
continue from its progress log, and update the log when you finish a step.

Standing rules (details in the plan):

- Never push unless the owner asks in this session: a push to `main` runs CI and then the npm release.
- This repo is public. Never commit business details from the owner's private projects (see "Porting rules").
- Commit locally per logical step with Conventional Commits. Stage files by explicit path.
- Coding standards: [`.ai/instructions.md`](.ai/instructions.md). Where it disagrees with the v3 plan, the plan wins
  until phase 0 rewrites it.
- Owner-only, gitignored files: `local/source-inventory.md` (what to port) and `local/scrub-check.sh` (pre-commit
  leak check). If they are missing, ask the owner.
