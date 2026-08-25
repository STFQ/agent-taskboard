# Agent Taskboard

Agent Taskboard is a local-first taskboard and CLI for coding-agent workflows. It organizes projects, tasks, comments, relations, automations, and agent conversations from a desktop app or `taskctl`.

![Agent Taskboard screenshot](docs/assets/agent-taskboard.png)

It integrates with OpenAI Codex and other coding-agent workflows, but is an independent community project—not made by, affiliated with, sponsored by, or endorsed by OpenAI.

## Highlights

- Local-first SQLite data with optional self-hosted Cloudflare collaboration.
- Local web server, desktop launcher, and platform builds from source.
- `taskctl` CLI for agents and scripts, preserving existing Taskboard skill command compatibility.
- Markdown descriptions, labels, priorities, relations, comments, due dates, automations, and AI context.
- Agent guidance in [`docs/agent-workflows.md`](docs/agent-workflows.md) and [`llms.txt`](llms.txt).

## Install

v2.0.0 is a source-only GitHub release. GitHub automatically provides the tagged source ZIP and tarball; prebuilt platform downloads are not attached to the release. This describes the published assets, not the project's capabilities: the local server, Codex integration, CLI, macOS app, Ubuntu packages, Windows installer, and Cloudflare deployment can all be run or built from source. DMG creation and distribution are intentionally excluded for now.

Existing users should read the [v2 migration note](docs/release.md#v2-migration). The new app uses `Agent Taskboard` data and log directories; migration is manual and does not delete the previous directory.

## Quick start

Clone the repository and install the locked dependencies once:

```sh
git clone https://github.com/STFQ/agent-taskboard.git
cd agent-taskboard
npm ci
```

### Local production server

Build the web UI and start the local-first server at `http://127.0.0.1:47823`:

```sh
npm run build:web
npm start
```

### Development with live reload

Run the local API and Vite development UI together. The UI is available at `http://127.0.0.1:5173`:

```sh
npm run dev
```

### Open inside Codex

This requires the user's own installed and signed-in Codex app. Keep the command running while using the injected Taskboard view:

```sh
CODEX_TASKBOARD_HOST=127.0.0.1 npm run codex
```

### Use `taskctl` and the Agent skill

Run the CLI from the checkout, or use `npm link` to expose `taskctl` globally:

```sh
npm run taskctl -- project list
npm run taskctl -- issue list --status todo
npm link
```

Install the bundled skill for compatible coding agents:

```sh
ln -s "$PWD/skills/manage-taskboard" "$HOME/.agents/skills/manage-taskboard"
```

### Desktop builds from source

Desktop builds require Node.js 22.5+, Rust 1.88+, and the platform's native build prerequisites. Run each command on its target operating system:

| Target | Command | Output |
| --- | --- | --- |
| macOS development app | `npm run app:dev` | Starts the Tauri app from source |
| macOS universal app | `npm run app:build` | Unsigned `.app`; no DMG |
| Ubuntu 24.04 x64 | `npm run app:build:linux:x64` | `.deb` and AppImage |
| Windows x64 | `npm run app:build:windows` | Unsigned NSIS installer |

These are local source-build paths, not prebuilt GitHub Release downloads. Signing and platform trust prompts remain the builder's responsibility.

### Self-host on Cloudflare

The optional shared deployment supports a Cloudflare Worker, D1, R2, and Durable Objects. Follow the credential and resource setup in [`docs/cloud-collaboration.md`](docs/cloud-collaboration.md), then validate and deploy:

```sh
npm run cloud:deploy:dry-run
npm run cloud:deploy
```

## Support scope

| Surface | Status | Notes |
| --- | --- | --- |
| Source release | Available | GitHub-generated ZIP and tarball for v2.0.0 |
| Local web server | Available | Production server or live-reload development mode |
| OpenAI Codex | Compatible | Requires the user's own Codex installation/account |
| `taskctl` and Agent skill | Available | Run from the checkout or link locally |
| macOS `.app` source build | Available | Unsigned universal app; DMG is excluded |
| Ubuntu source build | Available | `.deb` and AppImage on Ubuntu 24.04 x64 |
| Windows source build | Available | Unsigned NSIS installer on Windows x64 |
| Self-hosted Cloudflare | Optional | See [`docs/cloud-collaboration.md`](docs/cloud-collaboration.md) |
| Prebuilt platform downloads | Not published | GitHub Release currently contains source archives only |

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
