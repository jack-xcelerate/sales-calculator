import type { Metadata } from "next";
import { Staatliches, Montserrat } from 'next/font/google';
import "./globals.css";

const staatliches = Staatliches({ 
  subsets: ['latin'],
  weight: '400',
  variable: '--font-staatliches',
});

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: '400',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "Xcelerate Growth Engine Calculator",
  description: "Discover how to generate more leads & clients without spending another $ on ads.",
  icons: {
    icon: '/favicon.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body 
        className={`${staatliches.variable} ${montserrat.variable} font-montserrat bg-background min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}