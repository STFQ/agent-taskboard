# Changelog

## [2.0.0] - 2026-08-25

### Changed

- Reintroduced the project as Agent Taskboard, an independently maintained local-first taskboard and CLI for coding-agent workflows.
- Updated package, desktop metadata, data paths, release URLs, documentation, and public maintenance configuration.
- Hardened AI chat context measurement and token-usage recording.
- Added Taskboard intent injection for agent workflows and isolated runtime hardening.
- Made completed tasks visible by default on the main board.
- Documented v2 manual migration and source-only release scope; platform installers are not published yet.

### Compatibility

- The `taskctl` command and Taskboard skill workflow remain available.
- This release does not automatically migrate or delete data from the previous product-named directories.
