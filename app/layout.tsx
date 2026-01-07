import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { HomeProvider } from '@/contexts/HomeContext';

const geistSans = Geist({
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Home | Sales Watch',
  description: 'Sales Watch - Your Ultimate One-Stop Solution for Sales Insights and Efficiency',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <LayoutProvider>
          <HomeProvider>{children}</HomeProvider>
        </LayoutProvider>

        <Script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></Script>
      </body>
    </html>
  );
}
