type Author = {
  id: string;
  is_bot: boolean;
  login: string;
  name: string;
};

type PullRequest = {
  author: Author;
  createdAt: string;
  isDraft: boolean;
  mergedAt: string;
  closedAt: string;
  number: number;
  state: string;
  title: string;
  updatedAt: string;
};

const prs: PullRequest[] = await Bun.file('prs-koa.json').json();

const startTime = new Date(prs.at(-1)?.createdAt ?? '')
const startYM = new Date(startTime.getFullYear(), startTime.getMonth(), 1);

// 1か月ごとに統計を取る
const stats: Record<string, { created: number; merged: number; closed: number }> = {};
for (let d = new Date(); d >= startYM; d.setMonth(d.getMonth() - 1)) {
  const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  stats[ym] = { created: 0, merged: 0, closed: 0 };
}

for (const pr of prs) {
  const createdAt = new Date(pr.createdAt);
  const createdYM = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
  if (stats[createdYM]) {
    stats[createdYM].created++;
  }

  if (pr.mergedAt) {
    const mergedAt = new Date(pr.mergedAt);
    const mergedYM = `${mergedAt.getFullYear()}-${String(mergedAt.getMonth() + 1).padStart(2, '0')}`;
    if (stats[mergedYM]) {
      stats[mergedYM].merged++;
    }
  } else if (pr.state === 'CLOSED') {
    const closedAt = new Date(pr.closedAt);
    const closedYM = `${closedAt.getFullYear()}-${String(closedAt.getMonth() + 1).padStart(2, '0')}`;
    if (stats[closedYM]) {
      stats[closedYM].closed++;
    }
  }
}

// CSV形式で出力
await Bun.write('pr_stats.csv', Object.entries(stats).map(([ym, s]) => `${ym},${s.created},${s.merged},${s.closed}`).join('\n'));