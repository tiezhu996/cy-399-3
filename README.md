# 摄影约拍平台 CLI 发布工具

摄影约拍平台 CLI 发布工具帮助摄影师在终端中发布约拍档期、处理预约请求、管理订单、查看收入统计和维护个人资料。

## 项目主要功能

- 摄影师注册、登录，本地持久化 Token 到 `~/.photo-cli/config.json`。
- 批量发布可约日期、时段、拍摄类型、价格和服务城市。
- 查看待确认预约请求并确认或拒绝。
- 按状态筛选订单并标记完成。
- 月度/年度收入表格统计，按拍摄类型分类汇总。
- 更新简介、作品集链接、报价和擅长风格标签。
- 默认命令进入 inquirer 风格交互式主菜单。

## 安装方式

```bash
cd cli
npm install
npm run build
npm link
```

## 使用方式

```bash
photo-cli login
photo-cli register
photo-cli schedule
photo-cli booking
photo-cli order --status confirmed
photo-cli stats --year 2026
photo-cli profile
photo-cli
```

## 技术栈

| 类型 | 技术 |
| --- | --- |
| 语言 | Node.js + TypeScript |
| CLI | commander.js |
| 交互 | inquirer |
| HTTP | axios |
| 输出 | chalk + cli-table3 |

## 项目目录结构

```text
cli
├── src
│   ├── api
│   ├── commands
│   ├── constants
│   ├── prompts
│   ├── types
│   └── utils
├── package.json
└── tsconfig.json
```

## 配置说明

默认 API 地址为 `http://localhost:3000`，可在 `~/.photo-cli/config.json` 中保存：

```json
{"apiBaseUrl":"http://localhost:3000","token":"your-token"}
```

## License

MIT
