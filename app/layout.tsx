import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import SessionAuthProvider from './context/SessionAuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CellShop - Premium Mobile Phones',
  description: 'Shop the latest mobile phones and accessories',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <SessionAuthProvider>
            <div className='flex min-h-screen flex-col'>
              <Header />
              <main className='flex-1 w-full'>{children}</main>
              <Footer />
            </div>
            <Toaster />
          </SessionAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
