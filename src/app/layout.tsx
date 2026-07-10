import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "400", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GLITCH 2026 | Haute Couture Streetwear",
  description:
    "GLITCH 2026 — neo-street luxury. Oversized tees, polos, pants, jorts and gold broderie. Order via WhatsApp or email.",
  keywords: ["GLITCH", "streetwear", "haute couture", "broderie", "oversized", "Algeria"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable}`}>
      <body className="selection:bg-gold selection:text-black">{children}</body>
    </html>
  );
}
