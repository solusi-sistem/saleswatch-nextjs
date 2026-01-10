'use client';

import { getSectionData } from "@/hooks/getSectionData";
import { Section, SectionProps } from "@/types/section";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function HeroUmum({ id }: SectionProps) {
    const pathname = usePathname();
    const lang = pathname.startsWith('/id') ? 'id' : 'en';

    const [section, setSection] = useState<Section | null>(null);

    /* =========================================
    FETCH SANITY DATA
    ========================================= */

    useEffect(() => {
        async function fetchData() {
            if (!id) return;
            const res = await getSectionData(id);
            setSection(res);
        }
        fetchData();
    }, [id]);

    const header = section?.hero_umum_content;

    return (
        <header className="relative w-full bg-[#061551] pt-12 pb-16 px-6 md:px-14 lg:px-18">
            <div className="relative w-full bg-[#f2f7ff] rounded-4xl pt-30 pb-10 flex items-center justify-center">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate__animated animate__fadeInUp">
                        {lang === 'id' ? header?.title_id : header?.title_en}
                    </h1>
                    <div className="w-24 h-1 bg-blue-200 mx-auto rounded-full mb-4 animate__animated animate__fadeInUp"></div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto animate__animated animate__fadeInUp">
                        {lang === 'id'
                            ? header?.description_id
                            : header?.description_en}
                    </p>
                </div>
            </div>
        </header>
    );
}
