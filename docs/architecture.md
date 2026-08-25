# Architecture

Agent Taskboard has three local-first layers:

1. `web/` is the React/Vite interface. It calls the local HTTP API and renders boards, tasks, projects, and conversations.
2. `server/` owns the local service, SQLite persistence, taskctl-compatible API, agent conversation processes, and optional cloud proxy.
3. `src-tauri/` is the platform launcher. It starts the bundled Node runtime and service, manages the tray lifecycle, packages assets, and exposes platform-specific install paths.

The `cli/` and `skills/` directories are agent-facing entry points. `taskctl` communicates with the active launcher runtime rather than assuming a fixed port. `cloud/` contains the optional Cloudflare Worker and migrations; it is not required for local use.

## Data boundary

Local data, attachments, runtime descriptors, and logs live under the platform's `Agent Taskboard` application directories. The app does not collect analytics by default. Cloud mode is an explicit deployment choice and has separate credentials and retention responsibilities.

## Integration boundary

Codex integration uses the user's existing Codex installation and session. Agent Taskboard is not an OpenAI service and does not provide or proxy OpenAI credentials.
