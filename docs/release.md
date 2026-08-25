# Release guide

Agent Taskboard releases are tag-driven from `main` with a `vX.Y.Z` tag. The release workflow must verify that the tag commit is on `main` and that `package.json`, `Cargo.toml`, `Cargo.lock`, and `src-tauri/tauri.conf.json` agree.

## v2 migration

v2 uses the Agent Taskboard product name, bundle identifier, release endpoints, and platform data/log directories. Existing data under the previous product name is not deleted or automatically migrated. Export or copy the data using the old installation's documented tools, then import or configure it manually after installing v2. Keep a backup before moving files.

## Artifact policy

- Ubuntu 24.04 x64 `.deb` and `.AppImage` may be marked stable when CI, checksum, and package verification pass.
- macOS and Windows artifacts are previews while no Developer ID or Windows signing credentials are configured.
- Never commit private signing keys. Never invent an Apple Team ID, certificate identity, download count, or security claim.
- Every published artifact needs a SHA256 entry and release notes that state platform, architecture, signing status, and known limitations.

## Local checks

```sh
npm ci
npm run typecheck
npm run build:web
node --test
```

Platform packaging is performed by GitHub Actions. Review [`src-tauri/release.json`](../src-tauri/release.json) and the workflow before enabling signing. The updater is disabled in the base configuration until a project-owned signing key and endpoint are intentionally configured.
