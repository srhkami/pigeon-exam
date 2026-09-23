import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {gzipSync} from 'node:zlib';

const dir = process.argv[2];
if (!dir) throw new Error('需要隔離建置目錄');
const {chunks} = JSON.parse(readFileSync(join(dir, 'chunk-module-map.json'), 'utf8'));
const byName = new Map(chunks.map((chunk) => [chunk.fileName, chunk]));
const entry = chunks.find((chunk) => chunk.isEntry);
if (!entry) throw new Error('找不到入口');
const home = chunks.find((chunk) => chunk.modules.some((module) => module.endsWith('/src/features/Home/Home.tsx')));
const visited = new Set();
function collect(chunk) {
  if (!chunk || visited.has(chunk.fileName)) return;
  visited.add(chunk.fileName);
  for (const name of chunk.imports) collect(byName.get(name));
}
collect(entry);
if (home) collect(home);
const names = [...visited].sort();
const gzipBytes = names.reduce((total, name) => total + gzipSync(readFileSync(join(dir, name))).length, 0);
const heavy = /\/(?:recharts|@tiptap|@dnd-kit|pdfjs-dist|react-markdown)\//;
const eagerHeavy = names.flatMap((name) => (byName.get(name)?.modules ?? []).filter((module) => heavy.test(module))).slice(0, 12);
console.log(JSON.stringify({gzipBytes, chunkCount: names.length, entry: entry.fileName, home: home?.fileName ?? entry.fileName, eagerHeavy, chunks: names}, null, 2));
