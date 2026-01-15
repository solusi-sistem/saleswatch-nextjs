'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { LangKey } from '@/types';
import { SectionProps, TestimonialContent } from '@/types/section';
import { getSectionData } from '@/hooks/getSectionData';
import LoadingSpinner from '@/components/loading/LoadingSpinner';

const CACHE_KEY = 'testimonial_cache';
const CACHE_DURATION = 5 * 60 * 1000;

interface CachedData {
  data: TestimonialContent;
  timestamp: number;
}

export default function Testimonial({ id }: SectionProps) {
    const pathname = usePathname();
    const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : '';

    const [content, setContent] = useState<TestimonialContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const leftSideRef = useRef<HTMLDivElement>(null);
    const rightSideRef = useRef<HTMLDivElement>(null);

    const getCachedData = (): TestimonialContent | null => {
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

    const setCachedData = (data: TestimonialContent) => {
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
                if (sectionData?.testimonial_content) {
                    setContent(sectionData.testimonial_content);
                    setCachedData(sectionData.testimonial_content);
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
                if (sectionData?.testimonial_content) {
                    const currentDataString = JSON.stringify(content);
                    const newDataString = JSON.stringify(sectionData.testimonial_content);
                    
                    if (currentDataString !== newDataString) {
                        setContent(sectionData.testimonial_content);
                        setCachedData(sectionData.testimonial_content);
                    }
                }
            } catch (error) {
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [id, content]);

    const testimonials = content?.testimonials || [];

    useEffect(() => {
        if (testimonials.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [testimonials.length]);

    useEffect(() => {
        if (loading) return;

        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px',
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        if (leftSideRef.current) observer.observe(leftSideRef.current);
        if (rightSideRef.current) observer.observe(rightSideRef.current);

        return () => {
            observer.disconnect();
        };
    }, [loading, currentIndex]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!content || testimonials.length === 0) {
        return null;
    }

    return (
        <section className="relative w-full bg-[#2D2D2F] py-16 md:py-24 overflow-hidden">
            <div className="mx-auto max-w-4xl min-[1272px]:max-w-6xl px-6">
                <div className="relative overflow-hidden">
                    <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {testimonials.map((item, index) => {
                            const title = currentLang === 'id' ? item.title_id : item.title_en;
                            const quote = currentLang === 'id' ? item.quote_id : item.quote_en;
                            const company = currentLang === 'id' ? item.company_id : item.company_en;
                            const role = currentLang === 'id' ? item.client_role_id : item.client_role_en;
                            const logoUrl = item.company_logo?.asset?.url || '/assets/images/logo1.webp';

                            return (
                                <div key={index} className="w-full flex-shrink-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center text-center md:text-left">
                                        <div
                                            ref={index === currentIndex ? leftSideRef : null}
                                            className="text-white flex flex-col items-center md:items-start opacity-0"
                                            style={{
                                                animationDelay: '0s',
                                                animationFillMode: 'both',
                                            }}
                                        >
                                            <p className="text-sm md:text-xl text-white/70 mb-6 max-w-md">{title}</p>

                                            <div className="flex flex-col gap-3">
                                                <div className="w-20 h-20 overflow-hidden transition-transform duration-500 hover:scale-110 self-center md:self-start md:-ml-1">
                                                    <img src={logoUrl} alt={company} className="w-full h-full object-contain" />
                                                </div>

                                                <p className="font-semibold text-center md:text-left">{company}</p>
                                            </div>
                                        </div>

                                        <div
                                            ref={index === currentIndex ? rightSideRef : null}
                                            className="text-white opacity-0"
                                            style={{
                                                animationDelay: '0.2s',
                                                animationFillMode: 'both',
                                            }}
                                        >
                                            <blockquote className="text-lg md:text-base leading-relaxed">{quote}</blockquote>

                                            <div className="mt-6">
                                                <p className="font-semibold">{item.client_name}</p>
                                                <p className="text-sm text-white/60">{role}</p>
                                                <div className="mt-3 h-1 w-10 bg-white/60 rounded-full mx-auto md:mx-0" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {testimonials.length > 1 && (
                    <>
                        <button onClick={prevSlide} className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white/60 hover:text-white hover:scale-110 transition-all duration-300 hidden lg:block" aria-label="Previous testimonial">
                            <ChevronLeft className="w-8 h-8" strokeWidth={1.5} />
                        </button>

                        <button onClick={nextSlide} className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white/60 hover:text-white hover:scale-110 transition-all duration-300 hidden lg:block" aria-label="Next testimonial">
                            <ChevronRight className="w-8 h-8" strokeWidth={1.5} />
                        </button>
                    </>
                )}
            </div>
        </section>
    );
}