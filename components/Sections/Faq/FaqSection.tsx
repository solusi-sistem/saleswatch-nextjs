"use client";

import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import type { LangKey } from '@/types';
import { SectionProps, FaqSectionContent } from '@/types/section';
import { getSectionData } from '@/hooks/getSectionData';
import { PortableText } from "next-sanity";
import { portableTextComponents } from "@/lib/PortableText";
import LoadingSpinner from '@/components/loading/LoadingSpinner';

const CACHE_KEY = 'faq_section_cache';
const CACHE_DURATION = 5 * 60 * 1000;

interface CachedData {
  data: FaqSectionContent;
  timestamp: number;
}

export default function FaqSection({ id }: SectionProps) {
    const pathname = usePathname();
    const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : '';

    const [content, setContent] = useState<FaqSectionContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>("");
    const [openFAQs, setOpenFAQs] = useState<Record<string, boolean>>({});

    const getCachedData = (): FaqSectionContent | null => {
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

    const setCachedData = (data: FaqSectionContent) => {
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
        async function fetchContent() {
            if (!id) return;

            const cachedContent = getCachedData();
            if (cachedContent) {
                setContent(cachedContent);
                setLoading(false);
                if (cachedContent.category_tabs && cachedContent.category_tabs.length > 0) {
                    setActiveTab(cachedContent.category_tabs[0].category_key);
                }
            }

            try {
                const sectionData = await getSectionData(id);
                if (sectionData?.faq_section_content) {
                    setContent(sectionData.faq_section_content);
                    setCachedData(sectionData.faq_section_content);
                    if (sectionData.faq_section_content.category_tabs &&
                        sectionData.faq_section_content.category_tabs.length > 0) {
                        setActiveTab(sectionData.faq_section_content.category_tabs[0].category_key);
                    }
                }
            } catch (error) {
                if (!content && cachedContent) {
                    setContent(cachedContent);
                    if (cachedContent.category_tabs && cachedContent.category_tabs.length > 0) {
                        setActiveTab(cachedContent.category_tabs[0].category_key);
                    }
                }
            } finally {
                setLoading(false);
            }
        }
        fetchContent();
    }, [id]);

    useEffect(() => {
        if (!id) return;

        const interval = setInterval(async () => {
            try {
                const sectionData = await getSectionData(id);
                if (sectionData?.faq_section_content) {
                    const currentDataString = JSON.stringify(content);
                    const newDataString = JSON.stringify(sectionData.faq_section_content);
                    
                    if (currentDataString !== newDataString) {
                        setContent(sectionData.faq_section_content);
                        setCachedData(sectionData.faq_section_content);
                    }
                }
            } catch (error) {
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [id, content]);

    const toggleFAQ = (id: string) => {
        setOpenFAQs((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!content?.category_tabs || content.category_tabs.length === 0) {
        return null;
    }

    const currentTab = content.category_tabs.find(tab => tab.category_key === activeTab);
    const currentFAQs = currentTab?.list_faqs || [];

    return (
        <main className="bg-[#f2f7ff]">
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 pt-30 pb-16">
                {/* Title */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#061551] leading-tight animate__animated animate__fadeInUp">
                        {currentLang === 'id' ? content.title_id : content.title_en}
                    </h1>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto animate__animated animate__fadeInUp">
                        {currentLang === 'id'
                            ? content.description_id
                            : content.description_en}
                    </p>
                </div>

                {/* Tabs */}
                <div className="max-w-4xl mx-auto mb-10 border-b border-gray-200">
                    <div className="flex gap-6 overflow-x-auto justify-start sm:justify-center pb-2">
                        {content.category_tabs.map((tab, index) => {
                            const label = currentLang === 'id' ? tab.category_label.id : tab.category_label.en;
                            return (
                                <button
                                    key={tab.category_key}
                                    onClick={() => setActiveTab(tab.category_key)}
                                    className={`whitespace-nowrap pb-3 text-sm sm:text-base font-medium transition animate__animated animate__fadeInUp ${activeTab === tab.category_key
                                        ? "border-b-2 border-[#061551] text-[#061551]"
                                        : "text-gray-500 hover:text-[#061551]"
                                        }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* FAQ List */}
                <div className="max-w-4xl mx-auto space-y-4">
                    {currentFAQs.map((faq, index) => {
                        const question = currentLang === 'id' ? faq.question.id : faq.question.en;
                        const answer = currentLang === 'id' ? faq.answer.id : faq.answer.en;

                        return (
                            <div
                                key={index}
                                className={`border border-gray-200 rounded-xl bg-white shadow-sm animate__animated animate__fadeInUp`}
                            >
                                <button
                                    className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                                    onClick={() => toggleFAQ(index.toString())}
                                    aria-expanded={openFAQs[index]}
                                >
                                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                                        {question}
                                    </h3>
                                    <span className="text-[#061551] text-xl font-semibold">
                                        {openFAQs[index] ? "−" : "+"}
                                    </span>
                                </button>

                                {openFAQs[index] && (
                                    <div className="px-5 pb-5 text-gray-600 text-sm sm:text-base border-t border-gray-100">
                                        <div
                                            className="pt-4 whitespace-pre-wrap"
                                        >
                                            <PortableText
                                                value={answer}
                                                components={portableTextComponents}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Support CTA */}
                {content.footer_note && (
                    <div className="mt-16 text-center text-gray-600 text-sm sm:text-base animate__animated animate__fadeInUp">
                        <PortableText
                            value={currentLang === 'id' ? content.footer_note.id : content.footer_note.en}
                            components={portableTextComponents}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}