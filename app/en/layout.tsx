import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sales Watch - Sales Insights and Efficiency',
  description: 'Your Ultimate One-Stop Solution for Sales Insights and Efficiency',
};

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}