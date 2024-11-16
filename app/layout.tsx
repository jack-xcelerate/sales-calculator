import type { Metadata } from "next";
import { Staatliches, Alata } from 'next/font/google';
import "./globals.css";

const staatliches = Staatliches({ 
  subsets: ['latin'],
  weight: '400',
  variable: '--font-staatliches',
});

const alata = Alata({ 
  subsets: ['latin'],
  weight: '400',
  variable: '--font-alata',
});

export const metadata: Metadata = {
  title: "Sales Calculator",
  description: "Sales funnel calculator and metrics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body 
        className={`${staatliches.variable} ${alata.variable} font-alata bg-background min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}