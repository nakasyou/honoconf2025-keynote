type Label = {
  id: string;
  name: string;
  description: string | null;
  color: string;
};

type Issue = {
  closedAt: string | null;
  labels: Label[];
};

const issues: Issue[] = await Bun.file('hono_issues.json').json();

// Only issues with a closed timestamp contribute to the label tally.
const closedIssues = issues.filter((issue) => issue.closedAt);
if (closedIssues.length === 0) {
  console.log('No closed issues found.');
  process.exit(0);
}

const sorted = closedIssues.toSorted(
  (a, b) => new Date(a.closedAt!).getTime() - new Date(b.closedAt!).getTime(),
);

const firstClosedAt = new Date(sorted[0].closedAt!);
const lastClosedAt = new Date(sorted[sorted.length - 1].closedAt!);

// Snap to the first day of the month for iteration boundaries.
const start = new Date(firstClosedAt.getFullYear(), firstClosedAt.getMonth(), 1);
const end = new Date(lastClosedAt.getFullYear(), lastClosedAt.getMonth(), 1);

const labelNames = Array.from(
  new Set(sorted.flatMap((issue) => issue.labels.map((label) => label.name))),
).sort();

const stats: Record<string, Record<string, number>> = {};

for (
  let cursor = new Date(start);
  cursor.getFullYear() < end.getFullYear() ||
  (cursor.getFullYear() === end.getFullYear() && cursor.getMonth() <= end.getMonth());
  cursor.setMonth(cursor.getMonth() + 1)
) {
  const ym = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
  stats[ym] = Object.fromEntries(labelNames.map((name) => [name, 0]));
}

for (const issue of sorted) {
  const closedAt = new Date(issue.closedAt!);
  const ym = `${closedAt.getFullYear()}-${String(closedAt.getMonth() + 1).padStart(2, '0')}`;
  const stat = stats[ym];
  if (!stat) {
    continue;
  }
  for (const label of issue.labels) {
    if (label.name in stat) {
      stat[label.name] += 1;
    }
  }
}
const escapeCsv = (value: string | number) => {
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};
const header = ['month', ...labelNames];
const lines = Object.entries(stats).map(([ym, stat]) =>
  [ym, ...labelNames.map((name) => stat[name] ?? 0)].map(escapeCsv).join('\t'),
);

await Bun.write('issue_label_stats.csv', [header.map(escapeCsv).join('\t'), ...lines].join('\n'));
