/** Node 22.18+: node --experimental-strip-types scripts/import-posts.ts [--refresh] */
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { createRequire } from "node:module";
const { SourceSchema } = createRequire(import.meta.url)("../src/contracts/audit.ts") as typeof import("../src/contracts/audit");

const root = resolve(import.meta.dirname, "..");
const endpoint = "https://mayor2026.observe.tw/api/posts/shen-poyang.json";
const accountsEndpoint = "https://mayor2026.observe.tw/api/sources.json";
const archiveUrl = "https://mayor2026.observe.tw/taipei/shen-poyang/";
const snapshotPath = resolve(root, "data/snapshots/shen-poyang.json");
const accountsPath = resolve(root, "data/snapshots/upstream-sources.json");
const metadataPath = resolve(root, "data/import-metadata.json");
const sha = (text: string) => createHash("sha256").update(text).digest("hex");
const normalizationVersion = 3;
/** Exact contiguous text, grouped at paragraph/sentence boundaries; never paraphrase. */
function segmentText(text: string) {
  const chars = Array.from(text);
  const excerpts: { id: string; text: string; locator: string }[] = [];
  let start = 0;
  while (start < chars.length) {
    const remaining = chars.length - start;
    let length = Math.min(700, remaining);
    if (remaining > 700) {
      // Avoid a tiny final tail where the original boundaries allow it.
      const upper = Math.min(700, remaining - 300);
      let paragraphEnd = 0;
      let lineEnd = 0;
      let sentenceEnd = 0;
      for (let offset = 299; offset < upper; offset++) {
        const at = start + offset;
        if (chars[at] === "\n") {
          lineEnd = offset + 1;
          const before = chars.slice(Math.max(start, at - 4), at).join("");
          if (/\n[ \t⠀\r]*$/.test(before)) paragraphEnd = offset + 1;
        }
        if (/[。！？.!?；;]/.test(chars[at])) sentenceEnd = offset + 1;
      }
      length = paragraphEnd || lineEnd || sentenceEnd || upper;
    }
    const index = excerpts.length + 1;
    excerpts.push({ id: `e${index}`, text: chars.slice(start, start + length).join(""), locator: `公開索引保存文字・第${index}個連續摘錄（前後摘錄依序接續）` });
    start += length;
  }
  return excerpts;
}
const refresh = process.argv.includes("--refresh");
await mkdir(resolve(root, "data/snapshots"), { recursive: true });
if (refresh) {
  for (const [url, path] of [[endpoint, snapshotPath], [accountsEndpoint, accountsPath]]) {
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`Upstream HTTP ${response.status}`);
    const body = await response.text();
    JSON.parse(body);
    await writeFile(path, body);
  }
}
const raw = await readFile(snapshotPath, "utf8");
const accountsRaw = await readFile(accountsPath, "utf8");
const upstream = JSON.parse(raw);
const accountRoot = JSON.parse(accountsRaw);
if (!Array.isArray(upstream.posts) || upstream.count !== upstream.posts.length) throw new Error("Invalid root.posts/count");
const candidate = accountRoot.sources.find((entry: { id: string }) => entry.id === "shen-poyang");
if (!candidate?.accounts?.length) throw new Error("Missing candidate account whitelist");
const allowed = new Map<string, { id: string; platform: string; url: string }>(candidate.accounts.map((a: { id: string }) => [a.id, a]));
let previous: { snapshotSha256?: string; retrievedAt?: string } = {};
try { previous = JSON.parse(await readFile(metadataPath, "utf8")); } catch { /* first import */ }
const snapshotSha256 = sha(raw);
const retrievedAt = !refresh && previous.snapshotSha256 === snapshotSha256 && previous.retrievedAt ? previous.retrievedAt : new Date().toISOString();
const seenIds = new Set<string>();
const seenUrls = new Set<string>();
const bodyHashes = new Set<string>();
let duplicates = 0;
let repeatedText = 0;
const platformCounts: Record<string, number> = {};
const records = [];
for (const post of upstream.posts) {
  const account = allowed.get(post.sourceId);
  if (!account || account.platform !== post.platform || post.candidateId !== "shen-poyang") throw new Error(`Unknown account: ${post.sourceId}`);
  if (typeof post.id !== "string" || typeof post.text !== "string" || !post.text.trim()) throw new Error("Invalid post id/text");
  const url = new URL(post.url);
  if (url.protocol !== "https:") throw new Error(`Non-HTTPS URL: ${post.id}`);
  const accountHost = new URL(account.url).hostname;
  if (url.hostname.replace(/^www\./, "") !== accountHost.replace(/^www\./, "")) throw new Error(`Unexpected platform host: ${post.id}`);
  const publishedAt = post.postedAt === "" || post.postedAt == null ? null : post.postedAt;
  if (publishedAt != null && (typeof publishedAt !== "string" || !Number.isFinite(Date.parse(publishedAt)))) throw new Error(`Invalid date: ${post.id}`);
  if (seenIds.has(post.id) || seenUrls.has(post.url)) { duplicates++; continue; }
  seenIds.add(post.id); seenUrls.add(post.url);
  const bodyHash = sha(post.text);
  if (bodyHashes.has(bodyHash)) repeatedText++;
  bodyHashes.add(bodyHash);
  platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;
  records.push(SourceSchema.parse({
    id: `archive-${sha(post.id).slice(0, 20)}`,
    title: `沈伯洋｜${post.platform}｜${publishedAt?.slice(0, 10) ?? "日期未確認"}`,
    url: post.url, publisher: "沈伯洋公開帳號", author: "沈伯洋", publishedAt,
    datePrecision: publishedAt ? "day" : "unknown", retrievedAt, kind: "primary_statement",
    reviewStatus: "imported_unchecked", origin: "mayor2026_archive", platform: post.platform,
    upstreamId: post.id, archiveUrl,
    excerpts: segmentText(post.text),
    contextNote: "公開資料庫保存版本，原頁尚未逐筆核對；日期與文字依上游紀錄，未驗證每項主張。貼文索引：2026 市長官方來源觀測站。",
  }));
}
const dates = records.flatMap(record => record.publishedAt ? [record.publishedAt] : []).sort((a, b) => Date.parse(a) - Date.parse(b));
const metadata = {
  dataVersion: `archive-v${normalizationVersion}-${snapshotSha256.slice(0, 12)}`, normalizationVersion, endpoint, accountsEndpoint, archiveUrl,
  retrievedAt, upstreamVersion: upstream.version, upstreamCount: upstream.count, importedCount: records.length,
  snapshotSha256, accountsSha256: sha(accountsRaw), duplicateIdOrUrlCount: duplicates,
  repeatedTextAcrossDistinctRecords: repeatedText, platformCounts, earliestPublishedAt: dates[0] ?? null,
  latestPublishedAt: dates.at(-1) ?? null, missingDateCount: records.filter(record => !record.publishedAt).length,
  reviewStatus: "imported_unchecked", attribution: "貼文索引：2026 市長官方來源觀測站 https://mayor2026.observe.tw/about/",
  notes: ["不包含所有歷史貼文；2014文章另列核心來源。", "相同文字但不同平台的紀錄保留原始連結與日期，不把平台差異抹去。", "上游AI分類未作查核依據；原作者保有內容權利，本站只展示相關短摘錄。", "原字連續摘錄按自然段／句界切分，目標300–700字；短貼文保持完整。全文只供後端索引，不公開完整資料集。"],
};
await writeFile(resolve(root, "data/posts.json"), JSON.stringify(records, null, 2) + "\n");
await writeFile(metadataPath, JSON.stringify(metadata, null, 2) + "\n");
console.log(JSON.stringify({ dataVersion: metadata.dataVersion, count: records.length, platformCounts, snapshotSha256 }));
