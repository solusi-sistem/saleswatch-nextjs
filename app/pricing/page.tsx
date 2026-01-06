import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import HeaderPricing from './components/headerPricing';
import PricingSection from './components/PricingSection';

export default function TermsAndConditions() {
  return (
    <div>
      <Header></Header>
      <HeaderPricing />
      <PricingSection />
      <Footer></Footer>
    </div>
  );
}
