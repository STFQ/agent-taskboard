# Release guide

Agent Taskboard releases are source-only and tag-driven from `main` with a `vX.Y.Z` tag. GitHub generates the source ZIP and tarball for the tag. The release workflow must verify that the tag commit is on `main` and that `package.json`, `package-lock.json`, `Cargo.toml`, `Cargo.lock`, and `src-tauri/tauri.conf.json` agree.

## v2 migration

v2 uses the Agent Taskboard product name, bundle identifier, release endpoints, and platform data/log directories. Existing data under the previous product name is not deleted or automatically migrated. Export or copy the data using the old installation's documented tools, then import or configure it manually after installing v2. Keep a backup before moving files.

## Source-only v2 policy

- v2.0.0 publishes no Windows, macOS, or Linux installer and no platform binary asset.
- GitHub's automatically generated source ZIP and tarball are the only release artifacts.
- Future installer publishing requires a separate decision covering reproducible packaging, signing, checksums, platform support, and release verification.
- Never commit private signing keys. Never invent an Apple Team ID, certificate identity, download count, or security claim.

## Local checks

```sh
npm ci
npm run typecheck
npm run build:web
node --test
```

The current GitHub Actions workflow does not package desktop applications. Review [`src-tauri/release.json`](../src-tauri/release.json) and this document before enabling a future installer workflow. The updater is disabled in the base configuration until a project-owned signing key and endpoint are intentionally configured.
