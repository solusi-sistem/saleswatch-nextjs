'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getSectionData } from '@/hooks/getSectionData';
import { Section } from '@/types/section';
import { BlogItem } from '@/types/list/Blog';
import { usePathname } from 'next/navigation';
import LoadingSpinner from '@/components/loading/LoadingSpinner';

const CACHE_KEY = 'blog_section_cache';
const CACHE_DURATION = 5 * 60 * 1000;

interface CachedData {
  data: Section;
  timestamp: number;
}

interface BlogProps {
    id?: string;
}

type BlogLocale = 'en' | 'id';

export default function Blog({ id }: BlogProps) {
    const pathname = usePathname();
    const locale: BlogLocale = pathname.startsWith('/id') ? 'id' : 'en';

    const [sectionData, setSectionData] = useState<Section | null>(null);
    const [loading, setLoading] = useState(true);

    const headerRef = useRef<HTMLDivElement>(null);
    const card1Ref = useRef<HTMLElement>(null);
    const card2Ref = useRef<HTMLElement>(null);
    const card3Ref = useRef<HTMLElement>(null);

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
        const fetchSectionData = async () => {
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
        };

        fetchSectionData();
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

    useEffect(() => {
        if (loading || !sectionData?.blog_content) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        if (headerRef.current) observer.observe(headerRef.current);
        if (card1Ref.current) observer.observe(card1Ref.current);
        if (card2Ref.current) observer.observe(card2Ref.current);
        if (card3Ref.current) observer.observe(card3Ref.current);

        return () => {
            observer.disconnect();
        };
    }, [loading, sectionData]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!sectionData?.blog_content) {
        return null;
    }

    const { blog_content } = sectionData;

    if (!blog_content.list_blog || !Array.isArray(blog_content.list_blog)) {
        return null;
    }

    const publishedBlogs = blog_content.list_blog.filter(
        (blog: BlogItem) => blog.status === 'published'
    );

    const latestBlogs = publishedBlogs.slice(0, 3);
    const cardRefs = [card1Ref, card2Ref, card3Ref];

    if (latestBlogs.length === 0) {
        return null;
    }

    const title = locale === 'id'
        ? blog_content.title_id || 'Baca Cerita Terbaru'
        : blog_content.title_en || 'Read Latest Story';

    return (
        <section id={id} className="bg-white py-16 md:py-20">
            <div className="container mx-auto px-6 sm:px-6 lg:px-12 xl:px-24">
                <div
                    ref={headerRef}
                    className="mb-12 flex flex-col items-center text-center gap-4 opacity-0"
                    style={{ animationDelay: '0s', animationFillMode: 'both' }}
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {latestBlogs.map((blog: BlogItem, index: number) => {
                        const blogSlug = blog.slug?.current || '';
                        
                        const blogTitle = blog.title 
                            ? (locale === 'id' ? (blog.title.id || blog.title.en) : (blog.title.en || blog.title.id)) || 'Untitled'
                            : 'Untitled';
                        const blogCategory = blog.category?.name
                            ? (locale === 'id' ? (blog.category.name.id || blog.category.name.en) : (blog.category.name.en || blog.category.name.id)) || 'Uncategorized'
                            : 'Uncategorized';
                        
                        const imageUrl = blog.image?.asset?.url || '/placeholder.jpg';
                        
                        const imageAlt = blog.image?.alt 
                            ? (locale === 'id' ? (blog.image.alt.id || blog.image.alt.en) : (blog.image.alt.en || blog.image.alt.id)) || blogTitle
                            : blogTitle;
                        
                        const author = blog.author || 'Unknown';

                        if (!blogSlug) {
                            return null;
                        }

                        return (
                            <article
                                key={`blog-${blogSlug}-${index}`}
                                ref={cardRefs[index]}
                                className="
                                group w-full overflow-hidden rounded-2xl border border-gray-200 bg-white
                                shadow-lg shadow-md sm:shadow-sm transition hover:shadow-xl opacity-0"
                                style={{
                                    animationDelay: `${0.1 + (index * 0.15)}s`,
                                    animationFillMode: 'both'
                                }}
                            >
                                <Link
                                    href={`/blog/${blogSlug}`}
                                    className="relative block aspect-[4/3] overflow-hidden"
                                    onClick={() => {
                                        window.scrollTo({ top: 0, behavior: 'instant' });
                                    }}
                                >
                                    <Image
                                        src={imageUrl}
                                        alt={imageAlt}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />

                                    <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white transition group-hover:bg-[#061551]">
                                        {blogCategory}
                                    </span>
                                </Link>

                                <div className="p-5 sm:p-6">
                                    <div className="mb-3 flex items-center gap-4 text-xs text-gray-600">
                                        <span className="hover:text-[#061551] transition">
                                            {author}
                                        </span>
                                        {blog.date && (
                                            <span className="hover:text-[#061551] transition">
                                                {new Date(blog.date).toLocaleDateString(
                                                    locale === 'id' ? 'id-ID' : 'en-US',
                                                    {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    }
                                                )}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="mb-4 text-lg font-semibold text-gray-900 leading-snug transition group-hover:text-[#061551]">
                                        <Link 
                                            href={`/blog/${blogSlug}`}
                                            onClick={() => {
                                                window.scrollTo({ top: 0, behavior: 'instant' });
                                            }}
                                        >
                                            {blogTitle}
                                        </Link>
                                    </h3>

                                    <Link
                                        href={`/blog/${blogSlug}`}
                                        className="inline-flex items-center gap-2 text-sm font-medium text-black underline underline-offset-4 decoration-black transition hover:text-[#061551] hover:decoration-[#061551]"
                                        onClick={() => {
                                            window.scrollTo({ top: 0, behavior: 'instant' });
                                        }}
                                    >
                                        {locale === 'id' ? 'Pelajari Lebih Lanjut' : 'Learn More'}
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}