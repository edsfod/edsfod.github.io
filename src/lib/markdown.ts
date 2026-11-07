// Sätteri（Astro 7 默认 Markdown 引擎）插件。
import katex from 'katex';
import type { MdastPluginEntry } from 'satteri';
import { katexMacros } from './katex-macros';

/**
 * 数学公式：$...$ / $$...$$ 在构建时用 KaTeX 渲染成 HTML，浏览器端不跑 JS。
 * 公式有误时直接让构建失败，避免把报错发布上线。
 * 同时在 remarkPluginFrontmatter 里写入 hasMath。
 */
export const mathPlugin: MdastPluginEntry = (factoryCtx) => {
  const file = factoryCtx.fileURL ? decodeURIComponent(factoryCtx.fileURL.pathname) : '(unknown file)';
  const render = (tex: string, displayMode: boolean) => {
    try {
      return katex.renderToString(tex, {
        displayMode,
        macros: { ...katexMacros },
        throwOnError: true,
        strict: 'error',
        output: 'htmlAndMathml',
      });
    } catch (err) {
      throw new Error(`KaTeX 渲染失败：${file}\n  公式：${tex}\n  ${(err as Error).message}`);
    }
  };
  return {
    name: 'blog-math',
    math(node, ctx) {
      ctx.data.astro!.frontmatter.hasMath = true;
      ctx.replaceNode(node, { type: 'html', value: `<div class="math-display">${render(node.value, true)}</div>` });
    },
    inlineMath(node, ctx) {
      ctx.data.astro!.frontmatter.hasMath = true;
      ctx.replaceNode(node, { type: 'html', value: render(node.value, false) });
    },
  };
};

/** 字数统计：汉字按字计，其余按词计。写入 remarkPluginFrontmatter.words。 */
export const wordCountPlugin: MdastPluginEntry = {
  name: 'blog-word-count',
  before(root, ctx) {
    const text = ctx.textContent(root);
    const cjk = text.match(/[㐀-鿿豈-﫿]/g)?.length ?? 0;
    const words = text.replace(/[㐀-鿿豈-﫿]/g, ' ').match(/[A-Za-z0-9_'’-]+/g)?.length ?? 0;
    ctx.data.astro!.frontmatter.words = cjk + words;
  },
};
