import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import HeaderTerms from './components/headerTerms';
import TermsAndConditionsSection from './components/TermsConditionsSection';

export default function TermsAndConditions() {
  return (
    <div>
      <Header></Header>
      <HeaderTerms />
      <TermsAndConditionsSection />
      <Footer></Footer>
    </div>
  );
}
