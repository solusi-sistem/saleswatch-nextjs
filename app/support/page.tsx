import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import SupportSection from './components/SupportSection';
import HeaderSupport from './components/HeaderSupport';

export default function SupportPage() {
    return (
        <div>
            <Header></Header>
            <HeaderSupport />
            <SupportSection />
            <Footer></Footer>
        </div>
    );
}
