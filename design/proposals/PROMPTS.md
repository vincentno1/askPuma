# Imagegen 提案提示詞

日期：2026-10-04，Asia/Taipei。

使用 built-in image_gen；未使用 API／CLI fallback，也未呼叫專案的 OpenAI API key。

01 的參考是透過瀏覽器實際檢視的 Puma 官方頁面截圖；02、03 以 01 的生成圖為風格參考。以下是實際送出的完整提示詞。這些是示意 UI，不是已部署網站。

## 01 首頁

```text
Use case: ui-mockup.
Asset type: high-fidelity desktop website landing screen, landscape 1536x1024 composition.
Primary request: Design the homepage of a playful Taiwanese political evidence-checking website "該怎麼攻擊 Puma？". The attached screenshot is a STYLE REFERENCE of puma.taipei, NOT an edit target. Honor its warm cream background, clay-orange very heavy Traditional Chinese typography, bright periwinkle/royal blue panels, flat hand-drawn friendly city animals, black offset shadows and generous spacing. Create a new original interface, not a reproduction of the official site.
Palette: warm ivory #FFF9F3, terracotta #CE7950, vivid blue #4B5CDA, charcoal #272822, leaf green #97B565, butter yellow #F9D76C. Crisp flat UI, readable realistic browser layout, no device perspective.
Composition: Full desktop page viewed straight on. Slim cream navigation, left original wordmark "askPuma" and compact links "怎麼玩" "資料來源". Main hero occupies top 2/3: huge orange Traditional Chinese headline across 2 lines, left-aligned: "該怎麼攻擊" then blue bold italic "Puma？". Beneath it exact subtitle "請輸入攻擊角度，我們幫你檢查會不會打到自己。" Hero input in a large cream rectangular outlined form card with chunky black offset shadow. Label "你的攻擊角度"; textarea contains the question "提供乾淨針具，是在鼓勵吸毒嗎？". Strong blue action button with yellow lettering and offset shadow: "檢查這個攻擊角度 →". Below three compact suggested-topic chips "針具與減害" "台北市政" "自由出題". To the right, a restrained original illustration of a curious friendly orange puma cat holding a magnifying glass inspecting a paper, next to a curved blue boomerang symbol returning toward the paper; expressive, playful, flat hand-drawn linework, not violent, not a real politician portrait. Thin simplified Taipei skyline silhouette near bottom of hero. Under hero a horizontal blue strip with three clear cream labels and small paper icons: "找原文" → "查政策" → "看證據". Small cream footer text "民間支持者作品｜立場公開，來源也公開".
Text: use Traditional Chinese, exact quoted strings, high legibility. Title is the dominant visual element, input second, illustration tertiary. Designed like an excellent real shippable 90-minute hackathon site, not a design mood board. Keep enough space for input and navigation. Do not use official campaign logo, official donation/LINE buttons, data metrics, fabricated factual claims, robotic imagery, gradients, glassmorphism, dark SaaS dashboard, bullets/weapon graphics or literal attacks. This is a concept mockup with example input, no live result.
```

## 02 桌面證據與結論

```text
Use case: ui-mockup. Asset type: high-fidelity web UI concept proposal, straight-on screenshot composition.
Input image: the provided image is our approved-for-exploration HOMEPAGE STYLE REFERENCE, not an edit target. Continue its original askPuma wordmark, warm ivory, terracotta heavy Chinese typography, royal/periwinkle blue, buttery yellow, charcoal outlines and modest black offset shadows, little friendly original orange puma detective with green vest, small Taipei skyline. The design honors puma.taipei's lively civic illustration feeling. Exact palette #FFF9F3 #CE7950 #4B5CDA #272822 #97B565 #F9D76C.
Make a new screen of this same website. Beautiful shippable interface with generous spacing and crisp Traditional Chinese readable type. Flat front-facing canvas, no 3D perspective, no official campaign logo, no real politician portrait, no donation/LINE buttons, no invented metrics or percentages, no literal violence, no purple SaaS gradients or glassmorphism. User query, source excerpts, AI explanation and roast must be visually distinct. These are mockups, not claims of a deployed or complete fact-checking service.
Screen: desktop EVIDENCE AND RESULT page, landscape composition 1536x1024, cohesive with supplied homepage. Compact ivory top nav with askPuma left and "再出一題" "資料來源" right. Top orange large heading "攻擊角度有了，前後文呢？". A calm query strip labeled "你的問題" shows "提供乾淨針具，是在鼓勵吸毒嗎？".
Main royal blue rectangular verdict panel with black offset shadow, white headline "先拆開，再下結論。" and a yellow small badge "原文與政策比對"; secondary white line "清潔針具、提供毒品，是不同政策。" Small puma detective beside a paper marked with a magnifying glass, no cartoon clutter.
Below, a bold section title "把證據攤開來看" and 3 roomy paper cards in a grid; give source hierarchy top numbers 01 02 03 and colored small source-type labels, avoid dense paragraphs:
Card 01 label "人物原文", title "Puma 2014 原文", date "2014.09.01", short literal quotation "提供吸毒者毒品與乾淨的針頭" inside quotation marks highlighted pale yellow, note "需保留完整上下文", link button "查看原文 ↗".
Card 02 label "官方資料", title "臺北市清潔針具服務", source "臺北市衛生局", description without quotation marks "市府公開清潔針具佈點名單。", link "查看來源 ↗".
Card 03 label "研究指南", title "WHO 針具服務指南", date "2026.01.30", description without quotation marks "針具服務是公共衛生減害措施之一。", link "查看來源 ↗".
Under the cards a narrow cream analysis area labeled "認真說" with precise line "針具交換有政策依據，不能用來證明原文所有主張。"; separate playful yellow margin sticker labeled "吐槽區" says "前後文沒帶，先別開嗆。" Keep this roast visibly narration, not attributed quote. Bottom thin caveat line "市府有服務，不代表能推論市長的個人立場。" and secondary buttons "複製結果與來源" and "再試一個角度". A subtle small header note "視覺提案・示意案例". Prioritize generous card spacing, readable sources and hierarchy; no endless wall of text.
```

## 03 手機證據與結論

```text
Use case: ui-mockup. Asset type: high-fidelity web UI concept proposal, straight-on screenshot composition.
Input image: the provided image is our approved-for-exploration HOMEPAGE STYLE REFERENCE, not an edit target. Continue its original askPuma wordmark, warm ivory, terracotta heavy Chinese typography, royal/periwinkle blue, buttery yellow, charcoal outlines and modest black offset shadows, little friendly original orange puma detective with green vest, small Taipei skyline. The design honors puma.taipei's lively civic illustration feeling. Exact palette #FFF9F3 #CE7950 #4B5CDA #272822 #97B565 #F9D76C.
Make a new screen of this same website. Beautiful shippable interface with generous spacing and crisp Traditional Chinese readable type. Flat front-facing canvas, no 3D perspective, no official campaign logo, no real politician portrait, no donation/LINE buttons, no invented metrics or percentages, no literal violence, no purple SaaS gradients or glassmorphism. User query, source excerpts, AI explanation and roast must be visually distinct. These are mockups, not claims of a deployed or complete fact-checking service.
Screen: single mobile RESULT / EVIDENCE screen, portrait 1024x1536 composition. Show the complete mobile UI vertically with no physical phone frame, no desktop screen, no multiple options on one board. Realistic narrow 390px-style responsive content density scaled to image, generous 24px-equivalent gutters, large readable type and 44px-equivalent tap targets. Carry the exact same askPuma wordmark and orange/blue type, but keep illustrations small so evidence is not pushed offscreen.
Top ivory bar askPuma wordmark left and simple menu icon right. Small gray pill "視覺提案・示意案例". Orange heading on two lines "攻擊角度有了，" / "前後文呢？". Compact query box "提供乾淨針具，是在鼓勵吸毒嗎？".
Blue verdict panel with black offset shadow; small yellow label "原文與政策比對"; bold white line "先拆開，" then "再下結論。"; secondary "針具、供毒，是不同政策。"; small friendly puma detective head with magnifying glass in lower corner.
Below show a vertical source stack:
first expanded paper card labeled "01 人物原文", title "Puma 2014 原文", date "2014.09.01", exact highlighted short literal excerpt "提供吸毒者毒品與乾淨的針頭", a short note "需保留完整上下文", underlined "查看原文 ↗";
second compact paper card "02 官方資料", "臺北市清潔針具服務", "臺北市衛生局", "查看來源 ↗";
third compact paper card "03 研究指南", "WHO 針具服務指南", "查看來源 ↗".
Then separate warm-yellow narration sticker "吐槽區" / "前後文沒帶，先別開嗆。", and small serious limit text "針具政策不能證明原文所有主張。".
At bottom a full-width royal blue action button with yellow text "再試一個角度 →", and a restrained text action "複製結果與來源". Ivory footer "民間支持者作品｜立場公開，來源也公開". Friendly, credible, mobile usable, high-impact demo composition with real source readability. No tiny illegible metadata or fabricated additional quotes.
```

