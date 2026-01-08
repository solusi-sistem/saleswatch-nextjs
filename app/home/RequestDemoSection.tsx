'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import CustomButton from '@/components/button/button';
import ScheduleDemoModal from '@/components/modals/ScheduleDemoModal';
import { useRequestDemo } from '@/contexts/HomeContext';
import type { LangKey } from '@/types';

export default function RequestDemoSection() {
  const pathname = usePathname();
  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : '';
  const { data, loading } = useRequestDemo();

  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLHeadingElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (loading) return;

    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;

          if (target === badgeRef.current) {
            target.classList.add('animate__animated', 'animate__fadeInDown');
          } else if (target === titleContainerRef.current) {
            target.classList.add('animate__animated', 'animate__fadeInUp');
          } else if (target === buttonRef.current) {
            target.classList.add('animate__animated', 'animate__zoomIn');
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (badgeRef.current) observer.observe(badgeRef.current);
    if (titleContainerRef.current) observer.observe(titleContainerRef.current);
    if (buttonRef.current) observer.observe(buttonRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loading]);

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
  const badgeText = currentLang === '' ? content.badge_text_en : content.badge_text_id;
  const buttonText = currentLang === '' ? content.cta_button.text_en : content.cta_button.text_id;

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
            {/* Badge dengan Icon */}
            <h2
              ref={badgeRef}
              className="mb-4 text-lg sm:text-xl md:text-3xl font-semibold text-[#061551] flex items-center gap-3 ms-3 md:ms-0 opacity-0"
              style={{ animationDelay: '0s', animationFillMode: 'both' }}
            >
              <svg viewBox="0 0 60 60" className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 1.9C14.5 1.9 1.9 14.5 1.9 30c0 15.5 12.6 28.1 28.1 28.1S58.1 45.5 58.1 30C58.1 14.5 45.5 1.9 30 1.9zm0 44c-8.8 0-15.9-7.1-15.9-15.9S21.2 14.1 30 14.1 45.9 21.2 45.9 30 38.8 45.9 30 45.9z" />
              </svg>
              <span>{badgeText}</span>
            </h2>

            {/* Title Lines dengan Staggered Animation */}
            <div
              ref={titleContainerRef}
              className="space-y-1 sm:space-y-2 opacity-0"
              style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
            >
              {content.title_lines.map((line, index) => (
                <p
                  key={index}
                  className="text-xl sm:text-2xl md:text-[50px] font-bold leading-tight"
                  style={{
                    animation: 'fadeInUp 0.8s ease-out forwards',
                    animationDelay: `${0.3 + (index * 0.1)}s`,
                    opacity: 0
                  }}
                >
                  {currentLang === '' ? line.text_en : line.text_id}
                </p>
              ))}
            </div>

            {/* CTA Button dengan Zoom In */}
            <div
              ref={buttonRef}
              className="mt-8 flex justify-center md:justify-center opacity-0"
              style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
            >
              <CustomButton
                size="lg"
                className="mt-3 hover:scale-110 transition-transform duration-300"
                onClick={() => setIsModalOpen(true)}
              >
                {buttonText}
              </CustomButton>
            </div>
          </div>
        </div>
      </section>

      <ScheduleDemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}