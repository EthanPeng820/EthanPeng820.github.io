# Ethan's Navigation Hub

一个简洁的个人网址导航站，用来集中管理和访问常用网站。

项目采用原生 HTML、CSS 和 JavaScript 编写，数据服务使用 Supabase，网站可以直接部署到 GitHub Pages，无需构建或打包。

## 功能

- 按分类浏览常用网站
- 根据名称、简介或网址搜索
- 支持必应、百度、Google 和 Yandex 全网搜索
- 自动加载网站图标，并提供备用图标
- 显示公历、农历和当前时间
- 支持浅色和深色主题
- 适配桌面端、平板和手机屏幕
- 根据访问次数对网站进行排序
- 提供独立的管理后台，用于维护网站列表
- 支持网站编辑、软删除、恢复和永久删除
- 支持 JSON 数据备份与恢复

## 在线使用

打开网站首页即可浏览和搜索已收录的网站。

管理功能位于 [`admin.html`](./admin.html)，仅供授权管理员使用。

## 技术栈

- HTML5
- CSS3
- 原生 JavaScript
- [Supabase](https://supabase.com/)
- [GitHub Pages](https://pages.github.com/)

项目不使用前端框架，也没有额外的构建步骤。

## 项目结构

```text
.
├── index.html                      # 网站首页
├── app.js                          # 首页交互和数据读取
├── styles.css                      # 首页样式
├── admin.html                      # 管理后台页面
├── admin.js                        # 管理后台逻辑
├── admin.css                       # 管理后台样式
├── 404.html                        # GitHub Pages 404 页面
├── supabase-config.js              # Supabase 前端配置
├── supabase-metadata-migration.sql # 数据库字段和权限配置
└── 项目开发与维护手册.md             # 开发维护文档
```

## 本地运行

这是一个静态网站，可以使用任意静态文件服务器运行。

如果已安装 Node.js，可以在项目根目录执行：

```bash
npx serve .
```

也可以使用 VS Code Live Server 等工具运行。启动后，在浏览器中打开终端显示的本地地址即可。

## Supabase 配置

如果要运行完整功能，需要准备一个 Supabase 项目，并在 [`supabase-config.js`](./supabase-config.js) 中填写项目地址和公开 anon key：

```js
window.SUPABASE_CONFIG = {
  url: "https://your-project.supabase.co",
  anonKey: "your-public-anon-key",
};
```

数据库需要有 `public.links` 表。可以在 Supabase SQL Editor 中执行 [`supabase-metadata-migration.sql`](./supabase-metadata-migration.sql)，为数据表添加分类、简介、收录时间、访问次数、回收站和访问权限配置。

> 公开网页中可以使用 anon key，但不要公开数据库密码、管理员密码或 `service_role` key。数据访问权限应由 Supabase RLS 管理。

## 数据字段

网站记录主要包含以下信息：

| 字段 | 说明 |
| --- | --- |
| `name` | 网站名称 |
| `url` | 网站地址，仅支持 HTTP 或 HTTPS |
| `category` | 网站分类 |
| `description` | 网站简介 |
| `created_at` | 收录时间 |
| `click_count` | 累计点击次数 |
| `deleted_at` | 删除时间，非空时表示进入回收站 |

## 发布到 GitHub Pages

1. 将项目上传到 GitHub 仓库。
2. 在仓库的 **Settings → Pages** 中选择发布分支和目录。
3. 确认 Supabase 配置和数据库权限已经完成。
4. 等待 GitHub Pages 部署完成。
5. 打开网站首页，检查搜索、分类和管理后台是否正常工作。

项目是纯静态网站，不需要执行 `npm run build` 或其他构建命令。

## 开发检查

修改 JavaScript 后，可以执行以下命令检查语法：

```bash
node --check app.js
node --check admin.js
git diff --check
```

## 相关文档

- [项目开发与维护手册](./项目开发与维护手册.md)
- [Supabase 数据库迁移脚本](./supabase-metadata-migration.sql)

## 许可证

本项目目前未声明单独的软件许可证。如需公开授权他人使用、修改或再发布，请根据实际需求添加 LICENSE 文件。
