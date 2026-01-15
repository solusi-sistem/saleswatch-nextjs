'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import CustomButton from '@/components/button/button';
import type { LangKey } from '@/types';
import { SectionProps, WhyItWorksContent } from '@/types/section';
import { getSectionData } from '@/hooks/getSectionData';
import LoadingSpinner from '@/components/loading/LoadingSpinner';

const CACHE_KEY = 'why_it_works_cache';
const CACHE_DURATION = 5 * 60 * 1000;

interface CachedData {
  data: WhyItWorksContent;
  timestamp: number;
}

export default function WhyItWorks({ id }: SectionProps) {
    const pathname = usePathname();
    const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : '';

    const [content, setContent] = useState<WhyItWorksContent | null>(null);
    const [loading, setLoading] = useState(true);

    const titleRef = useRef<HTMLHeadingElement>(null);
    const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

    const getCachedData = (): WhyItWorksContent | null => {
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

    const setCachedData = (data: WhyItWorksContent) => {
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
            }

            try {
                const sectionData = await getSectionData(id);
                if (sectionData?.why_it_works) {
                    setContent(sectionData.why_it_works);
                    setCachedData(sectionData.why_it_works);
                }
            } catch (error) {
                if (!content && cachedContent) {
                    setContent(cachedContent);
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
                if (sectionData?.why_it_works) {
                    const currentDataString = JSON.stringify(content);
                    const newDataString = JSON.stringify(sectionData.why_it_works);
                    
                    if (currentDataString !== newDataString) {
                        setContent(sectionData.why_it_works);
                        setCachedData(sectionData.why_it_works);
                    }
                }
            } catch (error) {
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [id, content]);

    useEffect(() => {
        if (loading) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        if (titleRef.current) observer.observe(titleRef.current);
        featureRefs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => {
            observer.disconnect();
        };
    }, [loading]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!content) {
        return null;
    }

    const sectionTitle = currentLang === 'id' ? content.section_title_id : content.section_title_en;
    const features = content.features || [];

    return (
        <section className="bg-[#f2f7ff] py-16 md:py-24 px-6">
            <div className="max-w-6xl mx-auto space-y-24">
                <h2
                    ref={titleRef}
                    className="text-center text-4xl sm:text-5xl md:text-6xl font-bold text-[#2f2e2e] opacity-0"
                >
                    {sectionTitle}
                </h2>

                {features.map((feature, index) => {
                    const title = currentLang === 'id' ? feature.title_id : feature.title_en;
                    const description = currentLang === 'id' ? feature.description_id : feature.description_en;
                    const buttonText = feature.cta_button
                        ? (currentLang === 'id' ? feature.cta_button.text_id : feature.cta_button.text_en)
                        : '';
                    const imageUrl = feature.image?.asset?.url || '/img/placeholder.avif';
                    const isImageLeft = feature.image_position === 'left';

                    return (
                        <div
                            key={index}
                            ref={(el) => { featureRefs.current[index] = el; }}
                            className="grid md:grid-cols-2 gap-10 items-center opacity-0"
                        >
                            {/* Image */}
                            <div
                                className={`flex justify-center ${isImageLeft
                                    ? 'md:justify-center'
                                    : 'md:justify-center md:mr-30 md:order-2'
                                    } -mt-14 md:mt-0 ${!isImageLeft ? 'mr-0 md:mr-10' : ''}`}
                            >
                                <div className="w-[300px] sm:w-[400px] md:w-[500px] aspect-video rounded-xl overflow-hidden flex items-center justify-center">
                                    <Image
                                        src={imageUrl}
                                        alt={title}
                                        width={340}
                                        height={340}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className={`text-left max-w-[450px] mx-auto md:mx-0 ${!isImageLeft ? 'md:justify-self-end pe-0 md:pe-10' : ''
                                }`}>
                                <h3 className="text-3xl md:text-4xl font-bold text-[#2f2e2e] mb-6">
                                    {title}
                                </h3>
                                <p className="text-[#5B5B5C] leading-relaxed mb-6">
                                    {description}
                                </p>

                                {/* Checklist */}
                                {feature.checklist_items && feature.checklist_items.length > 0 && (
                                    <div className="space-y-3 mb-8">
                                        {feature.checklist_items.map((item, itemIndex) => {
                                            const checklistText = currentLang === 'id' ? item.text_id : item.text_en;
                                            return (
                                                <div key={itemIndex} className="flex items-start gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-[#4A6FA5] flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-[#5B5B5C] text-sm md:text-base">
                                                        {checklistText}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* CTA Button */}
                                {feature.cta_button && buttonText && (
                                    <div className="flex justify-center md:justify-start">
                                        <Link href={feature.cta_button.link || '#'}>
                                            <CustomButton size="lg" className="mt-3">
                                                {buttonText}
                                            </CustomButton>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}