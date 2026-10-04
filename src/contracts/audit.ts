import { z } from "zod";

export const SourceSchema = z.object({
  id: z.string(), title: z.string(), url: z.string().url(), publisher: z.string(),
  author: z.string().nullable(), publishedAt: z.string().nullable(), updatedAt: z.string().optional(),
  datePrecision: z.enum(["day", "month", "year", "unknown"]), retrievedAt: z.string(),
  kind: z.enum(["primary_statement", "official_policy", "research", "news_report"]),
  reviewStatus: z.enum(["checked", "search_only", "imported_unchecked"]),
  origin: z.enum(["direct", "web_search", "mayor2026_archive"]).optional(),
  platform: z.string().optional(), upstreamId: z.string().optional(), archiveUrl: z.string().url().optional(),
  excerpts: z.array(z.object({id:z.string(),text:z.string(),locator:z.string()})), contextNote: z.string(),
});
export const ClaimSchema = z.object({id:z.string(),claim:z.string(),finding:z.string(),relation:z.enum(["supports","contradicts","context","unresolved"]),sourceIds:z.array(z.string())});
export const ModelAnswerSchema = z.object({
  title:z.string(), interactionMode:z.enum(["factual","playful","mixed"]),
  verdict:z.enum(["backed_by_sources","missing_context","insufficient_evidence","valid_question"]).nullable(),
  roast:z.string(),summary:z.string(),claims:z.array(ClaimSchema),limitations:z.array(z.string()),
  criticalLimitations:z.array(z.string()),headlineSourceIds:z.array(z.string()),
  heroCitation:z.object({sourceId:z.string(),excerptId:z.string()}).nullable(),
});
export const AuditResultSchema = ModelAnswerSchema.extend({
  id:z.string(),requestId:z.string(),query:z.string(),sources:z.array(SourceSchema),
  mode:z.enum(["curated","indexed","web","mixed"]),answerOrigin:z.enum(["curated","saved","generated"]),
  caseId:z.string().nullable(),mascotVariant:z.enum(["detective","afro"]),memeId:z.string().nullable(),
  cacheHit:z.boolean(),createdAt:z.string(),dataVersion:z.string(),promptVersion:z.string(),modelVersion:z.string().nullable(),
});
export const PreparedCaseSchema = z.object({
  id:z.string(),canonicalQuery:z.string(),reviewedAliases:z.array(z.string()),status:z.enum(["draft","ready"]),
  sourceRefs:z.array(z.string()),resultTemplate:ModelAnswerSchema.extend({mascotVariant:z.enum(["detective","afro"]),memeId:z.string().nullable()}),
  reviewedAt:z.string().nullable(),dataVersion:z.string(),promptVersion:z.string(),modelVersion:z.string().nullable(),
});
export type SourceRecord=z.infer<typeof SourceSchema>;
export type ModelAnswer=z.infer<typeof ModelAnswerSchema>;
export type AuditResult=z.infer<typeof AuditResultSchema>;
export type PreparedCase=z.infer<typeof PreparedCaseSchema>;
export type AuditResponse={ok:true;result:AuditResult}|{ok:false;error:{code:string;message:string;retryAfterSeconds?:number};requestId:string};
export const DEMO_QUERIES = [
  {label:"針具與減害",query:"發針頭給吸毒者，是鼓勵吸毒嗎？"},
  {label:"爆炸頭",query:"為什麼要留爆炸頭？"},
  {label:"營養午餐",query:"Puma 一下免費、一下自費，營養午餐髮夾彎？"},
] as const;
