import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sales Watch - Wawasan dan Efisiensi Penjualan',
  description: 'Solusi Terpadu untuk Wawasan dan Efisiensi Penjualan Anda',
};

export default function IndonesianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}