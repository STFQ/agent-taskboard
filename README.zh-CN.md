# Agent Taskboard

Agent Taskboard 是一个 local-first（本地优先）的任务看板与 CLI，用于编码 Agent 工作流，支持项目、任务、评论、关系、自动化和 Agent 会话。

![Agent Taskboard 截图](docs/assets/agent-taskboard.png)

它可与 OpenAI Codex 及其他编码 Agent 集成，但属于独立社区项目，不是 OpenAI 制作、隶属、赞助或背书的产品。

## 核心能力

- 本地 SQLite 数据，可选自托管 Cloudflare 协作。
- 支持本地 Web 服务、桌面启动器和跨平台源码构建。
- 面向 Agent 和脚本的 `taskctl` CLI，保留既有 Taskboard skill 命令兼容性。
- Markdown 描述、标签、优先级、关系、评论、截止日期、自动化和 AI 上下文。
- Agent 说明见 [`docs/agent-workflows.md`](docs/agent-workflows.md)，索引见 [`llms.txt`](llms.txt)。

## 安装

v2.0.0 在 GitHub 上采用仅源码发布：GitHub 会为 tag 自动提供源码 ZIP 与 tarball，Release 暂不附带各平台预编译下载。这只是发布资产的范围，不代表项目只能以开发模式运行；本地服务、Codex 集成、CLI、macOS App、Ubuntu 软件包、Windows 安装程序和 Cloudflare 部署均可从源码运行或构建。目前仅明确排除 DMG 的创建与分发。

旧用户请先阅读[ v2 迁移说明](docs/release.md#v2-迁移)。新应用使用 `Agent Taskboard` 数据与日志目录；迁移为手动操作，不会删除旧目录。

## 快速开始

先克隆仓库并按锁文件安装依赖：

```sh
git clone https://github.com/STFQ/agent-taskboard.git
cd agent-taskboard
npm ci
```

### 本地生产服务

构建 Web 界面并启动本地优先服务，地址为 `http://127.0.0.1:47823`：

```sh
npm run build:web
npm start
```

### 开发热更新

同时运行本地 API 与 Vite 开发界面，界面地址为 `http://127.0.0.1:5173`：

```sh
npm run dev
```

### 在 Codex 中打开

需要用户自行安装并登录 Codex。使用嵌入式任务看板期间请保持命令运行：

```sh
CODEX_TASKBOARD_HOST=127.0.0.1 npm run codex
```

### 使用 `taskctl` 与 Agent skill

可以直接从仓库运行 CLI，也可以通过 `npm link` 将 `taskctl` 链接为全局命令：

```sh
npm run taskctl -- project list
npm run taskctl -- issue list --status todo
npm link
```

为兼容的编码 Agent 安装仓库内置 skill：

```sh
ln -s "$PWD/skills/manage-taskboard" "$HOME/.agents/skills/manage-taskboard"
```

### 从源码构建桌面版本

桌面构建需要 Node.js 22.5+、Rust 1.88+ 以及对应平台的原生构建依赖。请在目标操作系统上运行相应命令：

| 目标 | 命令 | 产物 |
| --- | --- | --- |
| macOS 开发 App | `npm run app:dev` | 从源码启动 Tauri App |
| macOS 通用 App | `npm run app:build` | 未签名 `.app`，不生成 DMG |
| Ubuntu 24.04 x64 | `npm run app:build:linux:x64` | `.deb` 与 AppImage |
| Windows x64 | `npm run app:build:windows` | 未签名 NSIS 安装程序 |

以上均为本地源码构建方式，不是 GitHub Release 中的预编译下载；代码签名与平台信任提示由构建者自行处理。

### 自托管到 Cloudflare

可选的共享部署使用 Cloudflare Worker、D1、R2 和 Durable Objects。请先按照 [`docs/cloud-collaboration.md`](docs/cloud-collaboration.md) 配置凭据与资源，再验证并部署：

```sh
npm run cloud:deploy:dry-run
npm run cloud:deploy
```

## 支持范围

| 平台/集成 | 状态 | 说明 |
| --- | --- | --- |
| 源码发布 | 可用 | v2.0.0 的 GitHub 自动源码 ZIP 与 tarball |
| 本地 Web 服务 | 可用 | 支持生产服务与开发热更新模式 |
| OpenAI Codex | 兼容 | 需要用户自行安装并登录 Codex |
| `taskctl` 与 Agent skill | 可用 | 可从仓库运行或链接到本机 |
| macOS `.app` 源码构建 | 可用 | 未签名通用 App；排除 DMG |
| Ubuntu 源码构建 | 可用 | Ubuntu 24.04 x64 上生成 `.deb` 与 AppImage |
| Windows 源码构建 | 可用 | Windows x64 上生成未签名 NSIS 安装程序 |
| 自托管 Cloudflare | 可选 | 见 [`docs/cloud-collaboration.md`](docs/cloud-collaboration.md) |
| 各平台预编译下载 | 暂不发布 | GitHub Release 当前仅包含源码归档 |

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
