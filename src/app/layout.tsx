import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "該怎麼攻擊 Puma？", description: "請輸入攻擊角度，我們幫你檢查會不會打到自己。民間支持者作品，立場公開，來源也公開。" };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="zh-Hant"><body>{children}</body></html>;}
