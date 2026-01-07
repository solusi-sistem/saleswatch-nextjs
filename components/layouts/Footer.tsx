'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Facebook, Linkedin, Instagram, Youtube, ChevronUp } from 'lucide-react';
import CustomButton from '@/components/button/button';
import ScheduleDemoModal from '@/components/modals/ScheduleDemoModal';
import { useLayout } from '@/contexts/LayoutContext';
import { urlFor } from '@/lib/sanity.realtime';

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { layoutData, loading } = useLayout();

  const footerLogoUrl = useMemo(() => {
    console.log('📊 Layout Data:', layoutData);
    console.log('📍 Footer object:', layoutData?.footer);
    console.log('🖼️ Footer logo_footer:', layoutData?.footer?.logo_footer);
    
    if (!layoutData?.footer?.logo_footer) {
      console.warn('⚠️ Footer logo not found in layout data');
      return null;
    }

    try {
      const url = urlFor(layoutData.footer.logo_footer)
        .width(170)
        .fit('max')
        .auto('format')
        .url();
      
      console.log('✅ Footer Logo URL generated:', url);
      return url;
    } catch (err) {
      console.error('❌ Error generating footer logo URL:', err);
      return null;
    }
  }, [layoutData]);

  const footerDescription = layoutData?.footer?.desc_footer?.desc_footer_en || 
    'Sales Watch is a sales rep monitoring solution developed by SSS (Software System Solutions), designed to empower distributors and companies with control over their sales teams in the field.';

  const handleLoginClick = () => {
    window.location.href = 'https://dash.saleswatch.id/login';
  };

  const handleNavClick = (href: string) => {
    if (href.includes('#')) {
      const hash = href.split('#')[1];
      
      if (hash) {
        if (pathname === '/') {
          const targetElement = document.getElementById(hash);
          
          if (targetElement) {
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        } else {
          router.push(`/#${hash}`);
        }
      }
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes('#')) {
      e.preventDefault();
      handleNavClick(href);
    }
  };

  return (
    <>
      <footer className="bg-[#061551] text-white py-25 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-5 pe-8">
              <Link href="/" className="flex items-center">
                {!loading && footerLogoUrl ? (
                  <Image 
                    src={footerLogoUrl} 
                    alt="Saleswatch Footer Logo" 
                    width={170} 
                    height={41}
                    priority
                    className="h-auto"
                  />
                ) : (
                  <div className="w-[170px] h-[41px] bg-white/10 animate-pulse rounded"></div>
                )}
              </Link>
              <h1 className="my-5">{footerDescription}</h1>
              <div className="mt-4 flex gap-4">
                <Link href="https://facebook.com" target="_blank" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#6587A8] transition">
                  <Facebook size={18} />
                </Link>
                <Link href="https://linkedin.com" target="_blank" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#6587A8] transition">
                  <Linkedin size={18} />
                </Link>
                <Link href="https://instagram.com" target="_blank" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#6587A8] transition">
                  <Instagram size={18} />
                </Link>
                <Link href="https://youtube.com" target="_blank" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#6587A8] transition">
                  <Youtube size={18} />
                </Link>
              </div>
            </div>

            <div className="md:col-span-2">
              <h1 className="font-semibold mb-2 text-xl">Useful Links</h1>
              <div className="flex justify-start gap-1">
                <div className="w-14 h-[2px] bg-[#6587A8] mb-4"></div>
                <div className="w-14 h-[2px] bg-[#6587A8] mb-4"></div>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/" className="hover:text-[#6587A8] transition">
                  Home
                </Link>
                <Link 
                  href="/#about" 
                  onClick={(e) => handleLinkClick(e, '/#about')}
                  className="hover:text-[#6587A8] transition"
                >
                  About
                </Link>
                <Link href="/features" className="hover:text-[#6587A8] transition">
                  Features
                </Link>
                <Link href="/pricing" className="hover:text-[#6587A8] transition">
                  Pricing
                </Link>
              </div>
            </div>

            <div className="md:col-span-2">
              <h1 className="font-semibold mb-2 text-xl">Help & Support</h1>
              <div className="flex justify-start gap-1">
                <div className="w-18 h-[2px] bg-[#6587A8] mb-4"></div>
                <div className="w-18 h-[2px] bg-[#6587A8] mb-4"></div>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/faq" className="hover:text-[#6587A8] transition">
                  FAQs
                </Link>
                <Link href="/support" className="hover:text-[#6587A8] transition">
                  Support
                </Link>
                <Link href="/terms-and-conditions" className="hover:text-[#6587A8] transition">
                  Terms & Conditions
                </Link>
                <Link href="/privacy-policy" className="hover:text-[#6587A8] transition">
                  Privacy Policy
                </Link>
              </div>
            </div>

            <div className="md:col-span-3 ms-0 md:ms-7">
              <h1 className="font-semibold mb-2 text-xl">Lets Try out</h1>
              <div className="flex justify-start gap-1">
                <div className="w-14 h-[2px] bg-[#6587A8] mb-4"></div>
                <div className="w-14 h-[2px] bg-[#6587A8] mb-4"></div>
              </div>
              <div className="flex flex-col items-start gap-1">
                <CustomButton size="lg" className="mt-2 !font-normal !text-base" onClick={() => setIsModalOpen(true)}>
                  Request Demo
                </CustomButton>

                <CustomButton size="lg" onClick={handleLoginClick} className="mt-3 !font-normal !text-base">
                  Login
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 bg-[#6587A8] text-white hover:bg-[#CFE3C0] hover:text-[#6587A8] p-3 rounded-full transition cursor-pointer" aria-label="Scroll to top">
          <ChevronUp size={20} />
        </button>
      </footer>
      <ScheduleDemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}