const changed: { date: string; changed: { path: string; add: number; delete: number }[] }[] = await Bun.file('changed.json').json();

const paths = new Set<string>();

const changes: {
  [date: string]: {
    [path: string]: number;
  }
} = {};

for (const dat of changed) {

  for (const change of dat.changed) {
    // src 直下
    if (!change.path.startsWith('src/') || change.path.split('/').length !== 2 || change.path.includes('}') || change.path.endsWith('.js') || change.path.endsWith('.test.ts')) {
      continue 
    }
    console.log(change.path);

    paths.add(change.path)
    changes[dat.date] = changes[dat.date] || {};
    changes[dat.date][change.path] = (changes[dat.date][change.path] ?? 0) + change.add + change.delete;
  }
}

// to tsv
const header = ['date', ...Array.from(paths).sort()];
const lines = Object.entries(changes).map(([date, change]) =>
  [date, ...Array.from(paths).sort().map((path) => change[path] ?? 0)].join('\t'),
);

await Bun.write('changed_summary.tsv', [header.join('\t'), ...lines].join('\n'));



export {}
