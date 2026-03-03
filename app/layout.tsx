import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthGate } from "@/components/auth-gate";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TEDxConegliano — Social Copy Agent",
  description: "Genera copy social ottimizzato per TEDxConegliano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} antialiased`}>
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
