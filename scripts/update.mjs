// Pulls release metadata for AI developer tools from vibecodingturkey.com/releases and merges it into data/.
// The upstream export holds only recent releases per tool; this repo keeps every version it has ever seen.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

export const SOURCE = 'https://vibecodingturkey.com/releases/data/releases.json';
const cell = (v) => (v === null || v === undefined ? '' : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));

export function merge(prev, next) {
  const old = new Map((prev?.tools || []).map((t) => [t.slug, t]));
  const tools = next.tools.map((t) => {
    const seen = new Map((old.get(t.slug)?.releases || []).map((r) => [r.version, r]));
    for (const r of t.releases) seen.set(r.version, r);
    return { ...t, releases: [...seen.values()].sort((a, b) => b.date.localeCompare(a.date)) };
  });
  // A tool dropped upstream keeps its history here.
  for (const [slug, t] of old) if (!tools.some((x) => x.slug === slug)) tools.push(t);
  return { generated: next.generated, page: next.page, tools: tools.sort((a, b) => a.slug.localeCompare(b.slug)) };
}

export function write(dir, data) {
  if (!Array.isArray(data.tools) || data.tools.length < 20 || data.tools.some((t) => !t.releases.length)) throw new Error('suspicious export');
  writeFileSync(`${dir}/releases.json`, JSON.stringify(data, null, 1) + '\n');
  const rows = data.tools.flatMap((t) => t.releases.map((r) => [t.slug, t.name, t.repo, t.kind, r.version, r.tag, r.date, r.url, r.major ? 1 : 0, r.breaking ? 1 : 0]));
  writeFileSync(`${dir}/releases.csv`, ['tool,name,repo,kind,version,tag,date,url,major,breaking', ...rows.map((r) => r.map(cell).join(','))].join('\n') + '\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = new URL('../data', import.meta.url).pathname;
  const res = await fetch(SOURCE, { headers: { 'user-agent': 'ai-dev-tool-releases' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const prev = existsSync(`${dir}/releases.json`) ? JSON.parse(readFileSync(`${dir}/releases.json`, 'utf8')) : null;
  const data = merge(prev, await res.json());
  write(dir, data);
  console.log(`${data.tools.length} tools, ${data.tools.reduce((n, t) => n + t.releases.length, 0)} releases`);
}
