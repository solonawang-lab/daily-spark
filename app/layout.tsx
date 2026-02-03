import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Daily Spark — Wake up inspired",
  description: "A premium wallpaper with a curated quote, generated fresh and delivered to your inbox every morning. For people who take mornings seriously.",
  keywords: ["wallpaper", "quotes", "morning routine", "AI", "stoicism", "productivity", "motivation"],
  authors: [{ name: "Daily Spark" }],
  openGraph: {
    title: "Daily Spark — Wake up inspired",
    description: "A premium wallpaper with a curated quote, delivered every morning.",
    type: "website",
    siteName: "Daily Spark",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Spark",
    description: "The first thing you see shapes your day.",
  },
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "#0a0a0b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-[#0a0a0b] text-white selection:bg-amber-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
