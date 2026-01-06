'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import Nav from '../data/nav';
import { Button } from '@/components/ui/button';
import ScheduleDemoModal from '@/components/modals/ScheduleDemoModal';

type LangKey = 'en' | 'id';

const LANGUAGES: Record<LangKey, { label: string; flag: string }> = {
  en: { label: 'English', flag: '/assets/images/EN.svg' },
  id: { label: 'Indonesia', flag: '/assets/images/IN.webp' },
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<LangKey>('en');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const langRef = useRef<HTMLDivElement>(null);

  const closeAll = () => {
    setMobileMenuOpen(false);
    setLangOpen(false);
  };

  const handleLoginClick = () => {
    window.location.href = 'https://dash.saleswatch.id/login';
  };

  const handleRequestDemoClick = () => {
    closeAll();
    setIsModalOpen(true);
  };

  const handleNavClick = (href: string) => {
    if (href.includes('#')) {
      const hash = href.split('#')[1];
      
      if (hash) {
        if (mobileMenuOpen) {
          closeAll();
        }

        if (pathname === '/') {
          const targetElement = document.getElementById(hash);
          
          if (targetElement) {
            setTimeout(() => {
              const headerOffset = 100;
              const elementPosition = targetElement.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }, mobileMenuOpen ? 100 : 0);
          }
        } else {
          router.push(`/#${hash}`);
        }
      }
    } else {
      closeAll();
    }
  };

  useEffect(() => {
    if (pathname === '/' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      
      setTimeout(() => {
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

  return (
    <>
      <header className="absolute top-0 left-0 right-0 text-white z-50 px-5 md:px-8 lg:px-12 pt-0">
        {/* ================= DESKTOP HEADER ================= */}
        <div className="md:max-w-4xl lg:max-w-5xl xl:max-w-5xl 2xl:max-w-6xl mx-auto flex items-center justify-between py-5 px-6 lg:px-12 bg-[#061551] backdrop-blur-sm rounded-b-[50px]">
          <Link href="/" className="flex items-center">
            <Image src="/assets/images/SALESWATCH_LOGO.webp" alt="Saleswatch Logo" width={170} height={100} priority />
          </Link>

          {/* DESKTOP NAV — hanya muncul di lg ke atas */}
          <div className="hidden lg:flex">
            <Nav onNavClick={handleNavClick} />
          </div>

          {/* DESKTOP ACTIONS — hanya muncul di lg ke atas */}
          <div className="hidden lg:flex items-center gap-4">
            {/* LANGUAGE */}
            <div className="relative" ref={langRef}>
              <button onClick={() => setLangOpen(!langOpen)} className="p-2 bg-white/10 rounded-md hover:bg-white/20 transition">
                <img src={LANGUAGES[currentLang].flag} alt={LANGUAGES[currentLang].label} className="w-5 h-3" />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-[#061551] border border-white/20 rounded-md overflow-hidden">
                  {(Object.keys(LANGUAGES) as LangKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setCurrentLang(key);
                        setLangOpen(false);
                      }}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-white/10 ${currentLang === key ? 'bg-white/10' : ''}`}
                    >
                      <img src={LANGUAGES[key].flag} className="w-5 h-3" />
                      {LANGUAGES[key].label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={handleRequestDemoClick} className="bg-[#6587A8] hover:bg-[#CFE3C0] hover:text-[#6587A8]">
              Request Demo
            </Button>

            <Button onClick={handleLoginClick} className="bg-[#6587A8] hover:bg-[#CFE3C0] hover:text-[#6587A8] cursor-pointer">
              Login
            </Button>
          </div>

          {/* MOBILE + TABLET TOGGLE — muncul di bawah lg */}
          <button className="lg:hidden p-2 text-2xl" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
            ☰
          </button>
        </div>

        {/* ================= MOBILE & TABLET SIDEBAR ================= */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-[#061551] lg:hidden">
            {/* HEADER MOBILE */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <Image src="/assets/images/SALESWATCH_LOGO.webp" alt="Saleswatch Logo" width={150} height={80} />
              <button onClick={closeAll} className="text-3xl leading-none" aria-label="Close menu">
                ✕
              </button>
            </div>

            {/* MOBILE NAV + ACTIONS */}
            <div className="px-6 py-6 space-y-2">
              <Nav isMobile onNavClick={handleNavClick} />

              {/* LANGUAGE */}
              <div className="flex gap-3 pt-4">
                {(Object.keys(LANGUAGES) as LangKey[]).map((key) => (
                  <button key={key} onClick={() => setCurrentLang(key)} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${currentLang === key ? 'bg-white/20' : 'bg-white/10'}`}>
                    <img src={LANGUAGES[key].flag} className="w-5 h-3" />
                    {LANGUAGES[key].label}
                  </button>
                ))}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-4 pt-6">
                <Button onClick={handleRequestDemoClick} className="w-full bg-[#6587A8] hover:bg-[#CFE3C0] hover:text-[#6587A8]">
                  Request Demo
                </Button>

                <Button onClick={handleLoginClick} className="w-full bg-[#6587A8] hover:bg-[#CFE3C0] hover:text-[#6587A8] cursor-pointer">
                  Login
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Modal Schedule Demo */}
      <ScheduleDemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}