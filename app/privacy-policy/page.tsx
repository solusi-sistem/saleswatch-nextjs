import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import HeaderPolicy from './components/headerPolicy';
import PrivacyPolicySection from './components/PrivacyPolicySection';

export default function PrivacyPolicy() {
  return (
    <div>
      <Header></Header>
      <HeaderPolicy />
      <PrivacyPolicySection />
      <Footer></Footer>
    </div>
  );
}
