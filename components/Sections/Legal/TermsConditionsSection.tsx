'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

import { getSectionData } from '@/hooks/getSectionData';
import type { Section, SectionProps, PrivacyPolicyItem } from '@/types/section';
import type { LangKey } from '@/types';
import type { TermsConditionsBlock } from '@/types/termsConditions';

/* ===============================
   Portable Text Renderer
================================ */
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
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              );
            }

            return <span key={i}>{content}</span>;
          });

          switch (style) {
            case 'h2':
              return <h2 key={index} className="text-2xl font-bold mt-6">{children}</h2>;
            case 'h3':
              return <h3 key={index} className="text-xl font-semibold mt-4">{children}</h3>;
            case 'h4':
              return <h4 key={index} className="text-lg font-semibold mt-3">{children}</h4>;
            case 'blockquote':
              return (
                <blockquote key={index} className="border-l-4 pl-4 italic text-gray-600">
                  {children}
                </blockquote>
              );
            default:
              return <p key={index} className="text-gray-700">{children}</p>;
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

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      setLoading(true);
      try {
        const data = await getSectionData(id);
        setSectionData(data);
      } catch (err) {
        console.error('Error fetching terms and conditions:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const toggle = (itemId: string) => {
    const s = new Set(expanded);
    s.has(itemId) ? s.delete(itemId) : s.add(itemId);
    setExpanded(s);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Loading terms and conditions…</p>
      </div>
    );
  }

  const items: PrivacyPolicyItem[] =
    sectionData?.terms_and_conditions_section_content?.terms_and_conditions ?? [];

  const publishedItems = items.filter((item) => item.published_at);

  if (!publishedItems.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">No terms and conditions available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" id={id}>
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-4">
        {publishedItems.map((item) => {
          const isOpen = expanded.has(item._id);
          const title = currentLang === 'id' ? item.title.id : item.title.en;
          const content =
            currentLang === 'id' ? item.content_id : item.content_en;

          return (
            <div key={item._id} className="bg-white rounded-xl shadow border">
              <button
                onClick={() => toggle(item._id)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <div className="flex items-center gap-4">
                  {item.icon_type?.asset?.url && (
                    <Image
                      src={item.icon_type.asset.url}
                      alt={title}
                      width={40}
                      height={40}
                    />
                  )}
                  <h2 className="text-lg font-semibold">{title}</h2>
                </div>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
              </button>

              {isOpen && content && (
                <div className="px-6 pb-6">
                  <PortableTextRenderer blocks={content} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
