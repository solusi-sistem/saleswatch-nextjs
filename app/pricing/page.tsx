import { notFound } from 'next/navigation';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import HeaderPricing from './components/headerPricing';
import PricingSection from './components/PricingSection';

export default function PricingPage() {
  // Check if pricing page is enabled
  const isPricingEnabled = process.env.NEXT_PUBLIC_SHOW_PRICING === 'true';
  
  if (!isPricingEnabled) {
    notFound();
  }
  
  return (
    <div>
      <Header></Header>
      <HeaderPricing />
      <PricingSection />
      <Footer></Footer>
    </div>
  );
}
