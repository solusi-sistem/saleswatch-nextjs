'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

import { getSectionData } from '@/hooks/getSectionData';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import type { Section, SectionProps, PrivacyPolicyItem } from '@/types/section';
import type { LangKey } from '@/types';
import type { TermsConditionsBlock } from '@/types/termsConditions';

const CACHE_KEY = 'terms_conditions_cache';
const CACHE_DURATION = 5 * 60 * 1000;

interface CachedData {
  data: Section;
  timestamp: number;
}

function PortableTextRenderer({ blocks }: { blocks: TermsConditionsBlock[] }) {
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
                    alt={block.alt || 'Terms and Conditions Image'}
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
          const style = block.style || 'normal';
          const isListItem = block.listItem;

          const children = block.children?.map((child, i) => {
            let content: React.ReactNode = child.text;

            if (child.marks?.includes('strong')) content = <strong>{content}</strong>;
            if (child.marks?.includes('em')) content = <em>{content}</em>;
            if (child.marks?.includes('code')) {
              content = (
                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                  {content}
                </code>
              );
            }

            const link = block.markDefs?.find((def) =>
              child.marks?.includes(def._key)
            );

            if (link?.href) {
              return (
                <a
                  key={i}
                  href={link.href}
                  className="text-blue-600 hover:text-blue-700 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              );
            }

            return <span key={i}>{content}</span>;
          });

          if (isListItem) {
            return (
              <li key={block._key || index} className="ml-6 text-gray-700">
                {children}
              </li>
            );
          }

          switch (style) {
            case 'h2':
              return (
                <h2 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">
                  {children}
                </h2>
              );
            case 'h3':
              return (
                <h3 key={index} className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                  {children}
                </h3>
              );
            case 'h4':
              return (
                <h4 key={index} className="text-lg font-semibold text-gray-900 mt-3 mb-2">
                  {children}
                </h4>
              );
            case 'blockquote':
              return (
                <blockquote key={index} className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4">
                  {children}
                </blockquote>
              );
            default:
              return (
                <p key={index} className="text-gray-700 leading-relaxed text-sm md:text-lg">
                  {children}
                </p>
              );
          }
        }

        return null;
      })}
    </div>
  );
}

/* ===============================
   MAIN COMPONENT
================================ */
export default function TermsConditionsSection({ id }: SectionProps) {
  const pathname = usePathname();
  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : '';

  const [sectionData, setSectionData] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const getCachedData = (): Section | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const parsedCache: CachedData = JSON.parse(cached);
      const now = Date.now();

      if (now - parsedCache.timestamp < CACHE_DURATION) {
        return parsedCache.data;
      } else {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
    } catch (error) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  };

  const setCachedData = (data: Section) => {
    try {
      const cacheData: CachedData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      const cachedContent = getCachedData();
      if (cachedContent) {
        setSectionData(cachedContent);
        setLoading(false);
      }

      try {
        const data = await getSectionData(id);
        if (data) {
          setSectionData(data);
          setCachedData(data);
        }
      } catch (error) {
        if (!sectionData && cachedContent) {
          setSectionData(cachedContent);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const interval = setInterval(async () => {
      try {
        const data = await getSectionData(id);
        if (data) {
          const currentDataString = JSON.stringify(sectionData);
          const newDataString = JSON.stringify(data);
          
          if (currentDataString !== newDataString) {
            setSectionData(data);
            setCachedData(data);
          }
        }
      } catch (error) {
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [id, sectionData]);

  const toggle = (itemId: string) => {
    const s = new Set(expanded);
    s.has(itemId) ? s.delete(itemId) : s.add(itemId);
    setExpanded(s);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const items: PrivacyPolicyItem[] =
    sectionData?.terms_and_conditions_section_content?.terms_and_conditions ?? [];

  const publishedItems = items.filter((item) => item.published_at);

  if (!publishedItems.length) {
    return (
      <div className="min-h-screen bg-[#f2f7ff] flex items-center justify-center">
        <p className="text-gray-500">No terms and conditions available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f7ff]" id={id}>
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {publishedItems.map((item) => {
            const isOpen = expanded.has(item._id);
            const title = currentLang === 'id' ? item.title.id : item.title.en;
            const content =
              currentLang === 'id' ? item.content_id : item.content_en;

            return (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* HEADER */}
                <button
                  onClick={() => toggle(item._id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {item.icon_type?.asset?.url && (
                      <div className="w-12 h-12 bg-[#061551] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Image
                          src={item.icon_type.asset.url}
                          alt={title}
                          width={24}
                          height={24}
                          className="object-contain"
                          style={{ filter: 'brightness(0) invert(1)' }}
                        />
                      </div>
                    )}
                    <h2 className="text-md md:text-xl font-semibold text-gray-900">
                      {title}
                    </h2>
                  </div>

                  <div className="flex-shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* CONTENT */}
                {isOpen && content && (
                  <div className="px-6 pb-6 pt-2 animate-fadeIn">
                    <div className="pl-16">
                      <PortableTextRenderer blocks={content} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}