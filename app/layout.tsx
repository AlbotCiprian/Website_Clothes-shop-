import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { inter, grotesk } from '@/lib/fonts';

export const metadata: Metadata = {
  title: {
    template: '%s — Blueprint Athletics',
    default: 'Blueprint Athletics — Performance wear for everyday athletes'
  },
  description: 'A mobile-first fashion commerce experience with frictionless checkout powered by MAIB eComm.',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'Blueprint Athletics',
    description: 'Elevated training apparel with instant checkout and Nova Poshta delivery.',
    url: 'https://example.com',
    siteName: 'Blueprint Athletics',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blueprint Athletics',
    description: 'Modern Instagram-native fashion commerce experience.'
  }
};

export const viewport: Viewport = {
  themeColor: '#09090b'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
