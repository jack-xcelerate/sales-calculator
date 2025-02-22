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
  title: "Xcelerate Conversion Calculator",
  description: "Discover how to generate more leads & clients without spending another $ on ads.",
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