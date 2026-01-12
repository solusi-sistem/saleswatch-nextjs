import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import 'animate.css';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { HomeProvider } from '@/contexts/HomeContext';
import { PrivacyPolicyProvider } from '@/contexts/PrivacyPolicyContext';
import { TermsConditionsProvider } from '@/contexts/TermsConditionsContext';
import { SupportProvider } from '@/contexts/SupportContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
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
    <html lang="en" className={inter.variable}>
      <head>
        {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" /> */}
      </head>
      <body className={`${inter.className} antialiased`}>
        <LayoutProvider>
          <HomeProvider>
            <PrivacyPolicyProvider>
              <TermsConditionsProvider>
                <SupportProvider>
                  {children}
                </SupportProvider>
              </TermsConditionsProvider>
            </PrivacyPolicyProvider>
          </HomeProvider>
        </LayoutProvider>

        <Script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></Script>
      </body>
    </html>
  );
}