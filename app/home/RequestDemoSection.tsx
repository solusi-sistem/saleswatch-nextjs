'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import CustomButton from '@/components/button/button';
import ScheduleDemoModal from '@/components/modals/ScheduleDemoModal';
import { useRequestDemo } from '@/contexts/HomeContext'; 
import type { LangKey } from '@/types';

export default function RequestDemoSection() {
  const pathname = usePathname();
  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : 'en';
  const { data, loading } = useRequestDemo();

  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 -z-20 bg-gray-200 animate-pulse" />
        <section ref={sectionRef} className="relative w-full overflow-hidden py-16 md:py-24">
          <div className="relative z-10 flex justify-center px-4">
            <div className="w-full max-w-4xl text-center md:text-left space-y-4">
              <div className="h-8 w-48 bg-white/50 animate-pulse rounded mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 w-full bg-white/50 animate-pulse rounded"></div>
                ))}
              </div>
              <div className="h-12 w-40 bg-white/50 animate-pulse rounded mt-8"></div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!data || !data.request_demo_content) {
    return null;
  }

  const content = data.request_demo_content;
  const badgeText = currentLang === 'en' ? content.badge_text_en : content.badge_text_id;
  const buttonText = currentLang === 'en' ? content.cta_button.text_en : content.cta_button.text_id;

  const backgroundImage = content.background_image?.asset?.url || '';
  return (
    <>
      <div
        className={`fixed inset-0 -z-20 bg-cover bg-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{
          backgroundImage: `linear-gradient(rgba(6, 21, 81, 0.5), rgba(6, 21, 81, 0.5)), url('${backgroundImage}')`,
        }}
      />
      <section ref={sectionRef} className="relative w-full overflow-hidden py-16 md:py-24">
        <div className="relative z-10 flex justify-center px-4 text-[#DFE1E4]">
          <div className="w-full max-w-4xl text-center md:text-left">
            <h2 className="mb-4 text-lg sm:text-xl md:text-3xl font-semibold text-[#061551] flex items-center gap-3 ms-3 md:ms-0">
              <svg viewBox="0 0 60 60" className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 1.9C14.5 1.9 1.9 14.5 1.9 30c0 15.5 12.6 28.1 28.1 28.1S58.1 45.5 58.1 30C58.1 14.5 45.5 1.9 30 1.9zm0 44c-8.8 0-15.9-7.1-15.9-15.9S21.2 14.1 30 14.1 45.9 21.2 45.9 30 38.8 45.9 30 45.9z" />
              </svg>

              <span>{badgeText}</span>
            </h2>

            <div className="space-y-1 sm:space-y-2">
              {content.title_lines.map((line, index) => (
                <p key={index} className="text-xl sm:text-2xl md:text-[50px] font-bold leading-tight">
                  {currentLang === 'en' ? line.text_en : line.text_id}
                </p>
              ))}
            </div>

            <div className="mt-8 flex justify-center md:justify-center">
              <CustomButton size="lg" className="mt-3" onClick={() => setIsModalOpen(true)}>
                {buttonText}
              </CustomButton>
            </div>
          </div>
        </div>
      </section>

      <ScheduleDemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
