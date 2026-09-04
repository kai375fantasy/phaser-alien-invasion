# Alien Invasion · Phaser 3 网页游戏（CI587 Web Based Game Development）

> Phaser 3 · JavaScript · 纯浏览器运行的街机射击游戏 ｜ 打开 `index.html` 即玩

一款基于 Phaser 3 框架开发的 Web 街机游戏（Alien Invasion 类型），包含完整的场景流程与游戏循环。

## 快速开始

由于浏览器安全策略（CORS），**不能直接双击 `index.html`**，需要通过本地服务器运行：

```bash
# 在本目录下任选其一
python -m http.server 8000
npx serve .
```

然后浏览器访问 `http://localhost:8000` 即可开始游戏。

## 代码结构（js/）

| 文件 | 职责 |
|---|---|
| `main.js` | Phaser 游戏配置与启动入口 |
| `BootScene.js` | 资源加载场景 |
| `MainMenuScene.js` | 主菜单 |
| `PlayScene.js` | 核心玩法场景（战斗循环） |
| `GameOverScene.js` | 结算场景 |

## 技术要点

- Phaser 3 场景（Scene）生命周期管理与切换；
- 浏览器环境下的资源加载与 CORS 问题排查；
- Web 游戏的打包与部署结构。

## 开发方式

开发中与 GPT 进行 AI 协同开发：Phaser API 使用咨询、JavaScript 代码实现与修改、本地服务器/CORS 问题排查与打包检查，最终独立完成全部开发与提交。

素材来源：课程提供的免费资源包。时间：2024-09 ~ 2025-06
