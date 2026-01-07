'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import Nav from '../data/nav';
import { Button } from '@/components/ui/button';
import ScheduleDemoModal from '@/components/modals/ScheduleDemoModal';
import { useLayout } from '@/contexts/LayoutContext';
import { urlFor } from '@/lib/sanity.realtime';
import type { LangKey, LanguageMap } from '@/types';

const LANGUAGES: LanguageMap = {
  en: { label: 'English', flag: '/assets/images/EN.svg' },
  id: { label: 'Indonesia', flag: '/assets/images/IN.webp' },
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const langRef = useRef<HTMLDivElement>(null);

  const { layoutData, loading } = useLayout();

  // Deteksi bahasa dari pathname
  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : 'en';

  const logoUrl = useMemo(() => {
    if (!layoutData?.header?.logo) return null;

    try {
      const url = urlFor(layoutData.header.logo).width(170).fit('max').auto('format').url();
      return url;
    } catch (err) {
      console.error('❌ Error generating logo URL:', err);
      return null;
    }
  }, [layoutData]);

  const closeAll = () => {
    setMobileMenuOpen(false);
    setLangOpen(false);
  };

  const handleLoginClick = () => {
    const loginUrl = layoutData?.header?.cta_buttons?.login_button?.login_url || 'https://dash.saleswatch.id/login';
    window.location.href = loginUrl;
  };

  const handleRequestDemoClick = () => {
    closeAll();
    setIsModalOpen(true);
  };

  // Handle language switch dengan redirect ke locale yang sesuai
  const handleLanguageSwitch = (newLang: LangKey) => {
    setLangOpen(false);
    
    // Jika sudah di locale yang sama, tidak perlu redirect
    if (newLang === currentLang) return;
    
    // Redirect ke locale baru
    router.push(`/${newLang}`);
  };

  const handleNavClick = (href: string) => {
    if (href.includes('#')) {
      const hash = href.split('#')[1];

      if (hash) {
        if (mobileMenuOpen) {
          closeAll();
        }

        // Check if we're on a locale page
        const isLocalePage = pathname === '/en' || pathname === '/id';

        if (isLocalePage) {
          const targetElement = document.getElementById(hash);

          if (targetElement) {
            setTimeout(
              () => {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth',
                });
              },
              mobileMenuOpen ? 100 : 0
            );
          }
        } else {
          router.push(`/${currentLang}#${hash}`);
        }
      }
    } else {
      closeAll();
    }
  };

  useEffect(() => {
    const isLocalePage = pathname === '/en' || pathname === '/id';
    
    if (isLocalePage && window.location.hash) {
      const hash = window.location.hash.substring(1);

      setTimeout(() => {
        const targetElement = document.getElementById(hash);

        if (targetElement) {
          const headerOffset = 100;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const requestDemoText = currentLang === 'en' 
    ? layoutData?.header?.cta_buttons?.request_demo_button?.text_en || 'Request Demo' 
    : layoutData?.header?.cta_buttons?.request_demo_button?.text_id || 'Minta Demo';

  const loginText = currentLang === 'en' 
    ? layoutData?.header?.cta_buttons?.login_button?.text_en || 'Login' 
    : layoutData?.header?.cta_buttons?.login_button?.text_id || 'Masuk';

  const showRequestDemo = layoutData?.header?.cta_buttons?.request_demo_button?.show_button !== false;
  const showLogin = layoutData?.header?.cta_buttons?.login_button?.show_button !== false;
  const showLanguageSwitcher = layoutData?.header?.language_switcher?.show_language_switcher !== false;

  if (loading) {
    return (
      <header className="absolute top-0 left-0 right-0 text-white z-50 px-5 md:px-8 lg:px-12 pt-0">
        <div className="md:max-w-4xl lg:max-w-5xl xl:max-w-5xl 2xl:max-w-6xl mx-auto flex items-center justify-between py-5 px-6 lg:px-12 bg-[#061551] backdrop-blur-sm rounded-b-[50px]">
          <div className="w-[170px] h-[40px] bg-white/10 animate-pulse rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="absolute top-0 left-0 right-0 text-white z-50 px-5 md:px-8 lg:px-12 pt-0">
        <div className="md:max-w-4xl lg:max-w-5xl xl:max-w-5xl 2xl:max-w-6xl mx-auto flex items-center justify-between py-5 px-6 lg:px-12 bg-[#061551] backdrop-blur-sm rounded-b-[50px]">
          {/* Logo */}
          <Link href={`/${currentLang}`} className="flex items-center">
            {logoUrl ? (
              <Image src={logoUrl} alt="Company Logo" width={170} height={41} priority className="h-auto" />
            ) : (
              <span className="text-2xl font-bold text-white">SALESWATCH</span>
            )}
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex">
            <Nav onNavClick={handleNavClick} />
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-4">
            {showLanguageSwitcher && (
              <div className="relative" ref={langRef}>
                <button 
                  onClick={() => setLangOpen(!langOpen)} 
                  className="p-2 bg-white/10 rounded-md hover:bg-white/20 transition"
                  aria-label="Change language"
                >
                  <img 
                    src={LANGUAGES[currentLang].flag} 
                    alt={LANGUAGES[currentLang].label} 
                    className="w-5 h-3" 
                  />
                </button>

                {langOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-[#061551] border border-white/20 rounded-md overflow-hidden">
                    {(Object.keys(LANGUAGES) as LangKey[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => handleLanguageSwitch(key)}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-white/10 ${
                          currentLang === key ? 'bg-white/10' : ''
                        }`}
                      >
                        <img src={LANGUAGES[key].flag} className="w-5 h-3" alt="" />
                        {LANGUAGES[key].label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {showRequestDemo && (
              <Button onClick={handleRequestDemoClick} className="bg-[#6587A8] hover:bg-[#CFE3C0] hover:text-[#6587A8]">
                {requestDemoText}
              </Button>
            )}

            {showLogin && (
              <Button onClick={handleLoginClick} className="bg-[#6587A8] hover:bg-[#CFE3C0] hover:text-[#6587A8] cursor-pointer">
                {loginText}
              </Button>
            )}
          </div>

          <button className="lg:hidden p-2 text-2xl" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
            ☰
          </button>
        </div>

        {/* MOBILE SIDEBAR */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-[#061551] lg:hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              {logoUrl ? (
                <Image src={logoUrl} alt="Company Logo" width={150} height={36} className="h-auto" />
              ) : (
                <span className="text-xl font-bold text-white">SALESWATCH</span>
              )}
              <button onClick={closeAll} className="text-3xl leading-none" aria-label="Close menu">
                ✕
              </button>
            </div>

            <div className="px-6 py-6 space-y-2">
              <Nav isMobile onNavClick={handleNavClick} />

              {showLanguageSwitcher && (
                <div className="flex gap-3 pt-4">
                  {(Object.keys(LANGUAGES) as LangKey[]).map((key) => (
                    <button 
                      key={key} 
                      onClick={() => handleLanguageSwitch(key)} 
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                        currentLang === key ? 'bg-white/20' : 'bg-white/10'
                      }`}
                    >
                      <img src={LANGUAGES[key].flag} className="w-5 h-3" alt="" />
                      {LANGUAGES[key].label}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-4 pt-6">
                {showRequestDemo && (
                  <Button onClick={handleRequestDemoClick} className="w-full bg-[#6587A8] hover:bg-[#CFE3C0] hover:text-[#6587A8]">
                    {requestDemoText}
                  </Button>
                )}

                {showLogin && (
                  <Button onClick={handleLoginClick} className="w-full bg-[#6587A8] hover:bg-[#CFE3C0] hover:text-[#6587A8] cursor-pointer">
                    {loginText}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <ScheduleDemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}