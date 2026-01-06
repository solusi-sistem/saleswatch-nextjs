'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav({
  isMobile = false,
  onNavClick
}: {
  isMobile?: boolean;
  onNavClick?: (href: string) => void
}) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('');

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    // { label: 'Blog', href: '/blog' },
    { label: 'Support', href: '/support' },
  ];

  useEffect(() => {
    // Fungsi untuk mendeteksi section yang sedang terlihat
    const handleScroll = () => {
      const sections = ['about', 'features', 'support'];
      const scrollPosition = window.scrollY + 150; // offset untuk header

      // Cek apakah di bagian paling atas (home)
      if (window.scrollY < 200) {
        setActiveSection('');
        return;
      }

      // Cek setiap section
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

    // Jalankan saat pertama kali load
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Jika href mengandung hash (#), prevent default dan gunakan smooth scroll
    if (href.includes('#') && onNavClick) {
      e.preventDefault();
      onNavClick(href);
    }
  };

  const isActive = (href: string) => {
    // Untuk home page
    if (href === '/') {
      return pathname === '/' && activeSection === '';
    }

    // Untuk section dengan hash
    if (href.includes('#')) {
      const section = href.split('#')[1];
      return activeSection === section;
    }

    // Untuk page lain (pricing, blog, etc)
    return pathname === href;
  };

  return (
    <nav className={isMobile ? 'flex flex-col gap-2' : 'hidden md:flex items-center md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-7'}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={(e) => handleClick(e, item.href)}
          className={`block transition ${isActive(item.href)
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