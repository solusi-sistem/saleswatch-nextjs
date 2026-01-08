'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Facebook, Linkedin, Instagram, Youtube, Twitter, ChevronUp } from 'lucide-react';
import ScheduleDemoModal from '@/components/modals/ScheduleDemoModal';
import { useLayout } from '@/contexts/LayoutContext';
import { urlFor } from '@/lib/sanity.realtime';
import type { LangKey } from '@/types';

const SOCIAL_ICONS = {
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
};

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { layoutData, loading } = useLayout();

  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : '';

  const footerLogoUrl = useMemo(() => {
    if (!layoutData?.footer?.logo_footer) return null;

    try {
      const url = urlFor(layoutData.footer.logo_footer).width(170).fit('max').auto('format').url();
      return url;
    } catch (err) {
      return null;
    }
  }, [layoutData]);

  const footerDescription = currentLang === '' ? layoutData?.footer?.desc_footer?.desc_footer_en || '' : layoutData?.footer?.desc_footer?.desc_footer_id || '';

  const socialMediaLinks =
    layoutData?.footer?.social_media
      ?.filter((item) => item.show_social_media !== false)
      ?.map((item) => ({
        platform: item.platform || '',
        url: item.url || '#',
        icon: item.icon || null,
      })) || [];

  const footerColumns =
    layoutData?.footer?.footer_columns
      ?.filter((col) => col.show_column !== false)
      ?.map((col) => ({
        title: currentLang === '' ? col.column_title?.title_en || '' : col.column_title?.title_id || '',
        links:
          col.links
            ?.filter((link) => link.show_link !== false)
            ?.map((link) => ({
              label: currentLang === '' ? link.label?.label_en || '' : link.label?.label_id || '',
              path: link.path || '/',
            })) || [],
      })) || [];

  const showScrollToTop = layoutData?.footer?.scroll_to_top?.show_button === true;

  const handleNavClick = (href: string) => {
    if (href.includes('#')) {
      const hash = href.split('#')[1];

      if (hash) {
        const isLocalePage = pathname === '/en' || pathname === '/id';

        if (isLocalePage) {
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
        } else {
          router.push(`/${currentLang}#${hash}`);
        }
      }
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes('#request-demo')) {
      e.preventDefault();
      setIsModalOpen(true);
      return;
    }

    if (href.includes('login') || href.startsWith('https://dash.saleswatch.id')) {
      e.preventDefault();
      return;
    }

    if (href.includes('#')) {
      e.preventDefault();
      handleNavClick(href);
    }
  };

  const normalizeHref = (href: string) => {
    if (href.startsWith('http') || href.startsWith('https://dash.saleswatch.id')) {
      return href;
    }

    if (href === '/') {
      return `/${currentLang}`;
    }

    if (href.startsWith('/en') || href.startsWith('/id')) {
      return href;
    }

    if (href.startsWith('/#')) {
      return `/${currentLang}${href.substring(1)}`;
    }

    if (href.startsWith('/')) {
      return `/${currentLang}${href}`;
    }

    return href;
  };

  return (
    <>
      <footer className="bg-[#061551] text-white py-25 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-9">
            <div className="md:col-span-5 pe-8">
              <Link href={`/${currentLang}`} className="flex items-center">
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

              {footerDescription && (
                <p className="my-5 text-sm leading-relaxed">
                  {footerDescription}
                </p>
              )}

              {socialMediaLinks.length > 0 && (
                <div className="mt-4 flex gap-4">
                  {socialMediaLinks.map((social, index) => {
                    const IconComponent = SOCIAL_ICONS[social.platform as keyof typeof SOCIAL_ICONS];

                    return (
                      <Link key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#6587A8] transition">
                        {IconComponent ? <IconComponent size={18} /> : social.icon ? <Image src={urlFor(social.icon).width(18).height(18).url()} alt={social.platform} width={18} height={18} /> : null}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {footerColumns.map((column, colIndex) => (
              <div key={colIndex} className="md:col-span-2">
                {column.title && (
                  <>
                    <h1 className="font-semibold mb-2 text-xl">{column.title}</h1>
                    <div className="flex justify-start gap-1">
                      <div className="w-14 h-[2px] bg-[#6587A8] mb-4"></div>
                      <div className="w-14 h-[2px] bg-[#6587A8] mb-4"></div>
                    </div>
                  </>
                )}

                {column.links.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {column.links.map((link, linkIndex) => (
                      <Link key={linkIndex} href={normalizeHref(link.path)} onClick={(e) => handleLinkClick(e, link.path)} className="hover:text-[#6587A8] transition">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {footerCTA && (showRequestDemo || showLogin) && (
              <div className="md:col-span-3 ms-0 md:ms-7">
                {ctaTitle && (
                  <>
                    <h1 className="font-semibold mb-2 text-xl">{ctaTitle}</h1>
                    <div className="flex justify-start gap-1">
                      <div className="w-14 h-[2px] bg-[#6587A8] mb-4"></div>
                      <div className="w-14 h-[2px] bg-[#6587A8] mb-4"></div>
                    </div>
                  </>
                )}
                <div className="flex flex-col items-start gap-1">
                  {showRequestDemo && (
                    <CustomButton
                      size="lg"
                      className="mt-2 !font-normal !text-base"
                      onClick={() => setIsModalOpen(true)}
                    >
                      {requestDemoText}
                    </CustomButton>
                  )}

                  {showLogin && (
                    <CustomButton
                      size="lg"
                      onClick={handleLoginClick}
                      className="mt-3 !font-normal !text-base"
                    >
                      {loginText}
                    </CustomButton>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {showScrollToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 bg-[#6587A8] text-white hover:bg-[#CFE3C0] hover:text-[#6587A8] p-3 rounded-full transition cursor-pointer z-50 hidden lg:block"
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} />
          </button>
        )}
      </footer>

      <ScheduleDemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
