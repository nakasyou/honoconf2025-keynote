// hono-package-sizes.ts
// Node 18+ / Bun / tsx 対応。外部依存なし。ESNext。top-level await 使用。

type Packument = {
  name: string;
  "dist-tags": Record<string, string>;
  time?: Record<string, string>;
  versions: Record<
    string,
    {
      version: string;
      dist: {
        tarball: string;
        integrity?: string;
        shasum?: string;
        // npm が付与してくれていれば入ってることがある（常にではない）
        fileCount?: number;
        unpackedSize?: number;
      };
    }
  >;
};

type SizeRow = {
  name: string;
  version: string;
  date?: string; // publish time（あれば）
  tarballUrl: string;
  compressedBytes?: number; // Content-Length
  unpackedBytes?: number;   // dist.unpackedSize
  fileCount?: number;       // dist.fileCount
  integrity?: string;
  shasum?: string;
};

const PACKAGE = "hono";
const REGISTRY = `https://registry.npmjs.org/${encodeURIComponent(PACKAGE)}`;

// 並列数（高すぎると 429 食らうことがあるので控えめに）
const CONCURRENCY = 8;
// 簡易リトライ設定
const MAX_RETRY = 3;
const RETRY_BASE_MS = 400;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchPackument(url: string): Promise<Packument> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Failed to fetch packument: ${res.status} ${res.statusText}`);
  return (await res.json()) as Packument;
}

async function headContentLength(url: string): Promise<number | undefined> {
  // HEAD が取れないサーバ設定はほぼ無いはずだが、念のためリトライ＆フォールバック
  for (let i = 0; i < MAX_RETRY; i++) {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (res.ok) {
      const len = res.headers.get("content-length");
      if (len && !Number.isNaN(Number(len))) return Number(len);
      // Content-Length 無い場合は諦める（GET で取るのは帯域コスト高なのでやらない）
      return undefined;
    }
    // 429/5xx は指数バックオフ
    if (res.status === 429 || res.status >= 500) {
      await sleep(RETRY_BASE_MS * 2 ** i);
      continue;
    }
    return undefined;
  }
  return undefined;
}

function toQueue<T>(items: T[], worker: (item: T) => Promise<void>, concurrency: number) {
  const it = items[Symbol.iterator]();
  const runners = Array.from({ length: concurrency }, async () => {
    for (;;) {
      const next = it.next();
      if (next.done) break;
      await worker(next.value);
    }
  });
  return Promise.all(runners);
}

const pack = await fetchPackument(REGISTRY);

// バージョン→日付のマップ（あれば）
const timeMap = pack.time ?? {};
// versions のキー順は任意なので、一応 SemVer 的にソートしたかったらここでやる。
// ただしシンプルに publish 時刻で並べる方が直感的なので、date をキーに並べ替え。
const entries = Object.values(pack.versions).map((v) => ({
  name: pack.name,
  version: v.version,
  date: timeMap[v.version], // undefined のこともある
  tarballUrl: v.dist.tarball,
  integrity: v.dist.integrity,
  shasum: v.dist.shasum,
  fileCount: v.dist.fileCount,
  unpackedBytes: v.dist.unpackedSize,
}));

// publish 日時があるやつは日時順、それ以外は最後に
entries.sort((a, b) => {
  if (a.date && b.date) return new Date(a.date).getTime() - new Date(b.date).getTime();
  if (a.date) return -1;
  if (b.date) return 1;
  return a.version.localeCompare(b.version);
});

const results: SizeRow[] = [];
let processed = 0;

await toQueue(entries, async (e) => {
  let compressedBytes: number | undefined;
  try {
    compressedBytes = await headContentLength(e.tarballUrl);
  } catch {
    // 取れなかったら undefined のまま
  }
  results.push({
    name: e.name,
    version: e.version,
    date: e.date,
    tarballUrl: e.tarballUrl,
    compressedBytes,
    unpackedBytes: e.unpackedBytes,
    fileCount: e.fileCount,
    integrity: e.integrity,
    shasum: e.shasum,
  });
  processed++;
  if (processed % 25 === 0) {
    // 進捗を出したくなければ消してOK
    console.error(`progress: ${processed}/${entries.length}`);
  }
}, CONCURRENCY);

// 出力：JSON 配列
console.log(JSON.stringify(results, null, 2));
