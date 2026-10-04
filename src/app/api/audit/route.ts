import { NextRequest, NextResponse } from 'next/server';
import { AuditError, InputSchema, cacheKey, curatedResult, matchPrepared, sessionFromCookie } from '@/server/core';
import { readLimit, reserve, savedResult, serviceConfig, settle, type Reservation } from '@/server/store';
import { generate } from '@/server/model';
export const runtime='nodejs';
export const maxDuration=60;
export const dynamic='force-dynamic';
export async function POST(request:NextRequest) {
  let requestId='unknown'; let cookie:string|null=null; let reservation:Reservation|undefined; const started=Date.now();
  const send=(body:unknown,status=200,retry?:number)=>{
    const response=NextResponse.json(body,{status,headers:{'Cache-Control':'no-store',...(retry?{'Retry-After':String(retry)}:{})}});
    if(cookie) response.cookies.set('askpuma_session',cookie,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:86400*7});
    return response;
  };
  try {
    if(Number(request.headers.get('content-length')||0)>8192) throw new AuditError('INVALID_INPUT',400,'問題最多500字。');
    const origin=request.headers.get('origin'); if(origin && origin!==request.nextUrl.origin) throw new AuditError('INVALID_INPUT',400,'請從本站送出問題。');
    const text=await request.text(); if(Buffer.byteLength(text,'utf8')>8192) throw new AuditError('INVALID_INPUT',400,'問題最多500字。');
    let body:unknown; try {body=JSON.parse(text);} catch {throw new AuditError('INVALID_INPUT',400,'請輸入有效問題。');}
    const parsed=InputSchema.safeParse(body); if(!parsed.success) throw new AuditError('INVALID_INPUT',400,'請輸入1–500字的問題，並提供有效 requestId。');
    const {query}=parsed.data; requestId=parsed.data.requestId;
    const config=await serviceConfig();const session=sessionFromCookie(request.headers.get('cookie'),config.sessionCookieSecret);cookie=session.cookie;
    const ip=(request.headers.get('x-forwarded-for')||request.headers.get('x-real-ip')||'unknown').split(',')[0].trim().slice(0,100);
    await readLimit(session.id,ip);
    const prepared=matchPrepared(query); if(prepared) return send({ok:true,result:curatedResult(prepared,query,requestId)});
    const key=cacheKey(query);const cached=await savedResult(key,query,requestId); if(cached) return send({ok:true,result:cached});
    if(!config.enableNewAnalysis) throw new AuditError('ANALYSIS_PAUSED',503,'新分析暫時關閉，仍可查看已整理案例。');
    if(!process.env.OPENAI_API_KEY) throw new AuditError('PROVIDER_UNAVAILABLE',503,'即時分析尚未啟用，請先查看已整理案例。');
    reservation=await reserve(key,session.id,ip,requestId,config);
    const {result,metadata}=await generate(query,requestId,reservation.enableWebSearch);
    await settle(reservation,result,metadata); reservation=undefined;
    console.info(JSON.stringify({event:'audit_complete',requestId,mode:result.mode,sourceIds:result.sources.map(s=>s.id),durationMs:Date.now()-started}));
    return send({ok:true,result});
  } catch(error) {
    if(reservation) {try {await settle(reservation,null,{error:'provider_or_result_failure'});} catch { /* remain reserved and lease expires; fail closed */ }}
    const timeout=error instanceof Error && (/timeout|abort/i.test(error.name));
    const failure=error instanceof AuditError?error:new AuditError(timeout?'ANALYSIS_TIMEOUT':'PROVIDER_UNAVAILABLE',timeout?504:503,timeout?'分析超時，請稍後再試。':'這次分析暫時無法完成，請稍後再試。');
    console.warn(JSON.stringify({event:'audit_error',requestId,code:failure.code,durationMs:Date.now()-started}));
    return send({ok:false,error:{code:failure.code,message:failure.message,...(failure.retryAfterSeconds?{retryAfterSeconds:failure.retryAfterSeconds}:{})},requestId},failure.status,failure.retryAfterSeconds);
  }
}
