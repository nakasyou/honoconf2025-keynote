const size = await Bun.file('size.json').json() as {
  version: string;
  unpackedBytes: number;
}[]

const header = ['version', 'unpackedBytes'];
const lines = size.map(s => [s.version, s.unpackedBytes].join('\t'));

await Bun.write('size.tsv', [header.join('\t'), ...lines].join('\n'));
