'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useFaq } from '@/contexts/HomeContext';
import type { LangKey } from '@/types';

const Faq = () => {
  const pathname = usePathname();
  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : 'en';
  const { data, loading } = useFaq();

  const [openId, setOpenId] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  if (loading) {
    return (
      <section className="py-24 px-6 md:px-10 bg-gray-50 overflow-hidden relative">
        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative z-10">
              <div className="mb-6 inline-flex">
                <div className="p-[2px] rounded-full bg-gradient-to-r from-gray-300 to-gray-300">
                  <div className="bg-white rounded-full px-5 py-1">
                    <div className="h-4 w-16 bg-gray-300 animate-pulse rounded"></div>
                  </div>
                </div>
              </div>
              <div className="h-12 w-full max-w-lg bg-gray-300 animate-pulse rounded mb-6"></div>
              <div className="h-20 w-full max-w-lg bg-gray-300 animate-pulse rounded mb-10"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 w-full bg-gray-300 animate-pulse rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data || !data.faq_content) {
    return null;
  }

  const content = data.faq_content;
  const badgeText = currentLang === 'en' ? content.badge_text_en : content.badge_text_id;
  const title = currentLang === 'en' ? content.title_en : content.title_id;
  const description = currentLang === 'en' ? content.description_en : content.description_id;
  const sideImage = content.side_image?.asset?.url || '';

  return (
    <section className="py-24 px-6 md:px-10 bg-gray-50 overflow-hidden relative">
      {/* Konten Utama Container */}
      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Kolom Kiri: Teks & Accordion */}
          <div className="relative z-10">
            {/* 1. Badge FAQs */}
            <div className="mb-6 inline-flex">
              <div className="p-[2px] rounded-full bg-gradient-to-r from-[#061551] to-[#10b981]">
                <div className="bg-white rounded-full px-5 py-1 flex items-center justify-center">
                  <span className="text-sm md:text-base text-[#061551]">{badgeText}</span>
                </div>
              </div>
            </div>

            {/* 2. Judul & Deskripsi */}
            <h2 className="text-4xl md:text-5xl font-bold text-[#061551] mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-gray-600 mb-10 text-lg max-w-lg">
              {description}
            </p>

            {/* 3. Accordion List */}
            <div className="space-y-4">
              {content.faq_items.map((item, index) => {
                const question = currentLang === 'en' ? item.question_en : item.question_id;
                const answer = currentLang === 'en' ? item.answer_en : item.answer_id;
                
                return (
                  <div
                    key={index}
                    className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                      openId === index
                        ? 'border-[#061551] bg-white shadow-xl scale-[1.02]'
                        : 'border-gray-200 bg-white/60 hover:bg-white'
                    }`}
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-6 py-5 text-left flex justify-between items-center transition"
                    >
                      <span
                        className={`font-bold transition-colors ${
                          openId === index ? 'text-[#061551]' : 'text-gray-800'
                        }`}
                      >
                        {question}
                      </span>

                      <span
                        className={`text-2xl font-bold transition-all duration-300 ${
                          openId === index ? 'text-[#061551]' : 'text-gray-400'
                        }`}
                      >
                        {openId === index ? '–' : '+'}
                      </span>
                    </button>

                    <div
                      className={`px-6 transition-all duration-300 ease-in-out ${
                        openId === index ? 'max-h-60 pb-6 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-gray-600 leading-relaxed border-t pt-4">
                        {answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gambar di sebelah kanan - hanya tampil jika ada gambar */}
          {sideImage && (
            <div className="absolute -right-20 lg:-right-18 top-1/2 -translate-y-1/2 w-[50%] max-w-xl hidden lg:block pointer-events-none z-0">
              <img
                src={sideImage}
                alt="Mobile App Screens"
                className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] transition-transform duration-700 hover:scale-105"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Faq;