import { getCollection, type CollectionEntry } from 'astro:content';
import { gitUpdated } from './git';
import { site } from '../site.config';

export type Post = CollectionEntry<'posts'>;
export type Page = CollectionEntry<'pages'>;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** 全部已发布文章（生产环境排除草稿），按发布时间倒序。 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', (p) => (import.meta.env.PROD ? !p.data.draft : true));
  for (const p of posts) {
    if (!slugPattern.test(p.id)) {
      throw new Error(
        `文章网址不合法：“${p.id}”（${p.filePath}）。请在 frontmatter 里写 slug（小写字母、数字、连字符），或把目录改成这样的名字。`,
      );
    }
  }
  return posts.sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
}

/** 最后编辑时间：frontmatter 手写优先，否则取 git。不晚于发布时间则视为没有编辑。 */
export function updatedOf(entry: Post | Page): Date | undefined {
  const updated = entry.data.updated ?? gitUpdated(entry.filePath);
  if (!updated) return undefined;
  return updated.valueOf() > entry.data.published.valueOf() ? updated : undefined;
}

const dayFmt = new Intl.DateTimeFormat('en-CA', { timeZone: site.timezone, year: 'numeric', month: '2-digit', day: '2-digit' });

/** YYYY-MM-DD（站点时区） */
export function dayKey(d: Date): string {
  return dayFmt.format(d);
}

const timeFmt = new Intl.DateTimeFormat('en-GB', { timeZone: site.timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });

/** YYYY-MM-DD HH:mm:ss（站点时区） */
export function secondKey(d: Date): string {
  return `${dayFmt.format(d)} ${timeFmt.format(d)}`;
}

export function yearOf(d: Date): string {
  return dayKey(d).slice(0, 4);
}

/** 标签 → 文章列表，按文章数倒序 */
export function groupByTag(posts: Post[]): [string, Post[]][] {
  const map = new Map<string, Post[]>();
  for (const p of posts) for (const t of p.data.tags) map.set(t, [...(map.get(t) ?? []), p]);
  return [...map.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'zh'));
}

/** 专栏内文章，按 order（其次发布时间）排序 */
export function postsInSeries(posts: Post[], seriesId: string): Post[] {
  return posts
    .filter((p) => p.data.series?.id === seriesId)
    .sort((a, b) => (a.data.order ?? Infinity) - (b.data.order ?? Infinity) || a.data.published.valueOf() - b.data.published.valueOf());
}

/** 引用了 target 作为来源的文章（反向链接） */
export function backlinksOf(posts: Post[], target: Post): Post[] {
  return posts.filter((p) => p.data.from.some((r) => r.id === target.id));
}

/** 标签在网址中的形式：保留中文，空格换成连字符 */
export function tagSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

/** 阅读时间（分钟），约 400 字/分钟 */
export function readingMinutes(words: number | undefined): number {
  return Math.max(1, Math.round((words ?? 0) / 400));
}
