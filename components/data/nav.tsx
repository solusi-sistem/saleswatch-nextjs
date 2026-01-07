'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LangKey } from '@/types';

interface NavItem {
  label: string;
  href: string;
}

export default function Nav({
  isMobile = false,
  onNavClick,
  navItems = []
}: {
  isMobile?: boolean;
  onNavClick?: (href: string) => void;
  navItems?: NavItem[];
}) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('');

  // Deteksi bahasa dari pathname
  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : 'en';

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      if (window.scrollY < 200) {
        setActiveSection('');
        return;
      }

      // Extract sections dari menu items yang punya hash
      const sections = navItems
        .filter(item => item.href.includes('#'))
        .map(item => item.href.split('#')[1])
        .filter(Boolean);

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes('#') && onNavClick) {
      e.preventDefault();
      onNavClick(href);
    }
  };

  const isActive = (href: string) => {
    // Untuk home page
    if (href === '/' || href === `/${currentLang}`) {
      return (pathname === '/' || pathname === `/${currentLang}`) && activeSection === '';
    }

    // Untuk section dengan hash
    if (href.includes('#')) {
      const section = href.split('#')[1];
      return activeSection === section;
    }

    // Untuk page lain
    return pathname === href || pathname === `/${currentLang}${href}`;
  };

  // Normalisasi href untuk menambahkan locale jika perlu
  const normalizeHref = (href: string) => {
    // Jika href adalah root
    if (href === '/') {
      return `/${currentLang}`;
    }
    
    // Jika href sudah punya locale, return as-is
    if (href.startsWith('/en') || href.startsWith('/id')) {
      return href;
    }
    
    // Jika href adalah hash (#about), tambahkan locale
    if (href.startsWith('/#')) {
      return `/${currentLang}${href.substring(1)}`;
    }
    
    // Jika href adalah path biasa (/features), tambahkan locale
    if (href.startsWith('/')) {
      return `/${currentLang}${href}`;
    }
    
    return href;
  };

  if (navItems.length === 0) {
    return null;
  }

  return (
    <nav className={isMobile ? 'flex flex-col gap-2' : 'flex items-center gap-3 lg:gap-4 xl:gap-5 2xl:gap-7'}>
      {navItems.map((item, index) => (
        <Link
          key={`${item.href}-${index}`}
          href={normalizeHref(item.href)}
          onClick={(e) => handleClick(e, item.href)}
          className={`block transition ${
            isActive(item.href)
              ? 'text-blue-300/60 font-semibold'
              : 'text-[#CFE3C0] hover:text-blue-200'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}