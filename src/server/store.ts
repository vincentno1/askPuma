import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { AuditResultSchema, type AuditResult } from '@/contracts/audit';
import { AuditError, hash, paused } from './core';

export type ServiceConfig={budgetDate:string|null;enableNewAnalysis:boolean;enableWebSearch:boolean;dailyBudgetUSD:number;maxPaidRequestsPerDay:number;reservationUSD:number;sessionCookieSecret:string};
export function database():Firestore {
  const app=getApps()[0] || initializeApp({credential:applicationDefault(),projectId:process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'askpuma-prod'});
  return getFirestore(app);
}
export async function serviceConfig():Promise<ServiceConfig> {
  try {
    const doc=await database().doc('config/service').get(); const d=doc.data();
    const secret=process.env.SESSION_COOKIE_SECRET || d?.sessionCookieSecret;
    if(!d || typeof d.enableNewAnalysis!=='boolean' || typeof d.enableWebSearch!=='boolean' || typeof secret!=='string' || secret.length<32) throw paused();
    const budgetDate=typeof d.budgetDate==='string'?d.budgetDate:null;
    return {budgetDate,enableNewAnalysis:d.enableNewAnalysis && budgetDate===taipeiDay(Date.now()),enableWebSearch:d.enableWebSearch,dailyBudgetUSD:Math.min(45,positive(d.dailyBudgetUSD,45)),maxPaidRequestsPerDay:Math.min(40,positive(d.maxPaidRequestsPerDay,40)),reservationUSD:Math.max(1,positive(d.reservationUSD,1)),sessionCookieSecret:secret};
  } catch { throw paused(); }
}
function positive(n:unknown,fallback:number) { return typeof n==='number' && Number.isFinite(n) && n>0?n:fallback; }
function taipeiDay(now:number) {return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export async function readLimit(session:string,ip:string) {
  const db=database(); const now=Date.now(); const window=Math.floor(now/600_000);
  const refs=[db.doc(`rateLimits/read-session-${hash(session)}-${window}`),db.doc(`rateLimits/read-ip-${hash(ip)}-${window}`),db.doc(`rateLimits/read-global-${Math.floor(now/60_000)}`)];
  try { await db.runTransaction(async tx=>{
    const docs=await tx.getAll(...refs); const caps=[60,200,300];
    docs.forEach((d,i)=>{if((d.data()?.count||0)>=caps[i]) throw new AuditError('RATE_LIMITED',429,'查詢次數較多，請稍後再試。',60);});
    docs.forEach((d,i)=>tx.set(refs[i],{count:(d.data()?.count||0)+1,expiresAt:now+86400000}));
  }); } catch(e) { if(e instanceof AuditError) throw e; throw paused(); }
}
export async function savedResult(key:string,query:string,requestId:string):Promise<AuditResult|null> {
  try {
    const db=database(); const cache=(await db.doc(`auditCache/${key}`).get()).data();
    if(!cache || cache.expiresAt<=Date.now() || typeof cache.resultId!=='string') return null;
    const snap=await db.doc(`auditResults/${cache.resultId}`).get(); const parsed=AuditResultSchema.safeParse(snap.data()?.result);
    if(!parsed.success) return null;
    return {...parsed.data,query,requestId,answerOrigin:'saved',cacheHit:true};
  } catch { throw paused(); }
}
export type Reservation={key:string;requestKey:string;owner:string;day:string;amount:number;enableWebSearch:boolean};
export async function reserve(key:string,session:string,ip:string,requestId:string,config:ServiceConfig):Promise<Reservation> {
  const db=database(); const now=Date.now(); const day=taipeiDay(now); const owner=hash(`${session}:${requestId}:${now}`); const requestKey=`request-${hash(`${session}:${requestId}`)}`;
  const lock=db.doc(`auditLocks/${key}`), request=db.doc(`auditLocks/${requestKey}`), usage=db.doc(`usageDays/${day}`), global=db.doc('rateLimits/paid-global');
  const window=Math.floor(now/600_000); const sessionRef=db.doc(`rateLimits/paid-session-${hash(session)}-${window}`),ipRef=db.doc(`rateLimits/paid-ip-${hash(ip)}-${window}`),configRef=db.doc('config/service'),cache=db.doc(`auditCache/${key}`);
  try {
    return await db.runTransaction(async tx=>{
      const [l,r,u,g,s,i,c,cached]=await tx.getAll(lock,request,usage,global,sessionRef,ipRef,configRef,cache);
      const live=c.data();
      if(!live || live.budgetDate!==day || config.budgetDate!==day) throw new AuditError('ANALYSIS_PAUSED',503,'首日新分析已結束，仍可查看已整理案例與已儲存回答。');
      if(live.enableNewAnalysis!==true || !config.enableNewAnalysis) throw paused();
      if(cached.data()?.expiresAt>now || l.data()?.expiresAt>now) throw new AuditError('QUERY_IN_PROGRESS',409,'相同問題正在整理或已完成，請稍後再試。',2);
      if(r.exists && r.data()?.expiresAt>now) {
        if(r.data()?.queryKey!==key) throw new AuditError('INVALID_INPUT',400,'同一 requestId 不能用於不同問題。');
        throw new AuditError(r.data()?.status==='failed'?'PROVIDER_UNAVAILABLE':'QUERY_IN_PROGRESS',r.data()?.status==='failed'?503:409,'這筆請求已處理，請稍後確認結果。',5);
      }
      const active=Object.fromEntries(Object.entries(g.data()?.leases || {}).filter(([,expires])=>typeof expires==='number' && expires>now));
      if(Object.keys(active).length>=4) throw new AuditError('RATE_LIMITED',429,'大家正在提問，請稍後再試。',15);
      if((s.data()?.count||0)>=3 || (i.data()?.count||0)>=30) throw new AuditError('RATE_LIMITED',429,'新分析次數已達上限，請稍後再試。',Math.ceil((600_000-now%600_000)/1000));
      const amount=Math.max(config.reservationUSD,positive(live.reservationUSD,1));
      const budget=Math.min(config.dailyBudgetUSD,positive(live.dailyBudgetUSD,45),45), cap=Math.min(config.maxPaidRequestsPerDay,positive(live.maxPaidRequestsPerDay,40),40);
      const prior=u.data() || {}; const used=Number(prior.usedUSD||0),reserved=Number(prior.reservedUSD||0),count=Number(prior.paidRequests||0);
      if(![used,reserved,count].every(Number.isFinite) || used<0 || reserved<0 || count<0) throw paused();
      if(used+reserved+amount>budget || count>=cap) throw new AuditError('BUDGET_REACHED',429,'今天的新分析額度已用完，仍可查看已整理案例。');
      tx.set(lock,{owner,expiresAt:now+120_000,status:'working'});
      tx.set(request,{owner,queryKey:key,expiresAt:now+86400000,status:'working'});
      tx.set(global,{leases:{...active,[owner]:now+120_000}});
      tx.set(sessionRef,{count:(s.data()?.count||0)+1,expiresAt:now+86400000});tx.set(ipRef,{count:(i.data()?.count||0)+1,expiresAt:now+86400000});
      tx.set(usage,{...prior,usedUSD:used,reservedUSD:reserved+amount,paidRequests:count+1,updatedAt:now});
      return {key,requestKey,owner,day,amount,enableWebSearch:live.enableWebSearch===true && config.enableWebSearch};
    });
  } catch(e) {if(e instanceof AuditError) throw e; throw paused();}
}
export async function settle(reservation:Reservation,result:AuditResult|null,metadata:Record<string,unknown>) {
  const db=database(); const lock=db.doc(`auditLocks/${reservation.key}`),req=db.doc(`auditLocks/${reservation.requestKey}`),usage=db.doc(`usageDays/${reservation.day}`),global=db.doc('rateLimits/paid-global'); const now=Date.now();
  await db.runTransaction(async tx=>{
    const [l,u,g,r]=await tx.getAll(lock,usage,global,req);
    if(l.data()?.owner!==reservation.owner || r.data()?.owner!==reservation.owner) throw new Error('Lost reservation ownership');
    const leases={...(g.data()?.leases||{})};delete leases[reservation.owner]; tx.set(global,{leases}); tx.delete(lock);
    tx.set(req,{...r.data(),status:result?'complete':'failed'});
    // Unknown failures retain the reservation. Successful calls are conservatively charged the full reservation,
    // including any search call; no optimistic refund or stale-lease refund can reopen the daily budget.
    if(result) {
      const d=u.data() || {};
      tx.set(usage,{...d,reservedUSD:Math.max(0,Number(d.reservedUSD||0)-reservation.amount),usedUSD:Number(d.usedUSD||0)+reservation.amount,updatedAt:now});
      tx.set(db.doc(`auditResults/${result.id}`),{result,usage:metadata,accountedUSD:reservation.amount});
      tx.set(db.doc(`auditCache/${reservation.key}`),{resultId:result.id,expiresAt:now+86400000});
    }
  });
}
