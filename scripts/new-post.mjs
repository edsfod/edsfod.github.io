// 新建文章：npm run new -- <slug> [标题]
// 例：npm run new -- weight-space-programming "权重空间编程"
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [slug, ...titleParts] = process.argv.slice(2);
const title = titleParts.join(' ') || slug;

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('用法：npm run new -- <slug> [标题]\nslug 只能包含小写字母、数字和连字符，例如 my-first-post');
  process.exit(1);
}

const dir = join('src', 'content', 'posts', slug);
if (existsSync(dir) || existsSync(`${dir}.md`)) {
  console.error(`已存在：${dir}`);
  process.exit(1);
}

// 当前时间，东八区，精确到秒
const now = new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 19) + '+08:00';

const body = `---
title: ${JSON.stringify(title)}
description: ""
published: ${now}
tags: []
draft: true
# series: 专栏-id
# order: 1
# ai:
#   model: Claude Opus 5.5
#   note: 自定义声明（可省略）
# from: [来源文章的-slug]
# living: true
# pinned: true
---

`;

mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.md'), body);
console.log(`已创建 ${join(dir, 'index.md')}（draft: true，写完后删掉这一行或改为 false 即可发布）`);
