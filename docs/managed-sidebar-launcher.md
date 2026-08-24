# Managed Sidebar Launcher V1

This local build treats the Codex Taskboard launcher as the only supported
entry point for the sidebar view.

## Lifecycle contract

1. Opening the launcher starts a managed Codex process with a loopback-only
   CDP port, starts the local taskboard service, and injects the sidebar entry.
2. If an ordinary Codex process is already open, the launcher asks to restart
   it. It never falls back to a browser panel.
3. When the managed Codex process exits, the injector exits cleanly. Its
   cleanup stops the taskboard service and removes the runtime descriptor.
4. The launcher stays available in the Dock and menu bar in a stopped state;
   opening it again starts one new managed Codex instance.

This removes manual terminal operation, but the sidebar itself still relies on
Codex's undocumented CDP/DOM surface. Validate injection after every Codex
update before relying on it for daily work.

## Local build notes

The managed build deliberately does not run Dashi's automatic upstream update
check. Updating to an upstream release would replace the stricter lifecycle
rules in this build.
