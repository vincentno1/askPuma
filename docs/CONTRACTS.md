# 共用契約 v2（設計）

本文是前端、後端與資料的共同設計。**沒有應用程式或可執行 schema 已被建立。** 開工由 A 把這份契約落成共用型別／runtime validation，B、C、D 不各自猜格式。2026-10-04 v2 加入事實／玩梗、主引用與已整理案例；與 IMPLEMENTATION_PLAN.md、DEMO_CASES.md 配套。變更由 A 更新契約與版本並通知其他角色。

## 路由與回應

| 路由 | 優先級 | 行為 |
|---|---|---|
| GET / | P0 | 首頁、輸入、查詢結果；同頁完成核心體驗 |
| POST /api/audit | P0 | 新分析或有效快取，輸入 query 與 requestId |
| GET /api/health | P0 | 部署存活檢查；不回傳金鑰或詳細內部設定 |
| GET /sources | P1 | 展示收錄來源與版本；P0可用首頁展開區替代 |
| POST /api/share | P2 | 使用者主動將一份結果建立為分享快照 |
| GET /r/{id} | P2 | 讀取已公開的分享快照，不重新呼叫模型 |

POST /api/audit 的輸入：

| 欄位 | 說明 |
|---|---|
| query | 必填字串，trim後1–500字；前後端都檢查 |
| requestId | 同一匿名 session 的請求識別；重送同一請求保持相同值 |

匿名 session 識別由後端 cookie 建立。使用者不能透過輸入指定模型、費用、來源核對狀態或管理開關。

成功格式：`{ ok: true, result: AuditResult }`。

錯誤格式：`{ ok: false, error: { code, message, retryAfterSeconds? }, requestId }`。

| HTTP | code | 前端行為 |
|---|---|---|
| 400 | INVALID_INPUT | 指出長度／空白，保留輸入 |
| 409 | QUERY_IN_PROGRESS | 提示稍後重試；不以無限重送建立新工作 |
| 429 | RATE_LIMITED | 顯示等待時間，仍可看既有結果 |
| 429 | BUDGET_REACHED | 說明新分析暫停，不鼓勵立刻重送 |
| 503 | ANALYSIS_PAUSED | 服務開關關閉或控制資料無法使用 |
| 503 | PROVIDER_UNAVAILABLE | 模型／搜尋依賴暫時不可用 |
| 504 | ANALYSIS_TIMEOUT | 顯示超時，保留輸入，允許人工重試 |

證據不足是一種正常分析結果（200），不是系統錯誤。未設定 API 時不得回傳假的成功分析。

## SourceRecord

| 欄位 | 類型／約束 |
|---|---|
| id | 穩定字串；本地例如S01，動態來源另給不衝突的ID |
| title | 標題 |
| url | 可開啟的原始HTTPS網址，不用搜尋結果頁 |
| publisher | 出版者／機關 |
| author | 作者，可為null |
| publishedAt | ISO日期或null；不知道就留null，不用擷取時間代替 |
| updatedAt | 可選ISO日期；政策資料更新日與首次發布日分開記錄 |
| datePrecision | day／month／year／unknown |
| retrievedAt | 擷取時間，ISO timestamp |
| kind | primary_statement／official_policy／research／news_report |
| reviewStatus | checked／search_only／imported_unchecked |
| origin | 可選：direct／web_search／mayor2026_archive；取得方式與來源類型分開 |
| platform | 可選：facebook／threads／instagram／youtube／website／document／other；按真實平台顯示 |
| upstreamId | 可選字串；公開索引的原始紀錄 ID |
| archiveUrl | 可選 HTTPS 網址；原始頁面不可讀時提供保存版本，明示限制 |
| excerpts | Excerpt[]；對外只展示必要相關段落 |
| contextNote | 說明來源限制、轉述或語境 |

Excerpt 欄位：`id`、`text`、`locator`。locator 可是段落標籤／頁碼／段落位置；不編造行號。

checked 代表已核對文字、日期與網址，不代表來源裡每個主張都被認定為真。新聞轉述不能標成 primary_statement；搜尋摘要沒有核對原文不能標成 checked。

imported_unchecked 代表已取得公開資料庫保存文字，但尚未逐筆核對原文；與只有搜尋摘要的 search_only 不同。展示時標示「公開資料庫收錄，尚未逐筆核對」，不能當成已核對的現行人物原話，也不能用它作唯一依據下確定結論。批次抽查不會把整批升級為 checked。詳見 [資料取得方案](DATA_ACQUISITION.md)。

## AuditResult

| 欄位 | 類型／說明 |
|---|---|
| id | 隨機結果ID，不能讓訪客列舉他人結果 |
| requestId | 原請求識別 |
| query | 使用者本次問題 |
| title | 短標題；不是人物虛構引言 |
| verdict | backed_by_sources／missing_context／insufficient_evidence／valid_question；純 playful 必須為 null |
| roast | 一句詼諧旁白，與事實解釋分區 |
| summary | 簡短說明當前證據能支持什麼 |
| claims | ClaimFinding[] |
| limitations | 字串陣列：尚缺原話、證據範圍等 |
| sources | SourceRecord[]，由服務端建立／核對來源表 |
| mode | curated／indexed／web／mixed；表示來源取得路徑，不表示幽默模式或是否新生成 |
| interactionMode | factual／playful／mixed；決定前端使用哪一種結果布局 |
| answerOrigin | curated／saved／generated；對外分別顯示「已整理案例」「已儲存回答」「本次生成」 |
| caseId | string或null；由伺服器精確匹配，不接受訪客指定 |
| heroCitation | {sourceId, excerptId}或null；伺服器對應到來源原句，沒有原話則null |
| headlineSourceIds | string[]；支持大字事實結論的來源；在主結論旁提供直接可點的引用 |
| criticalLimitations | string[]，最多2條；會改變結論理解的限制在首屏直接可見 |
| mascotVariant | detective／afro；伺服器白名單決定，非任意圖片URL |
| memeId | string或null；伺服器核可的梗說明ID，不能冒充事實來源 |
| cacheHit | boolean |
| createdAt | 首次分析產生時間 |
| dataVersion | 收錄資料版本 |
| promptVersion | 提示版本 |
| modelVersion | string或null；記錄實際生成模型識別，不能冒稱用了沒有呼叫的模型 |

ClaimFinding：`id`、`claim`、`finding`、`relation`、`sourceIds`。

relation：supports／contradicts／context／unresolved，**相對於該條使用者主張**，不是相對於政治人物好壞。

verdict 是對這次攻擊角度的證據評估：

| 值 | 預定畫面名稱 | 使用條件 |
|---|---|---|
| backed_by_sources | 這題有依據 | 使用者想攻擊的那項Puma論述有來源支持；解釋具體支持部分 |
| missing_context | 你漏帶了前後文 | 引用不完整或不同概念混在一起；也可能需拆出仍可質疑部分 |
| insufficient_evidence | 彈藥不足 | 找不到足夠資料、無法確認引言、來源衝突 |
| valid_question | 這題可以質疑 | 這個質疑有可支持的理由；不等於人物所有觀點都錯 |

不添加「真假百分比」或全人物評分。多條主張結論不一致時，各條分開呈現，摘要保持限定範圍。

## 模型輸出與服務端責任

模型只產生 title、interactionMode、verdict、roast、summary、claims、limitations、criticalLimitations、headlineSourceIds 與 heroCitation 的 ID 選擇。來源表、引用文字、日期、版本、ID、caseId、answerOrigin、來源 mode、插畫／梗 ID、快取狀態與實際用量由服務端提供。純玩梗不要求人物原話。

- claims中的sourceIds必須存在於這次來源表。
- headlineSourceIds、heroCitation 的 sourceId／excerptId 必須存在本次資料，來源類型與限制相容才渲染；無效選擇不能公開為引用。
- playful 必須 verdict=null、heroCitation=null、headlineSourceIds=[]，不增加政治事實 claims；遇到實質指控則改 factual／mixed。
- title 目標1–2行、約24中文字以內，roast目標一句約28字；過長回退到不扭曲範圍的短文案，不截斷否定或條件。
- criticalLimitations 與來源核對狀態不可只藏在折疊內；其他說明可展開。
- 本地原話只用來源excerpts渲染；模型新寫的文字不是引言。
- 搜尋回傳的來源表必須來自工具引用／sources，而不是模型自行生成的連結。
- 結構化輸出不完整，回傳友善錯誤或有限的資料不足結果；不發布破碎JSON。
- 查詢／來源文字顯示為文字，避免將其當成可執行HTML。
- 費用metadata留後端記錄，不要求前端暴露內部帳號或計費資訊。

## 版本與畫面狀態

前端至少有 idle、loading、success、error 四種狀態。搜尋／比對提示必須與目前路徑相符；無法取得逐階段狀態時，用一般「正在核對資料」即可。

快取包含資料、提示與模型版本。更新資料時由A更新dataVersion；提示行為變更更新promptVersion。查詢在版本變動後不能套用舊快取。

資料不足、有效質疑、provider失敗與限流都需要B可用的fixture；fixture僅用於開發，不當成公開的即時AI結果。

## PreparedCase（待建立的案例資料）

三題依 DEMO_CASES.md。一份案例儲存：id、canonicalQuery、reviewedAliases[]、status（draft／ready）、sourceRefs[]、resultTemplate、reviewedAt、dataVersion、promptVersion、modelVersion。resultTemplate 是本契約結果內容，不包含每次訪客的 id／requestId／query／cacheHit；回傳時由伺服器補本次欄位。

- status=ready 必須經人核對結論、引用与限制；有保存版來源仍保留 imported_unchecked，不因案例 ready 就把全部來源升 checked。
- P0 只匹配完整審核過的問題與別名；不能用「含針具／午餐」就命中。保守處理空白與等價標點，保留否定、年份和額外主張。
- 公開範例送 canonicalQuery 與一般 requestId，沒有 ?demo=1 或後端費用控制旁路。
- 經編輯的案例 answerOrigin=curated；生成結果重播 answerOrigin=saved；新API回答 generated。cacheHit 只描述實際快取，不替代此標示。
- 展示未核對保存版原句需直接標狀態，確定政策結論另有可核對來源；搜尋摘要不得當主引言。
