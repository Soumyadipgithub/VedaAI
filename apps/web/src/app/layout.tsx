import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Manrope } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VedaAI — Assessment Creator",
  description: "AI-generated assessments for teachers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable} ${manrope.variable}`}>
      <body className="font-brand">
        {/* Fixed viewport background — prevents white showing anywhere on any page */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            background: "linear-gradient(180deg, #EEEEEE 0%, #DADADA 100%)",
          }}
        />
        {children}
      </body>
    </html>
  );
}
