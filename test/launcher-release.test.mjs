import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const launcherSource = await readFile(new URL("../src-tauri/src/main.rs", import.meta.url), "utf8");
const tauriConfig = JSON.parse(await readFile(new URL("../src-tauri/tauri.conf.json", import.meta.url), "utf8"));
const cargoManifest = await readFile(new URL("../src-tauri/Cargo.toml", import.meta.url), "utf8");
const prepareSource = await readFile(new URL("../scripts/prepare-tauri-app.mjs", import.meta.url), "utf8");
const releaseWorkflow = await readFile(new URL("../.github/workflows/release.yml", import.meta.url), "utf8");
const checkWorkflow = await readFile(new URL("../.github/workflows/check.yml", import.meta.url), "utf8");

test("the macOS app owns a standalone loopback service and native taskboard window", () => {
  assert.match(launcherSource, /Command::new\(node_command\(\)\?\)/);
  assert.match(launcherSource, /\.env\("CODEX_TASKBOARD_HOST", "127\.0\.0\.1"\)/);
  assert.match(launcherSource, /\.env\("CODEX_TASKBOARD_DATA_DIR", &data_dir\)/);
  assert.match(launcherSource, /write_runtime_descriptor\(&data_dir, &child, &url\)/);
  assert.match(launcherSource, /WebviewWindowBuilder::new\(app, "main", WebviewUrl::External\(parsed\)\)/);
  assert.match(launcherSource, /set_activation_policy\(ActivationPolicy::Regular\)/);
  assert.match(launcherSource, /child\.kill\(\)/);
  assert.doesNotMatch(launcherSource, /codex-injector|codex-cdp|Google Chrome|\/usr\/bin\/open|restart_codex/i);
  assert.doesNotMatch(prepareSource, /codex-injector|codex-cdp|agent-taskboard\.user/);
  assert.deepEqual(tauriConfig.app.windows, []);
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

test("the standalone host has no updater, autostart, or dialog plugins", () => {
  assert.doesNotMatch(cargoManifest, /tauri-plugin-(updater|autostart|dialog)/);
  assert.equal(tauriConfig.plugins, undefined);
});

test("source-only CI has no platform artifact upload", () => {
  assert.doesNotMatch(checkWorkflow, /actions\/upload-artifact/);
});

test("the standalone app targets the supported macOS baseline", () => {
  assert.equal(tauriConfig.bundle.macOS.minimumSystemVersion, "14.0");
});
