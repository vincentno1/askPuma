"use client";
import { useState } from "react";
import type { AuditResult, SourceRecord } from "@/contracts/audit";

const reviewLabels = { checked: "原文已核對", imported_unchecked: "保存版本・原頁待核對", search_only: "搜尋來源・原文待核對" };
const originLabels = { curated: "已整理案例", saved: "已儲存回答", generated: "本次生成" };
const verdictLabels = { backed_by_sources: "這題有依據", missing_context: "先看完整脈絡", insufficient_evidence: "資料還不夠", valid_question: "這題可以質疑" };
const platformLabels: Record<string, string> = { facebook: "Facebook", threads: "Threads", instagram: "Instagram", youtube: "YouTube", website: "網站", document: "文件", other: "公開資料" };

export function Mascot({ variant }: { variant: "detective" | "afro" }) {
  const [missing, setMissing] = useState(false);
  return <img className={`mascot-image ${missing ? "asset-missing" : ""}`} src={`/illustrations/${variant}.png`} width={640} height={760} alt={variant === "afro" ? "戴爆炸頭與藍色拳套的原創 Puma 貓" : "拿放大鏡核對資料的原創 Puma 貓"} onError={() => setMissing(true)} />;
}
export function CityScene() {
  const [missing, setMissing] = useState(false);
  return <div className="city-scene" aria-hidden="true"><svg className="city-fallback" viewBox="0 0 1440 235" preserveAspectRatio="none"><defs><pattern id="windows" width="13" height="18" patternUnits="userSpaceOnUse"><rect width="5" height="9" fill="#468e67" /></pattern></defs><g fill="#9ed0f4"><path d="M0 78q28-40 56-6 37-19 52 12H0m690-6q17-33 39-8 22-12 34 13h-73m585-11q22-32 42-13 30-29 58 13z" /></g><g fill="#a0c882" stroke="#3f9569" strokeWidth="3"><path d="M18 192V121h48v71m17 0V146h34v46m101 0V135h50v57m850 0V140h47v52m40 0V115h40v77m22 0V153h46v39m26 0V133h43v59m-566 0V152h45v40" /><path d="M1268 192v-55h9v-26h-5V89h7V68h-3V48h9V26h5V5h3v21h5v22h8v20h-3v21h7v22h-5v26h9v55z" /></g><g fill="url(#windows)"><rect x="25" y="130" width="33" height="60" /><rect x="224" y="143" width="36" height="45" /><rect x="1120" y="122" width="27" height="70" /><rect x="1363" y="140" width="31" height="52" /></g><path d="M0 196v-35q12-21 28-5 15-35 35-12 20-24 34 3 18-27 38-5 14-31 35-12 31-22 47 8 24-15 35 6 34-23 50 9 26-28 43-5 21-24 48 7 34-30 52 1 20-23 44-1 30-22 49 11 34-36 54-8 17-25 34-3 30-25 55 3 26-25 46 2 19-21 42-3 22-29 43-2 20-26 40-6 30-24 48 2 20-21 42-1 20-24 45-1 22-23 46-2 28-35 47-5 20-27 44-3 17-20 37 0 30-35 51-7 24-24 46-2 23-22 42-3 20-24 39-1 18-22 35-5 17-22 36-4 17-25 30-2 20-24 35-4V196z" fill="#6dac69" stroke="#398f5e" strokeWidth="3" /><path d="M1120 196q64-77 128 0m-117 0q53-60 105 0" fill="#f7df91" stroke="#479c68" strokeWidth="4" /><path d="M0 197h1440v10H0" fill="#f9dc81" stroke="#3c9462" strokeWidth="2" /><path d="M0 208h1440v27H0" fill="#62a4eb" /><g stroke="#a7d5ee" strokeWidth="3"><path d="M20 220h58m63 6h39m231-8h49m353 8h69m457-6h40" /></g></svg><img className={`city-image ${missing ? "asset-missing" : ""}`} src="/illustrations/taipei.png" width={1600} height={400} alt="" onError={() => setMissing(true)} /></div>;
}
function sourceDate(source: SourceRecord) {
  if (!source.publishedAt || source.datePrecision === "unknown") return "日期未確認";
  const date = new Date(source.publishedAt); if (Number.isNaN(date.getTime())) return "日期未確認";
  return new Intl.DateTimeFormat("zh-TW", { timeZone: "Asia/Taipei", year: "numeric", ...(source.datePrecision !== "year" ? { month: "2-digit" } : {}), ...(source.datePrecision === "day" ? { day: "2-digit" } : {}) }).format(date);
}
function SourceLinks({ source }: { source: SourceRecord }) {
  return <div className="source-links">{source.archiveUrl && <a href={source.archiveUrl} target="_blank" rel="noreferrer">看保存版本 ↗</a>}<a href={source.url} target="_blank" rel="noreferrer">開原文 ↗</a></div>;
}
function SourceCard({ source, excerptId, hero = false }: { source: SourceRecord; excerptId?: string; hero?: boolean }) {
  const excerpt = source.excerpts.find(item => item.id === excerptId);
  return <article className={hero ? "source-card hero-source" : "source-card evidence-source"}>
    <header className="source-header"><div className="source-identity"><span className="source-avatar" aria-hidden="true">{source.kind === "primary_statement" ? "文" : source.kind === "official_policy" ? "政" : source.kind === "research" ? "研" : "報"}</span><div><h2>{source.author || source.publisher}</h2><p>{source.platform ? platformLabels[source.platform.toLowerCase()] || source.platform : source.publisher}・{sourceDate(source)}</p></div></div><span className={`review-badge review-${source.reviewStatus}`}>{source.reviewStatus === "checked" ? "✓ " : "◷ "}{reviewLabels[source.reviewStatus]}</span></header>
    {hero && excerpt ? <><p className="quote-label">{source.reviewStatus === "imported_unchecked" ? "公開索引保存文字" : "原文摘錄"}</p><blockquote>{excerpt.text}</blockquote></> : <h3 className="source-title">{source.title}</h3>}
    <div className="source-bottom">{hero && excerpt && <details className="context-details"><summary>看上下文 <span aria-hidden="true">＋</span></summary><div><p>{excerpt.locator}</p>{source.contextNote && <p>{source.contextNote}</p>}{source.excerpts.filter(item => item.id !== excerpt.id).map(item => <p key={item.id}>{item.text}</p>)}</div></details>}<SourceLinks source={source} /></div>
    {!hero && source.contextNote && <p className="source-context">{source.contextNote}</p>}
  </article>;
}
function readableExplanation(text: string, sources: SourceRecord[]) {
  let readable = text;
  for (const source of [...sources].sort((a, b) => b.id.length - a.id.length)) {
    const escapedId = source.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const exactId = new RegExp(`(?<![A-Za-z0-9_-])${escapedId}(?![A-Za-z0-9_-])`, "g");
    readable = readable.replace(exactId, () => source.publisher || source.title);
  }
  return readable.replace(/\b(imported_unchecked|search_only|checked)\b/g, status => reviewLabels[status as keyof typeof reviewLabels]);
}

function Headline({ title }: { title: string }) {
  const lines = title.split(/[\n／]/).filter(Boolean);
  if (lines.length > 1) return <h1 className="result-headline">{lines.map((line, index) => <span key={index}>{line}</span>)}</h1>;
  const punctuation = title.search(/[，,；;]/);
  if (punctuation > 1 && punctuation < title.length - 2) return <h1 className="result-headline"><span>{title.slice(0, punctuation + 1)}</span><span>{title.slice(punctuation + 1)}</span></h1>;
  return <h1 className="result-headline single-headline">{title}</h1>;
}
export function ResultView({ result, onAgain, onSerious }: { result: AuditResult; onAgain: () => void; onSerious: () => void }) {
  const explain = (text: string) => readableExplanation(text, result.sources);
  const playful = result.interactionMode === "playful";
  const roastComma = result.roast.indexOf("，");
  const roastLines = roastComma > 1 && roastComma < result.roast.length - 2
    ? [result.roast.slice(0, roastComma + 1), result.roast.slice(roastComma + 1)]
    : [result.roast];
  const heroSource = result.heroCitation ? result.sources.find(source => source.id === result.heroCitation?.sourceId && source.excerpts.some(excerpt => excerpt.id === result.heroCitation?.excerptId)) : undefined;
  const headlineSources = result.sources.filter(source => result.headlineSourceIds.includes(source.id));
  return <section className={`result-stage ${playful ? "playful-result" : "factual-result"}`} aria-label="核對結果"><CityScene /><div className="result-content">
    <div className="query-line"><div className="query-label"><span>你的攻擊角度</span><p>{result.query}</p></div><span className={`mode-badge ${playful ? "playful-badge" : ""}`}>{playful ? "✦ 玩梗模式" : result.interactionMode === "mixed" ? "事實＋旁白" : "事實核對"}</span></div>
    <div className="answer-origin">{originLabels[result.answerOrigin]}{result.verdict && <><span aria-hidden="true"> · </span>{verdictLabels[result.verdict]}</>}</div>
    <div className="answer-hero"><div className="answer-copy"><Headline title={result.title} />{headlineSources.length > 0 && <div className="headline-citations" aria-label="結論依據">依據：{headlineSources.map(source => <a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.publisher || source.title} ↗</a>)}</div>}{result.criticalLimitations.length > 0 && <div className="critical-limitations" aria-label="回答範圍">{result.criticalLimitations.map(item => <p key={item}>{explain(item)}</p>)}</div>}</div><div className="result-mascot"><Mascot variant={result.mascotVariant} /></div></div>
    {playful ? <><p className="playful-roast">{roastLines.map((line, index) => <span key={index}>{line}</span>)}</p><p className="playful-disclaimer">動漫旁白，非本人說法。</p><div className="result-actions"><button type="button" className="primary-button" onClick={onAgain}>換個角度再試 <span aria-hidden="true">→</span></button><button type="button" className="secondary-button" onClick={onSerious}>想看認真答案</button></div><div className="playful-details"><details className="detail-panel"><summary>這是什麼動漫梗？ <span aria-hidden="true">＋</span></summary><div className="detail-body"><p>{explain(result.summary)}</p>{result.limitations.map(item => <p key={item}>{explain(item)}</p>)}{result.sources.map(source => <SourceCard key={source.id} source={source} />)}</div></details></div></> : <>
      {heroSource ? <SourceCard source={heroSource} excerptId={result.heroCitation?.excerptId} hero /> : <div className="no-citation"><p className="quote-label">目前證據</p><p>{explain(result.summary)}</p><span>沒有可直接呈現的相關原文摘錄；不以旁白代替引言。</span></div>}
      {result.roast && <div className="roast-banner"><span>旁白</span><p>{result.roast}</p><i aria-hidden="true">〃</i></div>}
      {result.interactionMode === "mixed" && <p className="mixed-disclaimer">旁白是本站創作，非本人說法；事實判斷以列出的來源為準。</p>}
      <div className="details-grid"><details className="detail-panel"><summary>為什麼這樣說 <span aria-hidden="true">＋</span></summary><div className="detail-body"><p>{explain(result.summary)}</p>{result.claims.map(claim => <div className="claim" key={claim.id}><h3>{claim.claim}</h3><p>{explain(claim.finding)}</p><div className="claim-links">{claim.sourceIds.map(id => { const source = result.sources.find(item => item.id === id); return source ? <a key={id} href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a> : null; })}</div></div>)}</div></details><details className="detail-panel"><summary>其他證據 <span aria-hidden="true">＋</span></summary><div className="detail-body">{result.sources.filter(source => source.id !== heroSource?.id).map(source => <SourceCard key={source.id} source={source} />)}{result.sources.length === (heroSource ? 1 : 0) && <p>目前沒有其他可列出的相關來源。</p>}</div></details><details className="detail-panel"><summary>資料怎麼來的 <span aria-hidden="true">＋</span></summary><div className="detail-body"><p>這份回答為「{originLabels[result.answerOrigin]}」，使用本次列出的公開來源。已核對代表文字、日期與網址已核對，不代表來源裡的每個主張都成立。</p>{result.limitations.map(item => <p key={item}>{explain(item)}</p>)}<p>資料版本：{result.dataVersion}</p><p>保存時間：{new Intl.DateTimeFormat("zh-TW", { timeZone: "Asia/Taipei", dateStyle: "medium", timeStyle: "short" }).format(new Date(result.createdAt))}</p></div></details></div>
      <div className="result-actions factual-actions"><button type="button" className="primary-button" onClick={onAgain}>換個角度再試 <span aria-hidden="true">→</span></button></div>
    </>}
  </div></section>;
}
