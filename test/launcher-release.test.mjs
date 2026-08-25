import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const launcherSource = await readFile(new URL("../src-tauri/src/main.rs", import.meta.url), "utf8");
const tauriConfig = JSON.parse(await readFile(new URL("../src-tauri/tauri.conf.json", import.meta.url), "utf8"));
const releaseWorkflow = await readFile(new URL("../.github/workflows/release.yml", import.meta.url), "utf8");
const checkWorkflow = await readFile(new URL("../.github/workflows/check.yml", import.meta.url), "utf8");

test("the managed macOS launcher uses one instance, strict sidebar injection, and a loopback CDP port", () => {
  assert.match(launcherSource, /libc::flock/);
  assert.match(launcherSource, /lifecycle: Mutex/);
  assert.match(launcherSource, /generation: AtomicU64/);
  assert.match(launcherSource, /TcpListener::bind\(\("127\.0\.0\.1", 0\)\)/);
  assert.equal(launcherSource.match(/TcpListener::bind/g)?.length, 1);
  assert.match(launcherSource, /codex_port: Mutex<Option<u16>>/);
  assert.match(
    launcherSource,
    /#\[cfg\(target_os = "macos"\)\]\s+command\.args\(\[\s*"--launch",\s*"--watch",\s*"--open",\s*"--strict-sidebar",\s*"--exit-on-codex-exit",\s*"--port",\s*&codex_port,\s*\]\);/,
  );
  assert.match(launcherSource, /set_activation_policy\(ActivationPolicy::Regular\)/);
  assert.match(launcherSource, /ordinary_codex_processes\(&codex_app, &codex_profile\)/);
  assert.match(launcherSource, /for codex_pid in ordinary_codex_pids/);
  assert.match(launcherSource, /normal_codex_exit = matches!/);
  assert.match(
    launcherSource,
    /Codex 已退出，任务面板服务已停止。/,
  );
  assert.doesNotMatch(launcherSource, /UPDATE_CHECK_INTERVAL/);
  assert.doesNotMatch(launcherSource, /const LAUNCHER_PORT/);
});

test("source-only release publishing is version-gated and has no binary assets", () => {
  assert.doesNotMatch(releaseWorkflow, /workflow_dispatch/);
  assert.match(releaseWorkflow, /tags: \[\"v\*\.\*\.\*\"\]/);
  assert.match(releaseWorkflow, /git merge-base --is-ancestor/);
  assert.match(releaseWorkflow, /package\.json/);
  assert.match(releaseWorkflow, /Cargo\.toml/);
  assert.match(releaseWorkflow, /tauri\.conf\.json/);
  assert.match(releaseWorkflow, /package-lock\.json/);
  assert.match(releaseWorkflow, /Cargo\.lock/);
  assert.match(releaseWorkflow, /gh release create/);
  assert.doesNotMatch(releaseWorkflow, /app:build|upload-artifact|release-assets/);
  assert.match(releaseWorkflow, /permissions:[\s\S]*contents: read[\s\S]*contents: write/);
  assert.match(checkWorkflow, /npm run typecheck/);
  assert.match(checkWorkflow, /npm run build:web/);
  assert.match(checkWorkflow, /node --test/);
  assert.doesNotMatch(checkWorkflow, /macos-launcher|windows-launcher|linux-launcher|app:build|tauri -- build|upload-artifact/);
});

test("the launcher keeps unsupported Windows updates disabled", () => {
  assert.match(
    launcherSource,
    /cfg!\(target_os = "windows"\)[\s\S]*?Windows 版本暂不支持自动更新/,
  );
});

test("source-only CI has no platform artifact upload", () => {
  assert.doesNotMatch(checkWorkflow, /actions\/upload-artifact/);
});

test("the launcher minimum system version matches the current Codex client requirement", () => {
  assert.equal(tauriConfig.bundle.macOS.minimumSystemVersion, "14.0");
});
