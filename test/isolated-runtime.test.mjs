import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

import { createTaskboardServer } from "../server/index.mjs";
import { resolveServerOptions } from "../server/app.mjs";
import { createIsolatedCodexRuntime } from "./helpers/isolated-codex-runtime.mjs";

test("the baseline runtime isolates task data, Codex state, and launcher settings", async () => {
  const runtime = await createIsolatedCodexRuntime("taskboard-baseline-");
  const workspace = path.join(runtime.directory, "workspace");
  const agentsDirectory = path.join(runtime.codexHome, "agents");
  await Promise.all([
    mkdir(workspace),
    mkdir(agentsDirectory),
  ]);
  await Promise.all([
    writeFile(runtime.codexStatePath, JSON.stringify({
      "local-projects": {
        fixture: { rootPaths: [workspace] },
      },
    })),
    writeFile(path.join(agentsDirectory, "fixture.toml"), [
      'name = "fixture-agent"',
      'description = "Isolated test agent"',
      'developer_instructions = "Use the fixture only"',
    ].join("\n")),
  ]);

  const app = createTaskboardServer(runtime.serverOptions());
  try {
    const address = await app.listen({ host: "127.0.0.1", port: 0 });
    const payload = await fetch(
      `http://127.0.0.1:${address.port}/api/device-workspaces`,
    ).then((response) => response.json());
    const catalog = await app.aiChat.composerCatalog.candidates({
      workspacePath: null,
      trigger: "@",
      query: "fixture",
    });

    assert.deepEqual(payload.workspaces, { fixture: workspace });
    assert.equal(app.options.dataDirectory, runtime.dataDirectory);
    assert.equal(app.options.codexHome, runtime.codexHome);
    assert.equal(app.options.codexStatePath, runtime.codexStatePath);
    assert.equal(app.options.codexProcessesPath, runtime.codexProcessesPath);
    assert.equal(app.options.instanceToken, "");
    assert.equal(app.options.instanceSecret, "");
    assert.equal(app.aiChat.composerCatalog.codexHome, runtime.codexHome);
    assert.deepEqual(catalog.candidates.map((candidate) => candidate.label), ["fixture-agent"]);
    assert.equal(Object.hasOwn(runtime.processEnv, "CODEX_HOME"), false);
    assert.equal(Object.hasOwn(runtime.processEnv, "CODEX_EXECUTABLE"), false);
    assert.equal(
      Object.keys(runtime.processEnv).some((name) => name.startsWith("CODEX_TASKBOARD_")),
      false,
    );
  } finally {
    await app.close();
    await runtime.close();
  }
});

test("server option resolution stays inside an injected isolated environment", async () => {
  const runtime = await createIsolatedCodexRuntime("taskboard-options-");
  try {
    const resolved = resolveServerOptions({
      processEnv: {
        CODEX_HOME: runtime.codexHome,
        CODEX_EXECUTABLE: "/fixture/codex",
        CODEX_TASKBOARD_DATA_DIR: runtime.dataDirectory,
      },
    });
    const blankHome = resolveServerOptions({
      codexExecutable: "/fixture/codex",
      processEnv: { CODEX_HOME: "   " },
    });

    assert.equal(resolved.codexHome, runtime.codexHome);
    assert.equal(resolved.codexExecutable, "/fixture/codex");
    assert.equal(resolved.dataDirectory, runtime.dataDirectory);
    assert.equal(blankHome.codexHome, path.join(os.homedir(), ".codex"));
  } finally {
    await runtime.close();
  }
});
