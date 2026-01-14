'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import type { LangKey } from '@/types';
import { SectionProps, FaqContent } from '@/types/section';
import { getSectionData } from '@/hooks/getSectionData';

const Faq = ({ id }: SectionProps) => {
  const pathname = usePathname();
  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : '';

  const [content, setContent] = useState<FaqContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Fetch data dari Sanity
  useEffect(() => {
    async function fetchContent() {
      if (!id) return;

      try {
        setLoading(true);
        const sectionData = await getSectionData(id);
        if (sectionData?.faq_content) {
          setContent(sectionData.faq_content);
        }
      } catch (error) {
        console.error('Error fetching faq content:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [id]);

  useEffect(() => {
    if (loading) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;

          if (target === badgeRef.current) {
            target.classList.add('animate__animated', 'animate__fadeInDown');
          } else if (target === titleRef.current) {
            target.classList.add('animate__animated', 'animate__fadeInDown');
          } else if (target === descriptionRef.current) {
            target.classList.add('animate__animated', 'animate__fadeIn');
          } else if (target === accordionRef.current) {
            target.classList.add('animate__animated', 'animate__fadeInUp');
          } else if (target === imageRef.current) {
            target.classList.add('animate__animated', 'animate__fadeInRight');
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (badgeRef.current) observer.observe(badgeRef.current);
    if (titleRef.current) observer.observe(titleRef.current);
    if (descriptionRef.current) observer.observe(descriptionRef.current);
    if (accordionRef.current) observer.observe(accordionRef.current);
    if (imageRef.current) observer.observe(imageRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loading]);

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
                <div className="p-[2px] rounded-full bg-gradient-to-r from-gray-300 to-gray-300"></div>
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

  if (!content) {
    return null;
  }

  const title = currentLang === 'id' ? content.title_id : content.title_en;
  const description = currentLang === 'id' ? content.description_id : content.description_en;
  const sideImage = content.side_image?.asset?.url || '';
  const faqItems = content.faq_items || [];

  return (
    <section className="py-24 px-6 md:px-10 bg-gray-50 overflow-hidden relative">
      {/* Konten Utama Container */}
      <div id="about" className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="relative z-10">
            <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-[#061551] mb-6 leading-tight opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              {title}
            </h2>

            {description && (
              <p ref={descriptionRef} className="text-gray-600 mb-10 text-md max-w-lg opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                {description}
              </p>
            )}

            <div ref={accordionRef} className="space-y-4 opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              {faqItems.map((item, index) => {
                const question = currentLang === 'id' ? item.question_id : item.question_en;
                const answer = currentLang === 'id' ? item.answer_id : item.answer_en;

                return (
                  <div key={index} className={`border rounded-xl overflow-hidden transition-all duration-300 ${openId === index ? 'border-[#061551] bg-white shadow-xl scale-[1.02]' : 'border-gray-200 bg-white/60 hover:bg-white'}`}>
                    <button onClick={() => toggleItem(index)} className="w-full px-6 py-5 text-left flex justify-between items-center transition">
                      <span className={`font-bold transition-colors ${openId === index ? 'text-[#061551]' : 'text-gray-800'}`}>{question}</span>

                      <span className={`text-2xl font-bold transition-all duration-300 ${openId === index ? 'text-[#061551] rotate-180' : 'text-gray-400 rotate-0'}`}>{openId === index ? '−' : '+'}</span>
                    </button>

                    <div className={`px-6 transition-all duration-300 ease-in-out ${openId === index ? 'max-h-60 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-gray-600 leading-relaxed border-t pt-4">{answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {sideImage && (
            <div ref={imageRef} className="absolute -right-20 lg:-right-18 top-1/2 -translate-y-1/2 w-[50%] max-w-xl hidden lg:block pointer-events-none z-0 opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <img src={sideImage} alt="Mobile App Screens" className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] transition-transform duration-700 hover:scale-105" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Faq;
