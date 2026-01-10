'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import type { LangKey } from '@/types';
import type { TermsConditionsBlock, TermsConditionsSection as TCSectionType } from '@/types/termsConditions';
import { SectionProps } from '@/types/section';
import { getSectionData } from '@/hooks/getSectionData';

// Portable Text Renderer Component
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
                <p className="text-sm text-gray-500 text-center mt-2 italic">{block.caption}</p>
              )}
            </div>
          );
        }

        if (block._type === 'block') {
          const style = block.style || 'normal';
          const isListItem = block.listItem;

          const children = block.children?.map((child, childIndex) => {
            let content: React.ReactNode = child.text;
            const marks = child.marks || [];

            // Apply text decorations
            if (marks.includes('strong')) {
              content = <strong key={childIndex}>{content}</strong>;
            }
            if (marks.includes('em')) {
              content = <em key={childIndex}>{content}</em>;
            }
            if (marks.includes('code')) {
              content = (
                <code key={childIndex} className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                  {content}
                </code>
              );
            }

            // Check for links
            const linkMark = block.markDefs?.find((def) => marks.includes(def._key));
            if (linkMark && linkMark.href) {
              return (
                <a 
                  key={childIndex} 
                  href={linkMark.href} 
                  className="text-blue-600 hover:text-blue-700 underline" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              );
            }

            return <span key={childIndex}>{content}</span>;
          });

          // Render based on style
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
                <h2 key={block._key || index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">
                  {children}
                </h2>
              );
            case 'h3':
              return (
                <h3 key={block._key || index} className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                  {children}
                </h3>
              );
            case 'h4':
              return (
                <h4 key={block._key || index} className="text-lg font-semibold text-gray-900 mt-3 mb-2">
                  {children}
                </h4>
              );
            case 'blockquote':
              return (
                <blockquote key={block._key || index} className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4">
                  {children}
                </blockquote>
              );
            default:
              return (
                <p key={block._key || index} className="text-gray-700 leading-relaxed">
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

export default function TermsConditionsSection({ id }: SectionProps) {
  const pathname = usePathname();
  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : '';
  const [data, setData] = useState<TCSectionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Fetch data dari Sanity
  useEffect(() => {
    async function fetchContent() {
      if (!id) return;

      try {
        setLoading(true);
        const sectionData = await getSectionData(id);
        if (sectionData?.terms_and_conditions_section_content) {
          setData(sectionData.terms_and_conditions_section_content as unknown as TCSectionType);
        }
      } catch (error) {
        console.error('Error fetching terms and conditions content:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [id]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-6 w-48 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.terms_and_conditions_content?.items) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">No terms and conditions content available.</p>
      </div>
    );
  }

  const items = data.terms_and_conditions_content.items.filter((item) => item.published_at);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {items.map((item, index) => {
            const isExpanded = expandedSections.has(item._id);
            const title = currentLang === 'id' ? item.title.id : item.title.en;
            const content = currentLang === 'id' ? item.content_id : item.content_en;

            return (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 animate__animated animate__fadeInUp"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both',
                }}
              >
                <button 
                  onClick={() => toggleSection(item._id)} 
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {item.icon_type?.asset?.url && (
                      <div className="w-12 h-12 bg-[#061551] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img 
                          src={item.icon_type.asset.url} 
                          alt={title} 
                          className="w-6 h-6 brightness-0 invert" 
                        />
                      </div>
                    )}
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                  </div>
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>

                {isExpanded && content && (
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