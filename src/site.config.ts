// 站点级配置：改这里即可，不需要动组件。
export const site = {
  url: 'https://edsfod.github.io',
  title: 'edsfod',
  description: 'edsfod 的博客',
  author: 'edsfod',
  lang: 'zh-CN',
  timezone: 'Asia/Shanghai',
  github: 'https://github.com/edsfod',
  repo: 'https://github.com/edsfod/edsfod.github.io',

  license: {
    name: 'CC BY-NC-ND 4.0',
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh-hans',
  },

  // 首页“最近文章”显示的篇数，其余见归档页
  recentCount: 10,

  // giscus 评论：https://giscus.app 生成。repoId / categoryId 为空时不渲染评论区。
  giscus: {
    repo: 'edsfod/edsfod.github.io',
    repoId: 'R_kgDOVl-G_A',
    category: 'Announcements',
    categoryId: 'DIC_kwDOVl-G_M4DKk0e',
  },
} as const;
