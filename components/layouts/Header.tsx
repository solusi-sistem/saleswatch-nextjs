'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import Nav from '../data/nav';
import ScheduleDemoModal from '@/components/modals/ScheduleDemoModal';
import { useLayout } from '@/contexts/LayoutContext';
import { urlFor } from '@/lib/sanity.realtime';
import { scrollToSection } from '@/lib/scrollToSection';
import type { LangKey, LanguageMap } from '@/types';
import { setLocaleCookie } from '@/app/actions/locale';

const LANGUAGES: LanguageMap = {
  '': { label: 'English', flag: '/assets/images/EN.svg' },
  id: { label: 'Indonesia', flag: '/assets/images/IN.webp' },
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const langRef = useRef<HTMLDivElement>(null);

  const { layoutData, loading } = useLayout();

  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : '';

  // Memoize logo URLs
  const logoUrls = useMemo(() => {
    const logoHeader = layoutData?.header?.logo_header;

    if (!logoHeader) return { logo: null, logoTeks: null };

    try {
      const logo = logoHeader.logo ? urlFor(logoHeader.logo).width(100).height(100).fit('max').auto('format').url() : null;

      const logoTeks = logoHeader.logo_teks ? urlFor(logoHeader.logo_teks).width(200).fit('max').auto('format').url() : null;

      return { logo, logoTeks };
    } catch (err) {
      return { logo: null, logoTeks: null };
    }
  }, [layoutData]);

  const regularMenuItems =
    layoutData?.header?.menu_header
      ?.filter((item) => item.show_menu !== false)
      ?.map((item) => ({
        label: currentLang === '' ? item.label_menu?.label_menu_en || '' : item.label_menu?.label_menu_id || '',
        href: item.path_menu || '/',
      })) || [];

  const ctaButtons = layoutData?.header?.cta_buttons;
  const showRequestDemo = ctaButtons?.request_demo_button?.show_button === true;
  const showLogin = ctaButtons?.login_button?.show_button === true;

  const requestDemoText = currentLang === '' ? ctaButtons?.request_demo_button?.text_en || 'Request Demo' : ctaButtons?.request_demo_button?.text_id || 'Minta Demo';

  const loginText = currentLang === '' ? ctaButtons?.login_button?.text_en || 'Login' : ctaButtons?.login_button?.text_id || 'Masuk';

  const loginUrl = ctaButtons?.login_button?.login_url || 'https://dash.saleswatch.id/login';

  const closeAll = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setLangOpen(false);
    }, 300); // Wait for animation to complete
  };

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const handleLoginClick = () => {
    window.location.href = loginUrl;
  };

  const handleRequestDemoClick = () => {
    closeAll();
    setIsModalOpen(true);
  };

  const handleLanguageSwitch = async (newLang: LangKey) => {
    setLangOpen(false);
    if (newLang === currentLang) return;

    await setLocaleCookie(newLang === '' ? 'en' : 'id');

    let pathWithoutLang = pathname;
    if (currentLang === 'id' && pathname.startsWith('/id')) {
      pathWithoutLang = pathname.substring(3) || '/';
    }

    const newPath = newLang === '' ? pathWithoutLang : `/id${pathWithoutLang}`;
    router.push(newPath);
  };

  const handleScrollToSection = (hash: string, delay: number = 0) => {
    setTimeout(() => {
      scrollToSection(hash, {
        headerOffset: 100,
        delay: 100,
      });
    }, delay);
  };

  const handleNavClick = (href: string) => {
    const isAnchorLink = href.includes('/#');

    if (isAnchorLink) {
      const hash = href.split('#')[1];

      if (hash) {
        if (mobileMenuOpen) {
          closeAll();
        }

        const isLocalePage = pathname === '/' || pathname === '/id';

        if (isLocalePage) {
          handleScrollToSection(hash, mobileMenuOpen ? 100 : 0);
        } else {
          const homePath = currentLang === '' ? '/' : '/id';
          router.push(`${homePath}#${hash}`);
        }
      }
    } else {
      closeAll();
    }
  };

  useEffect(() => {
    const isLocalePage = pathname === '/' || pathname === '/id';

    if (isLocalePage && window.location.hash) {
      const hash = window.location.hash.substring(1);

      scrollToSection(hash, {
        headerOffset: 100,
        delay: 100,
        maxAttempts: 30,
        retryInterval: 200,
      });
    }
  }, [pathname]);

  useEffect(() => {
    const handleHashChange = () => {
      const isLocalePage = pathname === '/' || pathname === '/id';

      if (isLocalePage && window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetElement = document.getElementById(hash);

        if (targetElement) {
          setTimeout(() => {
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          }, 100);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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
      <header className="absolute top-0 left-0 right-0 text-white z-50 px-9 md:px-8 lg:px-12 pt-0">
        <div className="md:max-w-4xl lg:max-w-5xl xl:max-w-5xl 2xl:max-w-6xl mx-auto flex items-center justify-between py-5 md:py-3 px-6 lg:px-12 bg-[#061551] backdrop-blur-sm rounded-b-[50px]">
          <Link href={currentLang === '' ? '/' : '/id'} className="flex items-center gap-0 flex-shrink-0">
            {logoUrls.logo && <Image src={logoUrls.logo} alt="Company Logo Icon" width={100} height={100} priority className="w-[50px] md:w-[70px] md:h-[50px] md:h-[70px] object-contain" />}
            {logoUrls.logoTeks && <Image src={logoUrls.logoTeks} alt="Company Logo Text" width={200} height={70} priority className="w-[130px] md:w-[150px] h-auto object-contain -ms-1" />}
            {!logoUrls.logo && !logoUrls.logoTeks && <span className="text-2xl font-bold text-white"></span>}
          </Link>

          <div className="hidden lg:flex flex-1 justify-center">
            <Nav onNavClick={handleNavClick} navItems={regularMenuItems} />
          </div>

          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            {showLanguageSwitcher && (
              <div className="relative" ref={langRef}>
                <button onClick={() => setLangOpen(!langOpen)} className="p-2 bg-white/10 rounded-md hover:bg-white/20 transition" aria-label="Change language">
                  <img src={LANGUAGES[currentLang].flag} alt={LANGUAGES[currentLang].label} className="w-5 h-3" />
                </button>

                {langOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-[#061551] border border-white/20 rounded-md overflow-hidden z-50">
                    {(Object.keys(LANGUAGES) as LangKey[]).map((key) => (
                      <button key={key} onClick={() => handleLanguageSwitch(key)} className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-white/10 ${currentLang === key ? 'bg-white/10' : ''}`}>
                        <img src={LANGUAGES[key].flag} className="w-5 h-3" alt="" />
                        {LANGUAGES[key].label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {showRequestDemo && (
              <button onClick={handleRequestDemoClick} className="bg-[#6587A8] hover:bg-[#CFE3C0] hover:text-[#6587A8] px-4 py-2 rounded-md transition cursor-pointer text-white whitespace-nowrap">
                {requestDemoText}
              </button>
            )}

            {showLogin && (
              <button onClick={handleLoginClick} className="bg-[#6587A8] hover:bg-[#CFE3C0] hover:text-[#6587A8] px-4 py-2 rounded-md transition cursor-pointer text-white whitespace-nowrap">
                {loginText}
              </button>
            )}
          </div>

          <button 
            className="lg:hidden p-2 text-2xl hover:bg-white/10 rounded-md transition-colors" 
            onClick={openMobileMenu} 
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu with Slide Animation */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop with fade animation */}
            <div 
              className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
                isAnimating ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={closeAll}
            />
            
            {/* Sliding Panel */}
            <div 
              className={`fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-[#061551] z-50 lg:hidden 
                transform transition-transform duration-300 ease-out shadow-2xl ${
                isAnimating ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  {logoUrls.logo && (
                    <Image 
                      src={logoUrls.logo} 
                      alt="Company Logo Icon" 
                      width={100} 
                      height={100} 
                      priority 
                      className="w-[50px] md:w-[70px] md:h-[50px] md:h-[70px] object-contain" 
                    />
                  )}
                  {logoUrls.logoTeks && (
                    <Image 
                      src={logoUrls.logoTeks} 
                      alt="Company Logo Text" 
                      width={200} 
                      height={70} 
                      priority 
                      className="w-[130px] md:w-[150px] h-auto object-contain -ms-1" 
                    />
                  )}
                  {!logoUrls.logo && !logoUrls.logoTeks && (
                    <span className="text-2xl font-bold text-white"></span>
                  )}
                </div>
                <button 
                  onClick={closeAll} 
                  className="text-2xl leading-none hover:bg-white/10 rounded-md p-2 transition-colors" 
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <div className="px-6 py-6 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
                <Nav isMobile onNavClick={handleNavClick} navItems={regularMenuItems} />

                {showLanguageSwitcher && (
                  <div className="flex gap-3 pt-4">
                    {(Object.keys(LANGUAGES) as LangKey[]).map((key) => (
                      <button 
                        key={key} 
                        onClick={() => handleLanguageSwitch(key)} 
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                          currentLang === key ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
                        }`}
                      >
                        <img src={LANGUAGES[key].flag} className="w-5 h-3" alt="" />
                        {LANGUAGES[key].label}
                      </button>
                    ))}
                  </div>
                )}

                {(showRequestDemo || showLogin) && (
                  <div className="flex flex-col gap-4 pt-6">
                    {showRequestDemo && (
                      <button 
                        onClick={handleRequestDemoClick} 
                        className="w-full bg-[#6587A8] hover:bg-[#CFE3C0] hover:text-[#6587A8] px-4 py-2 rounded-md transition cursor-pointer text-white"
                      >
                        {requestDemoText}
                      </button>
                    )}

                    {showLogin && (
                      <button 
                        onClick={handleLoginClick} 
                        className="w-full bg-[#6587A8] hover:bg-[#CFE3C0] hover:text-[#6587A8] px-4 py-2 rounded-md transition cursor-pointer text-white"
                      >
                        {loginText}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </header>

      <ScheduleDemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}