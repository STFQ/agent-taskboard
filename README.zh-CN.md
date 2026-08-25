# Agent Taskboard

Agent Taskboard 是一个 local-first（本地优先）的任务看板与 CLI，用于编码 Agent 工作流，支持项目、任务、评论、关系、自动化和 Agent 会话。

![Agent Taskboard 截图](docs/assets/agent-taskboard.png)

它可与 OpenAI Codex 及其他编码 Agent 集成，但属于独立社区项目，不是 OpenAI 制作、隶属、赞助或背书的产品。

## 核心能力

- 本地 SQLite 数据，可选自托管 Cloudflare 协作。
- 支持 macOS、Linux 与 Windows 预览版桌面启动器。
- 面向 Agent 和脚本的 `taskctl` CLI，保留既有 Taskboard skill 命令兼容性。
- Markdown 描述、标签、优先级、关系、评论、截止日期、自动化和 AI 上下文。
- Agent 说明见 [`docs/agent-workflows.md`](docs/agent-workflows.md)，索引见 [`llms.txt`](llms.txt)。

## 安装

从 [GitHub Releases](https://github.com/STFQ/agent-taskboard/releases) 下载 v2.0.0。Linux x64 是稳定发行目标；签名凭据配置前，macOS 与 Windows 仅为未签名预览版，请阅读 Release Notes。

旧用户请先阅读[ v2 迁移说明](docs/release.md#v2-迁移)。新应用使用 `Agent Taskboard` 数据与日志目录；迁移为手动操作，不会删除旧目录。

## 快速开始

```sh
npm install
npm run dev
npm run taskctl -- project list
npm run taskctl -- issue list --status todo
ln -s "$PWD/skills/manage-taskboard" "$HOME/.agents/skills/manage-taskboard"
```

## 支持矩阵

| 平台/集成 | 状态 | 说明 |
| --- | --- | --- |
| macOS 14+ | 预览版 | 没有 Developer ID 证书时为未签名构建 |
| Ubuntu 24.04 x64 | 稳定目标 | `.deb` 与 `.AppImage` |
| Windows x64 | 预览版 | 未签名 NSIS，不自动更新 |
| OpenAI Codex | 兼容 | 需要用户自行安装并登录 Codex |
| 自托管 Cloudflare | 可选 | 见 [`docs/cloud-collaboration.md`](docs/cloud-collaboration.md) |

## 隐私与安全

默认数据保存在本地。Agent Taskboard 不包含广告或遥测；可选云模式只向你配置的部署发送数据。Codex 和其他提供商仍受各自条款约束。详见 [`PRIVACY.md`](PRIVACY.md) 与 [`SECURITY.md`](SECURITY.md)。

## 文档

- [架构](docs/architecture.md)
- [Agent 工作流](docs/agent-workflows.md)
- [发布与 v2 迁移](docs/release.md)
- [贡献指南](CONTRIBUTING.md)
- [支持](SUPPORT.md)
- [路线图](ROADMAP.md)

## 开发

要求：Node.js 22.5+；桌面构建需要 Rust 1.88+。

```sh
npm ci
npm run typecheck
npm run build:web
node --test
```

本项目采用 Apache-2.0，是基于 Apache-2.0 任务看板基线的独立维护衍生项目，来源与署名见 [`NOTICE`](NOTICE)，不会向原上游仓库回流代码。

## 维护、贡献与许可证

请先阅读 [`CONTRIBUTING.md`](CONTRIBUTING.md)、[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) 和 [`SECURITY.md`](SECURITY.md)。建议 GitHub Topics：`taskboard`、`coding-agents`、`ai-agents`、`codex`、`taskctl`、`local-first`、`developer-tools`。

Copyright © 2026 STFQ and contributors. 本项目采用 [Apache License 2.0](LICENSE)。
