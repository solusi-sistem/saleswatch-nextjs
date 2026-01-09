'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { getSectionData } from '@/hooks/getSectionData';
import type { Section } from '@/types/section';
import type { SectionProps } from '@/types/section';

// Interface untuk Privacy Policy Block
interface PrivacyPolicyBlock {
  _key?: string;
  _type: string;
  style?: string;
  listItem?: string;
  children?: Array<{
    _key?: string;
    _type: string;
    text: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _key: string;
    _type: string;
    href?: string;
  }>;
  asset?: {
    url: string;
  };
  alt?: string;
  caption?: string;
}

// Interface untuk Privacy Policy Item
interface PrivacyPolicyItem {
  _id: string;
  title: {
    en: string;
    id: string;
  };
  icon_type?: {
    asset?: {
      url: string;
    };
  };
  content_en: PrivacyPolicyBlock[];
  content_id: PrivacyPolicyBlock[];
  published_at?: boolean;
}

type LangKey = '' | 'id';

// Portable Text Renderer Component
function PortableTextRenderer({ blocks }: { blocks: PrivacyPolicyBlock[] }) {
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
                    alt={block.alt || 'Privacy Policy Image'}
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

          const children = block.children?.map((child, childIndex) => {
            let text: React.ReactNode = child.text;
            const marks = child.marks || [];

            if (marks.includes('strong')) {
              text = <strong>{text}</strong>;
            }
            if (marks.includes('em')) {
              text = <em>{text}</em>;
            }
            if (marks.includes('code')) {
              text = <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{text}</code>;
            }

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
                  {text}
                </a>
              );
            }

            return <span key={childIndex}>{text}</span>;
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

export default function PrivacyPolicySection({ id }: SectionProps) {
  const pathname = usePathname();
  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : '';
  const [sectionData, setSectionData] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      setLoading(true);
      try {
        const data = await getSectionData(id);
        setSectionData(data);
      } catch (error) {
        console.error('Error fetching privacy policy section:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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

  if (!sectionData?.privacy_policy_section_content?.privacy_policy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">No privacy policy content available.</p>
      </div>
    );
  }

  const privacyPolicies =
    sectionData.privacy_policy_section_content?.privacy_policy ?? [];

  // Jika privacy policy adalah single item (reference)
  if (privacyPolicies) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {privacyPolicies.map((item, index) => {
              const isExpanded = expandedSections.has(index.toString());
              const title =
                currentLang === 'id' ? item.title.id : item.title.en;
              const content =
                currentLang === 'id' ? item.content_id : item.content_en;

              return (
                <div
                  key={index.toString()}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  {/* HEADER */}
                  <button
                    onClick={() => toggleSection(index.toString())}
                    className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      {item.icon_type?.asset?.url && (
                        <Image
                          src={item.icon_type.asset.url || ''}
                          alt={title}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                      )}
                      <h2 className="text-lg font-semibold text-gray-900">
                        {title}
                      </h2>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>

                  {/* CONTENT */}
                  {isExpanded && (
                    <div className="px-6 pb-6">
                      <PortableTextRenderer
                        blocks={content as PrivacyPolicyBlock[]}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Invalid privacy policy format.</p>
    </div>
  );
}