# Agent workflows

Agent Taskboard is designed for a coding agent to read a task, make a focused change, and report observable verification.

## Recommended loop

1. List eligible work with `taskctl issue list`.
2. Read the full issue and comments before changing state.
3. Claim only work that is ready; leave explicitly waiting work untouched.
4. Record the direct path: entry point → agent action → data/API change → observable result.
5. Implement the smallest complete change and run focused checks.
6. Report files, commit, validation, risks, and next action with `taskctl comment create`.

## Useful commands

```sh
taskctl project list
taskctl issue list --status todo
taskctl issue get ISSUE-ID
taskctl issue update ISSUE-ID --status in_progress
taskctl comment create ISSUE-ID --body "Implemented ...; verified with ..."
```

The exact packaged command may be available as `taskctl`, `npm run taskctl --`, or the app's bundled wrapper. Never copy private logs or credentials into an issue.

## Agent safety

Keep changes scoped to the requested workflow. Do not attach to the user's browser, use existing browser cookies, or claim OpenAI affiliation. For release work, check version/tag consistency, checksums, signing status, and release notes.
