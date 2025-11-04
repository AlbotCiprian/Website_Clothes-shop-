import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Blueprint Clothes Shop',
  description: 'Mobile-first Instagram commerce experience for apparel brands.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-slate-50">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
