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
  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : '';

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      if (window.scrollY < 200) {
        setActiveSection('');
        return;
      }

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
    if (href === '/' || href === `/${currentLang}`) {
      return (pathname === '/' || pathname === `/${currentLang}`) && activeSection === '';
    }

    if (href.includes('#')) {
      const section = href.split('#')[1];
      return activeSection === section;
    }

    return pathname === href || pathname === `/${currentLang}${href}`;
  };

  const normalizeHref = (href: string) => {
    if (href.startsWith('http')) {
      return href;
    }

    if (href.startsWith('/en') || href.startsWith('/id')) {
      return href;
    }

    if (href === '/') {
      return currentLang === '' ? '/' : `/id`;
    }

    if (href.startsWith('/#')) {
      return currentLang === '' ? href : `/id${href}`;
    }

    if (href.startsWith('/')) {
      return currentLang === '' ? href : `/id${href}`;
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