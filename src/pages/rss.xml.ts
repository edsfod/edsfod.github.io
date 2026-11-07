import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/posts';
import { site } from '../site.config';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: site.title,
    description: site.description,
    site: context.site!,
    trailingSlash: true,
    customData: `<language>zh-cn</language><copyright>${site.license.name}</copyright>`,
    items: posts.slice(0, 30).map((p) => ({
      title: p.data.title,
      link: `/posts/${p.id}/`,
      pubDate: p.data.published,
      description: p.data.description,
      // 全文输出，RSS 阅读器里可直接读
      content: p.rendered?.html,
      categories: p.data.tags,
    })),
  });
}
