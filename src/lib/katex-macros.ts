// 全站共用的 KaTeX 宏，所有文章可直接使用。按需增删。
export const katexMacros: Record<string, string> = {
  '\\N': '\\mathbb{N}',
  '\\Z': '\\mathbb{Z}',
  '\\Q': '\\mathbb{Q}',
  '\\R': '\\mathbb{R}',
  '\\C': '\\mathbb{C}',
  '\\cat': '\\mathcal{#1}',
  '\\Set': '\\mathbf{Set}',
  '\\Hom': '\\operatorname{Hom}',
  '\\id': '\\mathrm{id}',
  '\\op': '^{\\mathrm{op}}',
  '\\ob': '\\operatorname{ob}',
};
