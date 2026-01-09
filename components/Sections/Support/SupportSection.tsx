'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, Book } from 'lucide-react';
import Image from 'next/image';

import { getSectionData } from '@/hooks/getSectionData';
import type { Section, SectionProps, SupportPlan } from '@/types/section';
import type { SupportBlock } from '@/types/support';
import { LangKey } from '@/types';

/* =========================================
   PORTABLE TEXT RENDERER
========================================= */
function PortableTextRenderer({ blocks }: { blocks: SupportBlock[] }) {
  if (!blocks) return null;

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block._type === 'image') {
          return (
            <div key={block._key || index} className="my-6">
              {block.asset?.url && (
                <div className="relative w-full h-64">
                  <Image
                    src={block.asset.url}
                    alt={block.alt || 'Support Image'}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
              {block.caption && (
                <p className="text-sm text-gray-500 text-center mt-2 italic">
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
                <code key={i} className="bg-gray-100 px-1 py-0.5 rounded text-sm">
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
              return <h2 key={index} className="text-2xl font-bold">{children}</h2>;
            case 'h3':
              return <h3 key={index} className="text-xl font-semibold">{children}</h3>;
            case 'h4':
              return <h4 key={index} className="text-lg font-semibold">{children}</h4>;
            case 'blockquote':
              return (
                <blockquote
                  key={index}
                  className="border-l-4 border-blue-500 pl-4 italic"
                >
                  {children}
                </blockquote>
              );
            default:
              return <p key={index} className="text-gray-700 leading-relaxed">{children}</p>;
          }
        }

        return null;
      })}
    </div>
  );
}

/* =========================================
   SUPPORT SECTION (SANITY VERSION)
========================================= */
export default function SupportSection({ id }: SectionProps) {
  const pathname = usePathname();
  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : '';

  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  /* =========================================
     FETCH SANITY
  ========================================= */
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

  /* =========================================
     INITIAL STATE (SAMA SEPERTI CONTEXT VERSION)
  ========================================= */
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

  /* =========================================
     HANDLERS
  ========================================= */
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
    }
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ [key]: !prev[key] }));
    setSelectedItem(key);
  };

  /* =========================================
     LOADING
  ========================================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl shadow-lg p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">No support content available.</p>
      </div>
    );
  }

  /* =========================================
     RENDER (IDENTIK DENGAN CONTEXT VERSION)
  ========================================= */
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-4 space-y-2">
              {supportPlans.map((item) => {
                const isActive = selectedCategory === item.key;
                const title = currentLang === 'id' ? item.title.id : item.title.en;

                return (
                  <div
                    key={item._id}
                    className="rounded-lg overflow-hidden border border-gray-200 bg-white"
                  >
                    <button
                      onClick={() => toggleCategory(item.key)}
                      className={`w-full flex items-center justify-between p-4 transition-all duration-200
                          ${isActive ? 'bg-[#061551]/5' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon?.asset?.url && (
                          <div className={`p-2 rounded-lg ${isActive ? 'bg-[#061551]' : 'bg-gray-100'}`}>
                            <img
                              src={item.icon.asset.url}
                              alt={title}
                              className={`w-5 h-5 ${isActive ? 'brightness-0 invert' : ''}`}
                            />
                          </div>
                        )}
                        <span className={`font-semibold ${isActive ? 'text-[#061551]' : 'text-gray-700'}`}>
                          {title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${openCategories[item.key] ? 'rotate-180' : ''
                          }`}
                      />
                    </button>

                    {openCategories[item.key] && item.support_items && (
                      <div className="bg-gray-50 border-t border-gray-200">
                        {item.support_items.map((sub) => {
                          const isItemActive = selectedItem === sub._key;
                          const subTitle =
                            currentLang === 'id' ? sub.title_id : sub.title_en;

                          return (
                            <button
                              key={sub._key}
                              onClick={() => handleCategoryClick(item.key, sub._key)}
                              className={`w-full text-left px-6 py-3 text-sm
                                ${isItemActive
                                  ? 'bg-white text-[#061551] font-semibold border-l-4 border-[#061551]'
                                  : 'text-gray-600 hover:bg-white'}`}
                            >
                              <div className="flex items-center gap-2">
                                <ChevronRight className="w-4 h-4" />
                                {subTitle}
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

        {/* CONTENT */}
        <div className="lg:col-span-8">
          {currentCategory && selectedItem ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 animate__animated animate__fadeInUp">
                <span>Support</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#061551] font-medium">
                  {currentLang === 'id' ? currentCategory.title.id : currentCategory.title.en}
                </span>
              </div>

              <div className="space-y-4">
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
                        className="w-full flex items-start justify-between p-6 text-left group"
                      >
                        <div className="flex-1 pr-4">
                          <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#061551] transition-colors">
                            {subTitle}
                          </h3>
                        </div>
                        <div className={`transition-transform duration-300 mt-1 ${openAccordions[subItem._key] ? 'rotate-180' : ''
                          }`}>
                          <ChevronDown className="w-6 h-6 text-[#061551]" />
                        </div>
                      </button>

                      {openAccordions[subItem._key] && content && (
                        <div className="px-6 pb-6 border-t border-gray-200 pt-4 bg-gray-50">
                          <PortableTextRenderer blocks={content} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <div className="mt-10 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 animate__animated animate__fadeInUp">
                      {currentLang === 'id' ? 'Masih butuh bantuan?' : 'Still need help?'}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 animate__animated animate__fadeInUp">
                      {currentLang === 'id'
                        ? 'Tim support kami siap membantu Anda 24/7'
                        : 'Our support team is ready to help you 24/7'
                      }
                    </p>
                    <button className="bg-[#061551] hover:bg-[#061551]/90 text-white font-semibold px-6 py-3 
                        animate__animated animate__fadeInUp rounded-lg transition-all duration-200 hover:shadow-lg"
                    >
                      {currentLang === 'id' ? 'Hubungi Support' : 'Contact Support'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 
                            flex items-center justify-center min-h-[600px]"
            >
              <div className="text-center p-12">
                <div className="w-24 h-24 bg-[#061551]/10 rounded-2xl animate__animated animate__fadeInUp 
                                flex items-center justify-center mx-auto mb-6"
                >
                  <Book className="w-12 h-12 text-[#061551]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 animate__animated animate__fadeInUp">
                  {currentLang === 'id' ? 'Pilih Kategori Bantuan' : 'Select Help Category'}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto animate__animated animate__fadeInUp">
                  {currentLang === 'id'
                    ? 'Silakan pilih kategori di sidebar untuk menemukan jawaban yang Anda butuhkan'
                    : 'Please select a category in the sidebar to find the answers you need'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
