# Agent Taskboard

Agent Taskboard is a local-first taskboard and CLI for coding-agent workflows. It organizes projects, tasks, comments, relations, automations, and agent conversations from a desktop app or `taskctl`.

![Agent Taskboard screenshot](docs/assets/agent-taskboard.png)

It integrates with OpenAI Codex and other coding-agent workflows, but is an independent community project—not made by, affiliated with, sponsored by, or endorsed by OpenAI.

## Highlights

- Local-first SQLite data with optional self-hosted Cloudflare collaboration.
- Desktop launcher for macOS, Linux, and Windows preview builds.
- `taskctl` CLI for agents and scripts, preserving existing Taskboard skill command compatibility.
- Markdown descriptions, labels, priorities, relations, comments, due dates, automations, and AI context.
- Agent guidance in [`docs/agent-workflows.md`](docs/agent-workflows.md) and [`llms.txt`](llms.txt).

## Install

Download v2.0.0 from [GitHub Releases](https://github.com/STFQ/agent-taskboard/releases). Linux x64 packages are the stable target when the release workflow succeeds. macOS and Windows artifacts are unsigned previews until signing credentials are configured; read the release notes before installing.

Existing users should read the [v2 migration note](docs/release.md#v2-migration). The new app uses `Agent Taskboard` data and log directories; migration is manual and does not delete the previous directory.

## Quick start

```sh
npm install
npm run dev
npm run taskctl -- project list
npm run taskctl -- issue list --status todo
ln -s "$PWD/skills/manage-taskboard" "$HOME/.agents/skills/manage-taskboard"
```

## Support matrix

| Surface | Status | Notes |
| --- | --- | --- |
| macOS 14+ | Preview | Unsigned without a Developer ID certificate |
| Ubuntu 24.04 x64 | Stable target | `.deb` and `.AppImage` |
| Windows x64 | Preview | Unsigned NSIS installer; no automatic updates |
| OpenAI Codex | Compatible | Requires the user's own Codex installation/account |
| Self-hosted Cloudflare | Optional | See [`docs/cloud-collaboration.md`](docs/cloud-collaboration.md) |

## Privacy and security

Data is local by default. Agent Taskboard has no advertising or telemetry. Optional cloud mode sends data only to the deployment you configure. Codex and other providers remain subject to their own terms. See [`PRIVACY.md`](PRIVACY.md) and [`SECURITY.md`](SECURITY.md).

## Documentation

- [Architecture](docs/architecture.md)
- [Agent workflows](docs/agent-workflows.md)
- [Release and v2 migration](docs/release.md)
- [Contributing](CONTRIBUTING.md)
- [Support](SUPPORT.md)
- [Roadmap](ROADMAP.md)

## Development

Requirements: Node.js 22.5+ and Rust 1.88+ for desktop builds.

```sh
npm ci
npm run typecheck
npm run build:web
node --test
```

The project uses Apache-2.0. It is an independently maintained derivative of an Apache-2.0 taskboard baseline; see [`NOTICE`](NOTICE). The project does not send changes back to the former upstream repository.

## Contributions and license

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md), [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), and [`SECURITY.md`](SECURITY.md). Suggested GitHub topics: `taskboard`, `coding-agents`, `ai-agents`, `codex`, `taskctl`, `local-first`, `developer-tools`.

Copyright © 2026 STFQ and contributors. Licensed under [Apache License 2.0](LICENSE).
