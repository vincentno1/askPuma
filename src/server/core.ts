import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { AuditResultSchema, ModelAnswerSchema, PreparedCaseSchema, SourceSchema, type AuditResult, type ModelAnswer, type PreparedCase, type SourceRecord } from '@/contracts/audit';
import casesData from '../../data/cases.json';
import sourcesData from '../../data/sources.json';
import postsData from '../../data/posts.json';
import importMetadata from '../../data/import-metadata.json';

export const DATA_VERSION = process.env.DATA_VERSION || importMetadata.dataVersion || '2026-10-04-v1';
export const PROMPT_VERSION = 'v2';
export const MODEL_VERSION = 'gpt-6-astra';
export const InputSchema = z.object({ query: z.string().trim().min(1).max(500), requestId: z.string().min(8).max(128).regex(/^[a-zA-Z0-9_-]+$/) }).strict();
export class AuditError extends Error {
  constructor(public code: string, public status: number, message: string, public retryAfterSeconds?: number) { super(message); }
}
export const paused = () => new AuditError('ANALYSIS_PAUSED',503,'新分析暫時未開放，請稍後再試。');
export const hash = (value: string) => createHash('sha256').update(value).digest('hex');
export const normalizeQuery = (query: string) => query.trim().replace(/\s+/g,' ').replace(/？/g,'?').replace(/！/g,'!').replace(/，/g,',');
export const cacheKey = (query: string) => hash(JSON.stringify([normalizeQuery(query),DATA_VERSION,PROMPT_VERSION,MODEL_VERSION]));
export function allowedOrigin(origin: string | null, requestOrigin: string) {
  if (!origin) return true;
  const allowed = new Set(['https://askpuma--askpuma-prod.asia-east1.hosted.app']);
  const configured = process.env.PUBLIC_SITE_ORIGIN;
  if (configured) { try { const url = new URL(configured); if(url.protocol==='https:' && url.origin===configured) allowed.add(configured); } catch { /* malformed configured origin is ignored */ } }
  if (process.env.NODE_ENV !== 'production') {
    try { const url = new URL(requestOrigin); if (['localhost','127.0.0.1','[::1]'].includes(url.hostname) && ['http:','https:'].includes(url.protocol)) allowed.add(url.origin); } catch { /* invalid internal URL is not trusted */ }
  }
  return allowed.has(origin);
}

export function signSession(id: string, secret: string) { return `${id}.${createHmac('sha256',secret).update(id).digest('base64url')}`; }
export function sessionFromCookie(cookie: string | null, secret: string) {
  const value = cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith('askpuma_session='))?.slice(16);
  if (value) {
    const [id,signature] = value.split('.');
    if (/^[a-f0-9-]{36}$/.test(id || '') && signature) {
      const expected = signSession(id,secret).split('.')[1];
      if (signature.length===expected.length && timingSafeEqual(Buffer.from(signature),Buffer.from(expected))) return {id,cookie:null};
    }
  }
  const id=randomUUID(); return {id,cookie:signSession(id,secret)};
}
export function preparedCases(): PreparedCase[] { return z.array(PreparedCaseSchema).parse(casesData); }
export function localSources(): SourceRecord[] {
  const all = [...z.array(SourceSchema).parse(postsData),...z.array(SourceSchema).parse(sourcesData)];
  return [...new Map(all.map(s=>[s.id,s])).values()].filter(s=>s.url.startsWith('https://'));
}
export function matchPrepared(query: string) {
  return preparedCases().find(c=>c.status==='ready' && c.reviewedAt && c.dataVersion===DATA_VERSION && [c.canonicalQuery,...c.reviewedAliases].some(q=>normalizeQuery(q)===normalizeQuery(query)));
}
function terms(text:string) {
  const normalized=text.toLowerCase(); const terms=new Set(normalized.match(/[a-z0-9]{2,}|[\p{Script=Han}]{2,}/gu) || []);
  for(const run of normalized.match(/[\p{Script=Han}]+/gu)||[]) for(let i=0;i<run.length-1;i++) terms.add(run.slice(i,i+2));
  return [...terms];
}
export function retrieve(query:string, records:SourceRecord[], limit=8): SourceRecord[] {
  const keywords=terms(query); if(!keywords.length) return [];
  const scored=records.flatMap(source=>source.excerpts.flatMap(excerpt=>{
    const text=excerpt.text.slice(0,1200); const haystack=`${source.title} ${text}`.toLowerCase();
    const score=keywords.reduce((total,word)=>total+(haystack.includes(word)?(word.length>2?3:1):0),0);
    return score>=2?[{source,excerpt:{...excerpt,text},score}]:[];
  })).sort((a,b)=>b.score-a.score || (a.source.reviewStatus==='checked'?-1:1));
  const chosen=new Map<string,SourceRecord>(); let count=0;
  for(const item of scored) {
    if(count>=Math.min(limit,8)) break;
    const existing=chosen.get(item.source.id);
    if(existing && existing.excerpts.length>=2) continue;
    if(existing) existing.excerpts.push(item.excerpt); else chosen.set(item.source.id,{...item.source,excerpts:[item.excerpt]}); count++;
  }
  return [...chosen.values()];
}
export function validateAnswer(raw: ModelAnswer, sources: SourceRecord[], query:string): ModelAnswer {
  const answer=ModelAnswerSchema.parse(raw); const byId=new Map(sources.map(s=>[s.id,s]));
  if(answer.criticalLimitations.length>2 || answer.claims.length>8 || answer.limitations.length>8) throw new Error('Answer exceeds limits');
  const ids=[...answer.headlineSourceIds,...answer.claims.flatMap(c=>c.sourceIds)];
  if(ids.some(id=>!byId.has(id))) throw new Error('Unknown source reference');
  if(answer.heroCitation) {
    const s=byId.get(answer.heroCitation.sourceId);
    if(!s || s.kind!=='primary_statement' || s.reviewStatus==='search_only' || !s.excerpts.some(e=>e.id===answer.heroCitation!.excerptId)) throw new Error('Invalid quotation reference');
  }
  if(answer.interactionMode==='playful') {
    if(answer.verdict!==null || answer.heroCitation!==null || answer.headlineSourceIds.length || answer.claims.length || /(?:收錢|貪污|犯罪|詐騙|政策|說過|親口|吸毒|供毒|午餐|市政|學歷)/u.test(query)) throw new Error('Invalid playful factual finding');
    answer.criticalLimitations=['這是本站原創玩梗，不是本人說法或真實動機。'];
  } else {
    if(answer.verdict===null) throw new Error('Missing factual verdict');
    const used=[...new Set(ids)].map(id=>byId.get(id)!);
    if(answer.verdict!=='insufficient_evidence' && (!answer.headlineSourceIds.length || !answer.headlineSourceIds.some(id=>byId.get(id)?.reviewStatus==='checked'))) {
      answer.verdict='insufficient_evidence'; answer.title='這題目前證據不足';
      answer.summary='目前資料還不能支持確定結論。'+answer.summary;
      answer.criticalLimitations=['未找到足以支持主結論的已核對來源。',...answer.criticalLimitations].slice(0,2);
    }
    if(used.some(s=>s.reviewStatus!=='checked') || (answer.heroCitation && byId.get(answer.heroCitation.sourceId)?.reviewStatus!=='checked')) {
      const note='部分來源尚未逐筆核對，保存文字或搜尋摘要不等於已確認原話。';
      answer.criticalLimitations=[note,...answer.criticalLimitations.filter(s=>s!==note)].slice(0,2);
    }
  }
  if([...answer.title].length>36) answer.title=answer.interactionMode==='playful'?'玩梗時間：戰鬥型態已啟動':answer.verdict==='insufficient_evidence'?'這題目前證據不足':'先看證據，再看攻擊角度';
  if([...answer.roast].length>56) answer.roast='先確認有沒有命中，再決定要不要放大招。';
  return answer;
}
export function curatedResult(prepared:PreparedCase,query:string,requestId:string):AuditResult {
  const all=localSources(); const sources=prepared.sourceRefs.map(id=>{ const source=all.find(s=>s.id===id); if(!source) throw new Error('Prepared case source missing'); return source; });
  const answer=validateAnswer(prepared.resultTemplate,sources,query);
  return AuditResultSchema.parse({...answer,id:randomUUID(),requestId,query,sources,mode:'curated',answerOrigin:'curated',caseId:prepared.id,mascotVariant:prepared.resultTemplate.mascotVariant,memeId:prepared.resultTemplate.memeId,cacheHit:false,createdAt:prepared.reviewedAt!,dataVersion:prepared.dataVersion,promptVersion:prepared.promptVersion,modelVersion:prepared.modelVersion});
}
