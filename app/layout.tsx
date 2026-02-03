import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Daily Spark — Start every morning with intention",
  description: "A fresh wallpaper and inspiring quote delivered to your inbox before you wake up. Beautiful. Effortless. Daily.",
  keywords: ["wallpaper", "quotes", "morning routine", "AI", "motivation", "inspiration"],
  openGraph: {
    title: "Daily Spark",
    description: "Start every morning with intention",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#FAFBFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
