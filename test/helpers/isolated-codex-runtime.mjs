import { chmod, mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

function withoutAmbientCodexState(environment = process.env) {
  return Object.fromEntries(
    Object.entries(environment).filter(([name]) => (
      name !== "CODEX_HOME"
      && name !== "CODEX_EXECUTABLE"
      && !name.startsWith("CODEX_TASKBOARD_")
    )),
  );
}

async function makePrivate(target) {
  if (process.platform !== "win32") await chmod(target, 0o700);
}

async function writePrivate(target, content) {
  await writeFile(target, content, { mode: 0o600 });
  if (process.platform !== "win32") await chmod(target, 0o600);
}

export async function createIsolatedCodexRuntime(prefix = "taskboard-test-") {
  const directory = await mkdtemp(path.join(os.tmpdir(), prefix));
  const dataDirectory = path.join(directory, "data");
  const codexHome = path.join(directory, "codex-home");
  const codexStatePath = path.join(codexHome, ".codex-global-state.json");
  const codexProcessesPath = path.join(codexHome, "process_manager", "chat_processes.json");
  const launcherRuntimeFile = path.join(dataDirectory, "launcher-runtime.json");

  await Promise.all([
    mkdir(dataDirectory, { recursive: true, mode: 0o700 }),
    mkdir(path.dirname(codexProcessesPath), { recursive: true, mode: 0o700 }),
  ]);
  await Promise.all([
    makePrivate(directory),
    makePrivate(dataDirectory),
    makePrivate(codexHome),
    makePrivate(path.dirname(codexProcessesPath)),
    writePrivate(codexStatePath, "{}\n"),
    writePrivate(codexProcessesPath, "{}\n"),
  ]);

  const processEnv = withoutAmbientCodexState();
  return {
    directory,
    dataDirectory,
    codexHome,
    codexStatePath,
    codexProcessesPath,
    launcherRuntimeFile,
    processEnv,
    serverOptions(overrides = {}) {
      return {
        dataDirectory,
        codexHome,
        codexStatePath,
        codexProcessesPath,
        processEnv,
        ...overrides,
      };
    },
    async close() {
      await rm(directory, { recursive: true, force: true });
    },
  };
}
