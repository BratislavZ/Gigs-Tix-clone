import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Header from '@/components/header/Header';
import { twMerge } from 'tailwind-merge';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ticketing',
  description: 'App that allows you to buy tickets for events',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={twMerge(inter.className, 'bg-slate-50 min-h-screen')}>
        <Providers>
          <Header />
          <div className="container max-w-6xl mx-auto px-4 pt-4">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
