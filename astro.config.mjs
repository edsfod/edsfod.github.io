// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { mathPlugin, wordCountPlugin } from './src/lib/markdown.ts';

export default defineConfig({
  site: 'https://edsfod.github.io',
  trailingSlash: 'always',
  integrations: [sitemap()],
  // 鼠标悬停 / 进入视口时预取链接，点击后几乎立即打开
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  markdown: {
    processor: satteri({
      features: {
        math: true,
        gfm: { footnotes: { label: '脚注', backLabel: '返回正文第 {reference} 处' } },
      },
      // 字数统计要在公式替换成 HTML 之前运行
      mdastPlugins: [wordCountPlugin, mathPlugin],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
  // 专栏 / 标签改 ID、文章改 slug 时，在这里加旧网址 → 新网址的跳转，旧链接不失效
  redirects: {},
});
