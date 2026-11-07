import { execFileSync } from 'node:child_process';

const cache = new Map<string, Date | undefined>();

/**
 * 文件最后一次“有意义”提交的时间（精确到秒）。
 * - 提交信息里带 [minor] 的提交（改错字、批量格式化等）不计入。
 * - 只有新建文件那一次提交时返回 undefined：那是发布，不算编辑。
 * - 不在 git 中（尚未提交的新文章）时返回 undefined。
 */
export function gitUpdated(filePath: string | undefined): Date | undefined {
  if (!filePath) return undefined;
  if (cache.has(filePath)) return cache.get(filePath);
  let result: Date | undefined;
  try {
    const all = execFileSync('git', ['log', '--follow', '--format=%cI', '--', filePath], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .trim()
      .split('\n')
      .filter(Boolean);
    if (all.length > 1) {
      const meaningful = execFileSync(
        'git',
        ['log', '-1', '--follow', '--format=%cI', '--fixed-strings', '--invert-grep', '--grep=[minor]', '--', filePath],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
      ).trim();
      // 最近一次有意义的提交如果就是新建那次，也不算编辑
      if (meaningful && meaningful !== all[all.length - 1]) result = new Date(meaningful);
    }
  } catch {
    result = undefined;
  }
  cache.set(filePath, result);
  return result;
}
