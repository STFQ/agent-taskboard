# Contributing to Agent Taskboard

Thank you for helping improve a local-first taskboard for coding-agent workflows.

## Before opening a change

Search existing issues, describe the user or agent workflow affected, and keep changes focused. Do not include credentials, personal task data, Codex transcripts, or browser profiles. All contributions must be compatible with Apache-2.0.

## Development

```sh
npm ci
npm run typecheck
npm run build:web
node --test
```

Use `taskctl` for taskboard operations where applicable. Do not automate or attach to a user's browser during tests. See [`AGENTS.md`](AGENTS.md) for repository boundaries and release gates.

## Pull requests

Explain the problem, the direct user path, validation commands, platform impact, and any migration or signing implications. Keep public documentation and English/Chinese user-facing changes equivalent. Maintainers may request a focused reproduction before review.

Agent Taskboard is independently maintained by STFQ. Changes are not synchronized back to the former upstream repository.
