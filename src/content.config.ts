import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 网址里的 slug：只允许小写字母、数字和连字符，写好后不要再改。
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// 文章与独立页面共用的字段
const base = {
  title: z.string(),
  description: z.string().optional(),
  /** 发布时间，手写。可只写日期（2026-11-07），也可带时区（2026-11-07T20:00+08:00）。 */
  published: z.coerce.date(),
  /** 最后编辑时间。留空时自动取 git 最后一次提交时间（提交信息含 [minor] 的提交不计）。 */
  updated: z.coerce.date().optional(),
  /** 持续更新的文章：显示“内容会不定时修改”提示。 */
  living: z.boolean().default(false),
  /** 置顶到首页。 */
  pinned: z.boolean().default(false),
  /** 预留双语：目前只写中文。 */
  lang: z.enum(['zh', 'en']).default('zh'),
  /** 同一篇文章的不同语言版本填相同的值。 */
  translationKey: z.string().optional(),
  /** AI 参与声明。存在即显示提示框。 */
  ai: z
    .object({
      model: z.union([z.string(), z.array(z.string())]).optional(),
      /** 自定义声明文字；不填用默认文字 */
      note: z.string().optional(),
    })
    .optional(),
};

const posts = defineCollection({
  // src/content/posts/<slug>/index.md 或 src/content/posts/<slug>.md
  // 以下划线开头的文件/目录不会被收录，可用来放草稿素材。
  loader: glob({ pattern: ['**/*.md', '!**/_*', '!**/_*/**'], base: './src/content/posts' }),
  schema: z.object({
    ...base,
    slug: z.string().regex(slugPattern, 'slug 只能包含小写字母、数字和连字符').optional(),
    tags: z.array(z.string()).default([]),
    series: reference('series').optional(),
    /** 在专栏中的序号 */
    order: z.number().int().positive().optional(),
    draft: z.boolean().default(false),
    /** 本文源于哪些文章（例如若干次 LLM 对谈）。对方页面会自动出现反向链接。 */
    from: z.array(reference('posts')).default([]),
  }),
});

const series = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    status: z.enum(['ongoing', 'completed', 'paused']).default('ongoing'),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object(base),
});

export const collections = { posts, series, pages };
