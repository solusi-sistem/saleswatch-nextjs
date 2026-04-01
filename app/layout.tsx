import { Analytics } from '@vercel/analytics/next';
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
import { ListOptionsProvider } from '@/contexts/ListOptionsContext';
import { getLayoutData } from '@/lib/sanity';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getLayoutData();
  const layoutData = data?.layout || data; // fallback for safety during transition

  return (
    <html lang="en" className={inter.variable}>
      <head>{/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" /> */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17672457172"
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17672457172');
          `}
        </Script>
      </head>
      <body className={`${inter.className} antialiased`}>
        <LayoutProvider initialData={layoutData}>
          <HomeProvider>
            <PrivacyPolicyProvider>
              <TermsConditionsProvider>
                <SupportProvider>
                  <ListOptionsProvider>{children}</ListOptionsProvider>
                </SupportProvider>
              </TermsConditionsProvider>
            </PrivacyPolicyProvider>
          </HomeProvider>
        </LayoutProvider>
        
        <Analytics />

        {/* <Script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></Script> */}
      </body>
    </html>
  );
}
