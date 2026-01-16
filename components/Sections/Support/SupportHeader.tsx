'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
    Download,
    Youtube,
    BookOpen,
    PlayCircle,
    ExternalLink,
} from 'lucide-react';

import { getSectionData } from '@/hooks/getSectionData';
import type { Section, SectionProps, SupportHeaderContent } from '@/types/section';
import LoadingSpinner from '@/components/loading/LoadingSpinner';

const CACHE_KEY = 'support_header_cache';
const CACHE_DURATION = 5 * 60 * 1000;

interface CachedData {
    data: SupportHeaderContent;
    timestamp: number;
}

function getIcon(iconType?: string) {
    switch (iconType) {
        case 'download':
            return <Download className="w-5 h-5 shrink-0" />;
        case 'youtube':
            return <Youtube className="w-5 h-5 shrink-0" />;
        case 'book':
            return <BookOpen className="w-5 h-5 shrink-0" />;
        case 'play':
            return <PlayCircle className="w-5 h-5 shrink-0" />;
        case 'external':
            return <ExternalLink className="w-5 h-5 shrink-0" />;
        default:
            return <ExternalLink className="w-5 h-5 shrink-0" />;
    }
}

export default function SupportHeader({ id }: SectionProps) {
    const pathname = usePathname();
    const lang = pathname.startsWith('/id') ? 'id' : 'en';

    const [section, setSection] = useState<Section | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoadingFromAPI, setIsLoadingFromAPI] = useState(false);

    const getCachedData = (): SupportHeaderContent | null => {
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

    const setCachedData = (data: SupportHeaderContent) => {
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
                setSection({
                    _id: id,
                    _type: 'section',
                    type_section: 'support_header',
                    support_header_content: cachedContent
                });
                setLoading(false);
            } else {
                setIsLoadingFromAPI(true);
            }

            try {
                const res = await getSectionData(id);
                if (res?.support_header_content) {
                    setSection(res);
                    setCachedData(res.support_header_content);
                }
            } catch (error) {
                if (!section && cachedContent) {
                    setSection({
                        _id: id,
                        _type: 'section',
                        type_section: 'support_header',
                        support_header_content: cachedContent
                    });
                }
            } finally {
                setLoading(false);
                setIsLoadingFromAPI(false);
            }
        }
        fetchData();
    }, [id]);

    useEffect(() => {
        if (!id) return;

        const interval = setInterval(async () => {
            try {
                const res = await getSectionData(id);
                if (res?.support_header_content) {
                    const currentDataString = JSON.stringify(section?.support_header_content);
                    const newDataString = JSON.stringify(res.support_header_content);

                    if (currentDataString !== newDataString) {
                        setSection(res);
                        setCachedData(res.support_header_content);
                    }
                }
            } catch (error) {
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [id, section]);

    if (loading) {
        return <LoadingSpinner />;
    }

    const header = section?.support_header_content;

    /* =========================================
       NO DATA STATE
    ========================================= */
    if (!header) {
        return (
            <header className="relative w-full bg-[#061551] pt-12 pb-16 px-6 md:px-14 lg:px-18">
                <div className="relative w-full bg-[#f2f7ff] rounded-4xl pt-30 pb-10 flex items-center justify-center">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {lang === 'id' ? 'Pusat Bantuan' : 'Support Center'}
                        </h1>
                        <div className="w-24 h-1 bg-blue-200 mx-auto rounded-full mb-4"></div>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            {lang === 'id'
                                ? 'Temukan bantuan yang Anda butuhkan'
                                : 'Find the help you need'}
                        </p>
                    </div>
                </div>
            </header>
        );
    }

    /* =========================================
       HANDLER BUTTON CLICK
    ========================================= */
    const handleClick = (btn: any) => {
        let url = btn.link_url;

        if (btn.button_type === 'pdf_download') {
            url =
                lang === 'id'
                    ? btn.file_pdf?.file_pdf_id?.asset?.url
                    : btn.file_pdf?.file_pdf_en?.asset?.url;
        }

        if (!url) {
            return;
        }

        window.open(url, btn.open_in_new_tab ? '_blank' : '_self');
    };

    /* =========================================
       RENDER
    ========================================= */
    return (
        <header className="relative w-full bg-[#061551] pt-12 pb-16 px-6 md:px-14 lg:px-18">
            <div className="relative w-full bg-[#f2f7ff] rounded-4xl pt-30 pb-10 flex items-center justify-center">
                <div className="text-center mb-12 px-4 md:px-8">

                    {/* TITLE */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate__animated animate__fadeInUp">
                        {lang === 'id' ? header.title?.id : header.title?.en}
                    </h1>

                    <div className="w-24 h-1 bg-blue-200 mx-auto rounded-full mb-4 animate__animated animate__fadeInUp" />

                    {/* DESCRIPTION */}
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8 animate__animated animate__fadeInUp">
                        {lang === 'id'
                            ? header.description?.id
                            : header.description?.en}
                    </p>

                    {/* BUTTONS */}
                    {header.buttons && header.buttons.length > 0 && (
                        <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch mx-auto">
                            {header.buttons.map((btn, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleClick(btn)}
                                    className="flex items-center gap-3 bg-[#061551]/5 hover:bg-[#061551]/8 text-gray-800 font-medium 
                    px-4 py-3 rounded-lg transition-colors duration-200
                    w-full sm:w-auto sm:max-w-md animate__animated animate__fadeInUp"
                                >
                                    {getIcon(btn.icon_type)}

                                    <span className="text-xs leading-snug text-center sm:text-left">
                                        {lang === 'id'
                                            ? btn.button_text.id
                                            : btn.button_text.en}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </header>
    );
}