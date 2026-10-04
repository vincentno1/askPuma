# Imagegen 圖層交付

2026-10-04 活動開始、使用者全面開工授權後，用 built-in image_gen（非 CLI／專案 API key）生成。三份已逐張查看，PNG均保留真正 alpha；不曾用 Python 改圖或去背。

| 資產 | 用途 | 參考 |
|---|---|---|
| public/illustrations/detective.png | 首頁與認真結果，橘貓／綠背心／放大鏡／白紙 | 01-home-desktop.png |
| public/illustrations/afro.png | 搞笑回答，原創爆炸頭／藍拳套貓 | 03-anime-result-desktop-v2.png |
| public/illustrations/taipei.png | 台北城市、綠樹、橋與藍河背景層 | 01-home-desktop.png |

實際提示核心：
- detective：透明網頁吉祥物，全身橘色Puma偵探貓，保留參考角色的綠背心與橡實徽章、可愛表情、粗墨黑手繪線與紙感；手持圓放大鏡、白紙。不得有文字、網頁、城市、標誌、框；透明背景。
- afro：透明網頁吉祥物，與03同一原創橘貓，巨大黑捲爆炸頭、藍拳套、綠背心與橡實徽章，全身與尾巴，活潑姿態、粗手繪線，可保留少量黃色漫畫能量線；不得有文字、官方動漫角色、網頁或城市。
- taipei：橫向透明底部城市圖層，綠色台北101、低樓、亭子、黃綠拱橋、圓樹叢與底部窄藍河，同參考手繪風；上部留透明空間，無貓／人物／文字／招牌字／UI／標誌。

原始圖片仍保存在 ~/.codex/generated_images 的本聊天目錄；部署所用副本皆位於本專案 public/illustrations，沒有只引用外部本機路徑。完整逐字prompt可由本次工具呼叫紀錄追溯。
