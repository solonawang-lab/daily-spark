import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Daily Spark ☀️ Wake up inspired",
  description: "A beautiful wallpaper with a curated quote, freshly generated and delivered to your inbox each morning. Your daily dose of motivation.",
  keywords: ["wallpaper", "quotes", "morning routine", "AI", "stoicism", "productivity", "motivation", "inspiration"],
  authors: [{ name: "Daily Spark" }],
  openGraph: {
    title: "Daily Spark ☀️ Wake up inspired",
    description: "A beautiful wallpaper with a curated quote, delivered every morning.",
    type: "website",
    siteName: "Daily Spark",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Spark ☀️",
    description: "Wake up to inspiration, every single day.",
  },
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "#F59E0B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
