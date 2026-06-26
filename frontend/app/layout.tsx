import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Recrutement Assistant - Matching Intelligent",
  description: "Plateforme d'analyse de CV et matching intelligent avec offres d'emploi utilisant l'IA",
  keywords: ["recrutement", "CV", "matching", "AI", "candidats"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
