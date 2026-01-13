'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, Book } from 'lucide-react';
import Image from 'next/image';

import { getSectionData } from '@/hooks/getSectionData';
import ScheduleDemoModal from '@/components/modals/ScheduleDemoModal';
import type { Section, SectionProps, SupportPlan } from '@/types/section';
import type { SupportBlock } from '@/types/support';
import { LangKey } from '@/types';

function PortableTextRenderer({ blocks }: { blocks: SupportBlock[] }) {
  if (!blocks) return null;

  return (
    <div className="space-y-3 md:space-y-4">
      {blocks.map((block, index) => {
        if (block._type === 'image') {
          return (
            <div key={block._key || index} className="my-4 md:my-6">
              {block.asset?.url && (
                <div className="relative w-full h-48 md:h-64">
                  <Image
                    src={block.asset.url}
                    alt={block.alt || 'Support Image'}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
              {block.caption && (
                <p className="text-xs md:text-sm text-gray-500 text-center mt-2 italic">
                  {block.caption}
                </p>
              )}
            </div>
          );
        }

        if (block._type === 'block') {
          const children = block.children?.map((child, i) => {
            let el: React.ReactNode = child.text;

            if (child.marks?.includes('strong')) el = <strong key={i}>{el}</strong>;
            if (child.marks?.includes('em')) el = <em key={i}>{el}</em>;
            if (child.marks?.includes('code')) {
              el = (
                <code key={i} className="bg-gray-100 px-1 py-0.5 rounded text-xs md:text-sm">
                  {el}
                </code>
              );
            }

            const link = block.markDefs?.find((d) =>
              child.marks?.includes(d._key)
            );

            if (link?.href) {
              return (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {el}
                </a>
              );
            }

            return <span key={i}>{el}</span>;
          });

          switch (block.style) {
            case 'h2':
              return <h2 key={index} className="text-xl md:text-2xl font-bold">{children}</h2>;
            case 'h3':
              return <h3 key={index} className="text-lg md:text-xl font-semibold">{children}</h3>;
            case 'h4':
              return <h4 key={index} className="text-base md:text-lg font-semibold">{children}</h4>;
            case 'blockquote':
              return (
                <blockquote
                  key={index}
                  className="border-l-4 border-blue-500 pl-3 md:pl-4 italic text-sm md:text-base"
                >
                  {children}
                </blockquote>
              );
            default:
              return <p key={index} className="text-sm md:text-base text-gray-700 leading-relaxed">{children}</p>;
          }
        }

        return null;
      })}
    </div>
  );
}

export default function SupportSection({ id }: SectionProps) {
  const pathname = usePathname();
  const currentLang = (pathname.startsWith('/id') ? 'id' : 'en') as LangKey;

  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      const res = await getSectionData(id);
      setSection(res);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const supportPlans: SupportPlan[] = useMemo(
    () => section?.support_section_content?.support_plans || [],
    [section]
  );

  const currentCategory = supportPlans.find(
    (item) => item.key === selectedCategory
  );

  const bottomCTA = section?.support_section_content?.bottom_cta;
  const emptyState = section?.support_section_content?.empty_state;

  const ctaTitle = currentLang === 'id' 
    ? (bottomCTA?.cta_title?.id || bottomCTA?.cta_title?.en)
    : (bottomCTA?.cta_title?.en || bottomCTA?.cta_title?.id);
  const ctaDescription = currentLang === 'id'
    ? (bottomCTA?.cta_description?.id || bottomCTA?.cta_description?.en)
    : (bottomCTA?.cta_description?.en || bottomCTA?.cta_description?.id);
  const ctaButtonText = currentLang === 'id'
    ? (bottomCTA?.cta_button?.button_text?.id || bottomCTA?.cta_button?.button_text?.en || 'Hubungi Support')
    : (bottomCTA?.cta_button?.button_text?.en || bottomCTA?.cta_button?.button_text?.id || 'Contact Support');
  const ctaButtonLink = bottomCTA?.cta_button?.button_link;
  
  const showCTA = bottomCTA?.show_cta === true && !!ctaTitle && !!ctaDescription;

  const emptyStateTitle = currentLang === 'id'
    ? (emptyState?.title?.id || emptyState?.title?.en || 'Pilih Kategori Bantuan')
    : (emptyState?.title?.en || emptyState?.title?.id || 'Select Help Category');
  const emptyStateDescription = currentLang === 'id'
    ? (emptyState?.description?.id || emptyState?.description?.en || 'Silakan pilih kategori di sidebar untuk menemukan jawaban yang Anda butuhkan')
    : (emptyState?.description?.en || emptyState?.description?.id || 'Please select a category in the sidebar to find the answers you need');

  useEffect(() => {
    if (!supportPlans.length) return;

    const firstCategory = supportPlans[0];
    const firstSubItem = firstCategory.support_items?.[0]?._key;

    if (!selectedCategory) {
      setSelectedCategory(firstCategory.key);
      setOpenCategories({ [firstCategory.key]: true });
    }

    if (firstSubItem && !selectedItem) {
      setSelectedItem(firstSubItem);
      setOpenAccordions({ [firstSubItem]: true });
    }
  }, [supportPlans, selectedCategory, selectedItem]);

  const toggleCategory = (key: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCategoryClick = (key: string, subKey?: string) => {
    setSelectedCategory(key);
    setOpenCategories({ [key]: true });

    if (subKey) {
      setSelectedItem(subKey);
      setOpenAccordions({ [subKey]: true });
      
      // Scroll to content on mobile after a short delay
      if (window.innerWidth < 1024 && contentRef.current) {
        setTimeout(() => {
          contentRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
          });
        }, 100);
      }
    }
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ [key]: !prev[key] }));
    setSelectedItem(key);
  };

  const handleCTAClick = () => {
    if (ctaButtonLink) {
      window.open(ctaButtonLink, '_blank');
    } else {
      setIsModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f7ff] py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl shadow-lg p-3 md:p-4 space-y-3 md:space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-14 md:h-16 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
                <div className="animate-pulse space-y-3 md:space-y-4">
                  <div className="h-5 md:h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-24 md:h-32 bg-gray-200 rounded"></div>
                  <div className="h-24 md:h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!supportPlans.length) {
    return (
      <div className="min-h-screen bg-[#f2f7ff] flex items-center justify-center px-4">
        <p className="text-sm md:text-base text-gray-500">No support content available.</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#f2f7ff] py-8 md:py-12">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 px-4 md:px-5">

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-3 md:space-y-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="p-3 md:p-4 space-y-2">
                {supportPlans.map((item) => {
                  const isActive = selectedCategory === item.key;
                  const title = currentLang === 'id' 
                    ? (item.title?.id || item.title?.en || '')
                    : (item.title?.en || item.title?.id || '');

                  return (
                    <div
                      key={item._id}
                      className="rounded-lg overflow-hidden border border-gray-200 bg-white"
                    >
                      <button
                        onClick={() => toggleCategory(item.key)}
                        className={`w-full flex items-center justify-between p-3 md:p-4 transition-all duration-200
                            ${isActive ? 'bg-[#061551]/5' : 'hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-2 md:gap-3">
                          {item.icon?.asset?.url && (
                            <div className={`p-1.5 md:p-2 rounded-lg ${isActive ? 'bg-[#061551]' : 'bg-gray-100'}`}>
                              <img
                                src={item.icon.asset.url}
                                alt={title}
                                className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'brightness-0 invert' : ''}`}
                              />
                            </div>
                          )}
                          <span className={`text-sm md:text-base font-semibold ${isActive ? 'text-[#061551]' : 'text-gray-700'}`}>
                            {title}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${openCategories[item.key] ? 'rotate-180' : ''
                            }`}
                        />
                      </button>

                      {openCategories[item.key] && item.support_items && (
                        <div className="bg-gray-50 border-t border-gray-200">
                          {item.support_items.map((sub) => {
                            const isItemActive = selectedItem === sub._key;
                            const subTitle = currentLang === 'id' ? sub.title_id : sub.title_en;

                            return (
                              <button
                                key={sub._key}
                                onClick={() => handleCategoryClick(item.key, sub._key)}
                                className={`w-full text-left px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm
                                  ${isItemActive
                                    ? 'bg-white text-[#061551] font-semibold border-l-4 border-[#061551]'
                                    : 'text-gray-600 hover:bg-white'}`}
                              >
                                <div className="flex items-center gap-2">
                                  <ChevronRight className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                                  <span className="line-clamp-2">{subTitle}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8" ref={contentRef}>
            {currentCategory && selectedItem ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-8">
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6 animate__animated animate__fadeInUp">
                  <span>Support</span>
                  <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-[#061551] font-medium line-clamp-1">
                    {currentLang === 'id' 
                      ? (currentCategory.title?.id || currentCategory.title?.en)
                      : (currentCategory.title?.en || currentCategory.title?.id)}
                  </span>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {currentCategory.support_items.map((subItem) => {
                    const subTitle = currentLang === 'id' ? subItem.title_id : subItem.title_en;
                    const content = currentLang === 'id' ? subItem.content_id : subItem.content_en;

                    return (
                      <div
                        key={subItem._key}
                        className="bg-white rounded-lg border-2 border-gray-200 hover:border-[#061551]/30 
                                          animate__animated animate__fadeInUp transition-all duration-200 overflow-hidden hover:shadow-md"
                      >
                        <button
                          onClick={() => toggleAccordion(subItem._key)}
                          className="w-full flex items-start justify-between p-4 md:p-6 text-left group"
                        >
                          <div className="flex-1 pr-3 md:pr-4">
                            <h3 className="font-bold text-base md:text-lg text-gray-800 group-hover:text-[#061551] transition-colors">
                              {subTitle}
                            </h3>
                          </div>
                          <div className={`transition-transform duration-300 mt-0.5 md:mt-1 flex-shrink-0 ${openAccordions[subItem._key] ? 'rotate-180' : ''
                            }`}>
                            <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-[#061551]" />
                          </div>
                        </button>

                        {openAccordions[subItem._key] && content && (
                          <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-gray-200 pt-3 md:pt-4 bg-gray-50">
                            <PortableTextRenderer blocks={content} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {showCTA && (
                  <div className="mt-6 md:mt-10 p-4 md:p-6 bg-gradient-to-br from-[#061551]/5 to-blue-50 rounded-xl border-2 border-[#061551]/10">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-2 animate__animated animate__fadeInUp">
                          {ctaTitle}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 animate__animated animate__fadeInUp">
                          {ctaDescription}
                        </p>
                        <button 
                          onClick={handleCTAClick}
                          className="bg-[#061551] hover:bg-[#061551]/90 text-white font-semibold px-5 py-2.5 md:px-6 md:py-3 
                            text-sm md:text-base animate__animated animate__fadeInUp rounded-lg transition-all duration-200 hover:shadow-lg
                            hover:scale-105 active:scale-95"
                        >
                          {ctaButtonText}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 
                              flex items-center justify-center min-h-[400px] md:min-h-[600px]"
              >
                <div className="text-center p-8 md:p-12">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-[#061551]/10 rounded-2xl animate__animated animate__fadeInUp 
                                  flex items-center justify-center mx-auto mb-4 md:mb-6"
                  >
                    <Book className="w-10 h-10 md:w-12 md:h-12 text-[#061551]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3 animate__animated animate__fadeInUp">
                    {emptyStateTitle}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto animate__animated animate__fadeInUp px-4">
                    {emptyStateDescription}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ScheduleDemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}