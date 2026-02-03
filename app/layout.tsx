import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Spark ✨ | AI Wallpapers with Inspiring Quotes",
  description: "Wake up to a fresh, AI-generated wallpaper with an inspiring quote every morning. Stoicism, productivity, fitness & more.",
  keywords: ["wallpaper", "quotes", "motivation", "AI", "stoicism", "productivity"],
  openGraph: {
    title: "Daily Spark ✨",
    description: "AI-generated wallpapers with inspiring quotes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Spark ✨",
    description: "AI-generated wallpapers with inspiring quotes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
