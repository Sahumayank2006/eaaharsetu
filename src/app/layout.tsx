
"use client"

import type {Metadata} from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from '@/components/ui/tooltip';
import { LanguageProvider } from '@/contexts/language-context';

{/*
export const metadata: Metadata = {
  title: 'eAaharSetu',
  description: 'A platform to efficiently manage surplus food, reduce waste, and facilitate marketplace transactions.',
};
*/}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>eAaharSetu</title>
        <meta name="description" content="A platform to efficiently manage surplus food, reduce waste, and facilitate marketplace transactions." />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500&family=Hind:wght@300;500&family=Hind+Siliguri:wght@400;600&family=Hind+Guntur:wght@300;500&family=Hind+Madurai:wght@300;500&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen")}>
        <LanguageProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
