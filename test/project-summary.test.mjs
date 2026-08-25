import assert from "node:assert/strict";
import { test } from "node:test";

import { buildProjectSummary } from "../server/project-summary.mjs";

test("project summary is computed from local task states without an AI call", () => {
  assert.equal(buildProjectSummary([
    { status: "todo" },
    { status: "in_progress" },
    { status: "blocked" },
    { status: "done" },
  ]), "当前 3 项未完成，处理中 1，待办 1，待确认 0，已完成 1，阻塞 1。");
  assert.equal(buildProjectSummary([{ status: "done" }]), "当前项目没有进行中的任务，已完成 1 项。");
});
