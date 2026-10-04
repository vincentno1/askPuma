"use client";

import { useRef, useState } from "react";
import { DEMO_QUERIES, type AuditResponse, type AuditResult } from "@/contracts/audit";
import { CityScene, Mascot, ResultView } from "@/components/audit-ui";

type Failure = { code: string; message: string; retryAfterSeconds?: number };

export default function Page() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Failure | null>(null);
  const [info, setInfo] = useState<"how" | "sources" | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const resultRegion = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const pendingRequest = useRef<{ query: string; id: string } | null>(null);

  async function audit(nextQuery: string, retry = false) {
    if (busy.current) return;
    const text = nextQuery.trim();
    if (!text || text.length > 500) {
      setError({ code: "INVALID_INPUT", message: "請輸入 1–500 字的攻擊角度。" });
      input.current?.focus(); return;
    }
    busy.current = true; setQuery(text); setError(null); setLoading(true); setResult(null); setInfo(null);
    const request = retry && pendingRequest.current?.query === text ? pendingRequest.current : { query: text, id: crypto.randomUUID() };
    pendingRequest.current = request;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 90_000);
    try {
      const response = await fetch("/api/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: text, requestId: request.id }), signal: controller.signal });
      const body: AuditResponse = await response.json();
      if (body.ok && response.ok) { setResult(body.result); window.setTimeout(() => resultRegion.current?.focus(), 0); }
      else if (!body.ok) setError(body.error);
      else setError({ code: "PROVIDER_UNAVAILABLE", message: "資料暫時無法讀取，請稍後再試。" });
    } catch (cause) {
      const timedOut = cause instanceof DOMException && cause.name === "AbortError";
      setError({ code: timedOut ? "ANALYSIS_TIMEOUT" : "NETWORK_ERROR", message: timedOut ? "核對資料等待較久，請稍後再試。你的問題已保留。" : "目前連線不太順，請確認網路後再試。你的問題已保留。" });
    } finally { window.clearTimeout(timeout); busy.current = false; setLoading(false); }
  }

  function askAgain() {
    setResult(null); setError(null); setInfo(null);
    window.setTimeout(() => { input.current?.focus(); input.current?.select(); }, 0);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  return <div className={`site-shell ${result ? "has-result" : "is-home"}`}>
    <header className="site-header">
      <button type="button" className="wordmark" onClick={askAgain} aria-label="askPuma，回到首頁"><span>ask</span><span>Puma</span><i aria-hidden="true"><b /><b /><b /></i></button>
      <nav aria-label="主要導覽"><button type="button" onClick={() => result ? askAgain() : setInfo(info === "how" ? null : "how")}>{result ? "再問一題" : "怎麼玩"}</button><button type="button" onClick={() => setInfo(info === "sources" ? null : "sources")}>資料來源</button></nav>
    </header>
    {info && <aside className="site-info" aria-label={info === "how" ? "使用說明" : "資料來源說明"}><div><h2>{info === "how" ? "名字負責挑釁，原文負責說話。" : "來源公開，限制也公開。"}</h2><p>{info === "how" ? "輸入一個具體問題，我們把主張、原話和證據拆開。認真題看資料，輕鬆題開玩梗模式；找不到足夠證據，就直接說不足。" : "資料來自公開貼文索引、本人原文、政府政策與研究資料。每份回答會列出實際使用的來源與核對狀態；保存版本不等於原頁已核對。"}</p>{info === "sources" && <a href="https://mayor2026.observe.tw/taipei/shen-poyang/" target="_blank" rel="noreferrer">查看公開貼文索引 ↗</a>}</div><button className="close-info" type="button" onClick={() => setInfo(null)} aria-label="關閉說明">×</button></aside>}
    <main>{result ? <div ref={resultRegion} tabIndex={-1} className="result-region"><ResultView result={result} onAgain={askAgain} onSerious={() => void audit("有公開資料說明沈伯洋留爆炸頭的原因嗎？")} /></div> : <>
      <section className="home-stage" aria-labelledby="home-title"><CityScene /><div className="home-content">
        <h1 id="home-title" className="home-title"><span>該怎麼攻擊</span><span className="puma-title">Puma?<i className="title-spark" aria-hidden="true">〃</i></span></h1>
        <p className="home-subtitle">請輸入攻擊角度，<br className="mobile-break" />我們幫你檢查會不會打到自己。</p>
        <form className="attack-form" onSubmit={event => { event.preventDefault(); void audit(query); }} aria-busy={loading}>
          <label htmlFor="attack-query">你的攻擊角度</label><textarea ref={input} id="attack-query" value={query} onChange={event => setQuery(event.target.value)} placeholder="發針頭給吸毒者，是鼓勵吸毒嗎？" maxLength={500} rows={3} disabled={loading} aria-describedby={error ? "audit-error" : "query-hint"} />
          <button className="primary-button submit-button" type="submit" disabled={loading}>{loading ? <><span className="loading-dot" aria-hidden="true" />正在核對資料</> : <>檢查這個攻擊角度 <span aria-hidden="true">→</span></>}</button>
          <div className="demo-row"><span id="query-hint">或試試這些主題：</span><div>{DEMO_QUERIES.map(demo => <button type="button" className="query-chip" key={demo.label} disabled={loading} onClick={() => void audit(demo.query)}>{demo.label}</button>)}</div></div>
          {loading && <p className="loading-notice" role="status">正在核對資料，請稍候。回答完成後會列出來源與限制。</p>}
          {error && <div id="audit-error" className="error-notice" role="alert"><strong>{error.code === "RATE_LIMITED" ? "先休息一下，再出招。" : error.code === "BUDGET_REACHED" || error.code === "ANALYSIS_PAUSED" ? "新分析暫時休息中。" : "這次沒能完成核對。"}</strong><p>{error.message}{error.retryAfterSeconds ? ` 建議 ${error.retryAfterSeconds} 秒後再試。` : ""}</p>{!["BUDGET_REACHED", "ANALYSIS_PAUSED", "RATE_LIMITED"].includes(error.code) && <button type="button" className="text-button" onClick={() => void audit(query, true)}>重試這個問題 →</button>}</div>}
        </form>
      </div><div className="home-mascot"><p className="mascot-note">多問一點，<br />社會更清楚！</p><Mascot variant="detective" /><span className="curved-arrow" aria-hidden="true">↶</span><p className="mascot-note second-note">檢查後<br />再出發！</p></div></section>
      <section className="how-strip" aria-label="我們怎麼核對"><div className="how-step"><span className="step-icon paper-icon" aria-hidden="true">▤</span><div><h2>找原文</h2><p>找到完整脈絡，不只看標題。</p></div></div><span className="step-arrow" aria-hidden="true">→</span><div className="how-step"><span className="step-icon folder-icon" aria-hidden="true">▰</span><div><h2>查政策</h2><p>看政策怎麼說，有沒有相關資料。</p></div></div><span className="step-arrow" aria-hidden="true">→</span><div className="how-step"><span className="step-icon paper-icon" aria-hidden="true">▤</span><div><h2>看證據</h2><p>用事實檢查說法，避免打到自己。</p></div></div></section>
    </>}</main><footer>民間支持者作品 <span aria-hidden="true">｜</span> 立場公開，來源也公開</footer>
  </div>;
}
