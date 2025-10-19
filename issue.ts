type Author = {
  id: string;
  is_bot: boolean;
  login: string;
  name: string;
};

type Label = {
  id: string;
  name: string;
  description: string | null;
  color: string;
};

type Issue = {
  author: Author;
  closedAt: string | null;
  createdAt: string;
  labels: Label[];
  number: number;
  state: string;
  title: string;
  updatedAt: string;
};

const issues: Issue[] = await Bun.file('hono_issues.json').json();

// Oldest issue determines the starting month
const sorted = issues.toSorted(
  (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
);
const firstIssue = sorted[0];
if (!firstIssue) {
  console.log('No issues found.');
  process.exit(0);
}

const startYM = new Date(
  new Date(firstIssue.createdAt).getFullYear(),
  new Date(firstIssue.createdAt).getMonth(),
  1,
);

// Pre-fill stats for each month up to the current one
const stats: Record<string, { created: number; closed: number }> = {};
for (let d = new Date(); d >= startYM; d.setMonth(d.getMonth() - 1)) {
  const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  stats[ym] = { created: 0, closed: 0 };
}

// Tally creations and closures
for (const issue of sorted) {
  const createdAt = new Date(issue.createdAt);
  const createdYM = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
  stats[createdYM].created++;

  if (issue.closedAt) {
    const closedAt = new Date(issue.closedAt);
    const closedYM = `${closedAt.getFullYear()}-${String(closedAt.getMonth() + 1).padStart(2, '0')}`;
    if (stats[closedYM]) {
      stats[closedYM].closed++;
    }
  }
}

// CSV output: Year-Month, created issues, closed issues
await Bun.write(
  'issue_stats.csv',
  Object.entries(stats)
    .map(([ym, s]) => `${ym},${s.created},${s.closed}`)
    .join('\n'),
);
