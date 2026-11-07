# edsfod.github.io

edsfod 的博客：<https://edsfod.github.io>

设计说明（内容组织、技术架构、排版原则、写作约定）见站内的[关于](https://edsfod.github.io/about/)页，源文件在 [`src/content/pages/about.md`](src/content/pages/about.md)。

## 常用命令

需要 Node 24+。

```bash
npm install                          # 安装依赖
npm run dev                          # 本地预览 http://localhost:4321（草稿可见）
npm run new <slug> "标题"             # 新建文章（默认草稿）
npm run check                        # 类型与元数据检查
npm run build                        # 构建到 dist/ 并生成搜索索引
npm run preview                      # 预览构建结果（含搜索）
```

推送到 `main` 后，GitHub Actions 自动检查、构建并部署到 GitHub Pages。

## 目录

```
src/
  content/
    posts/<slug>/index.md   文章（图片放在同一目录）
    series/<id>.md          专栏
    pages/about.md          关于页
  content.config.ts         元数据字段定义与校验
  site.config.ts            站点配置（标题、许可、giscus 等）
  lib/                      文章查询、git 时间、Markdown 插件（KaTeX、字数）
  layouts/ components/ pages/ styles/
  i18n/ui.ts                界面文字
scripts/new-post.mjs        新建文章脚本
```

## 许可

- `src/content/` 下的文章与其中的图片：[CC BY-NC-ND 4.0](LICENSE-CONTENT)
- 其余站点代码：[MIT](LICENSE)
