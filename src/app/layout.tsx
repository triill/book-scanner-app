import type { Metadata } from "next";
import { Monsieur_La_Doulaise, Poiret_One } from "next/font/google";
import "./globals.css";

const monsieurLaDoulaise = Monsieur_La_Doulaise({
  variable: "--font-monsieur",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const poiretOne = Poiret_One({
  variable: "--font-poiret",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bibliotheca",
  description: "A sophisticated book collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${monsieurLaDoulaise.variable} ${poiretOne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
