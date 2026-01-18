import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Zerone 2026 - National Level Tech Fest",
  description:
    "Built for Zerone 2026, a National Level Tech Fest organized by the Department of Computer Science, MES Ponnani College, in association with IEDC",
  keywords: [
    "Zerone",
    "Zerone 2026",
    "Tech fest",
    "MES Ponnani College",
    "CS Department",
    "Murshida P",
  ],
  authors: [{ name: "Murshida P" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Zerone 2026 - National Level Tech Fest",
    description:
      "Built for Zerone 2026, a National Level Tech Fest organized by the Department of Computer Science, MES Ponnani College, in association with IEDC",
    url: "https://zerone2026.com",
    siteName: "Zerone 2026",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zerone 2026 - National Level Tech Fest",
    description:
      "Built for Zerone 2026, a National Level Tech Fest organized by the Department of Computer Science, MES Ponnani College, in association with IEDC",
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
        className={`${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
