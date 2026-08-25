import { ApiError } from "./database.mjs";

const STATUS_LABELS = {
  backlog: "积压事项",
  todo: "待办",
  in_progress: "处理中",
  in_review: "等你确认",
  blocked: "遇到阻碍",
  done: "完成",
  canceled: "取消",
};

function countByStatus(tasks) {
  return Object.fromEntries(Object.keys(STATUS_LABELS).map((status) => [
    status,
    tasks.filter((task) => task.status === status).length,
  ]));
}

export function buildProjectSummary(tasks) {
  const counts = countByStatus(tasks);
  const active = counts.backlog + counts.todo + counts.in_progress + counts.in_review + counts.blocked;
  if (active === 0) {
    return counts.done > 0
      ? `当前项目没有进行中的任务，已完成 ${counts.done} 项。`
      : "当前项目暂无任务。";
  }
  const parts = [
    `当前 ${active} 项未完成`,
    `处理中 ${counts.in_progress}`,
    `待办 ${counts.todo + counts.backlog}`,
    `待确认 ${counts.in_review}`,
    `已完成 ${counts.done}`,
  ];
  if (counts.blocked > 0) parts.push(`阻塞 ${counts.blocked}`);
  return `${parts.join("，")}。`;
}

export class ProjectSummaryService {
  constructor(options) {
    this.database = options.database;
  }

  get(projectId) {
    if (!this.database.getProject(projectId)) {
      throw new ApiError(404, "PROJECT_NOT_FOUND", `Project '${projectId}' was not found`);
    }
    const tasks = this.database.listTasks({ projectId, archived: "false" });
    return {
      projectId,
      summary: buildProjectSummary(tasks),
      updatedAt: new Date().toISOString(),
      refreshing: false,
      error: null,
    };
  }

  async close() {}
}
