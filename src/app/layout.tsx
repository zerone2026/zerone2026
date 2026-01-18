import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zerone 2026 - National Level Tech Fest",
  description: "Built for Zerone 2026, a National Level Tech Fest organized by the Department of Computer Science,MES Ponnani College,in association with IEDC",
  keywords: ["Zerone","Zerone 2026","Tech fest","MES Ponnani College","CS Department","Mushida P"],
  authors: [{ name: "Murshida P"}],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Zerone 2026 - National Level Tech Fest",
    description: "Built for Zerone 2026, a National Level Tech Fest organized by the Department of Computer Science,MES Ponnani College,in association with IEDC",
    url: "https://zerone2026.com",
    siteName: "Zerone 2026",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zerone 2026 - National Level Tech Fest",
    description: "Built for Zerone 2026, a National Level Tech Fest organized by the Department of Computer Science,MES Ponnani College,in association with IEDC",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
