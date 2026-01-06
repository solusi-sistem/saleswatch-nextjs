'use client';

import { useEffect, useRef, useState } from 'react';
import CustomButton from '@/components/button/button';
import ScheduleDemoModal from '@/components/modals/ScheduleDemoModal';

export default function RequestDemoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Background aktif ketika section terlihat di viewport
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0, // Trigger saat section mulai terlihat
        rootMargin: '0px', // Bisa disesuaikan untuk trigger lebih awal/lambat
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

  return (
    <>
      {/* BACKGROUND - Fixed, tapi visibility controlled */}
      <div className={`fixed inset-0 -z-20 bg-cover bg-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ backgroundImage: "url('/assets/images/demo.avif')" }} />

      {/* Overlay gelap - juga controlled */}
      <div className={`fixed inset-0 -z-20 bg-[#061551]/50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

      <section ref={sectionRef} className="relative w-full overflow-hidden py-16 md:py-24">
        {/* CONTENT WRAPPER */}
        <div className="relative z-10 flex justify-center px-4 text-[#DFE1E4]">
          <div className="w-full max-w-4xl text-center md:text-left">
            {/* TITLE */}
            <h2 className="mb-4 text-lg sm:text-xl md:text-3xl font-semibold text-[#061551] flex items-center gap-3 ms-3 md:ms-0">
              {/* SVG Inline */}
              <svg viewBox="0 0 60 60" className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 1.9C14.5 1.9 1.9 14.5 1.9 30c0 15.5 12.6 28.1 28.1 28.1S58.1 45.5 58.1 30C58.1 14.5 45.5 1.9 30 1.9zm0 44c-8.8 0-15.9-7.1-15.9-15.9S21.2 14.1 30 14.1 45.9 21.2 45.9 30 38.8 45.9 30 45.9z" />
              </svg>

              <span>Request Demo</span>
            </h2>

            {/* TEXT CONTENT */}
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xl sm:text-2xl md:text-[50px] font-bold leading-tight">To experience the power of Sales</p>
              <p className="text-xl sm:text-2xl md:text-[50px] font-bold leading-tight">Watch firsthand, schedule a</p>
              <p className="text-xl sm:text-2xl md:text-[50px] font-bold leading-tight">product demo with our experts.</p>
              <p className="text-xl sm:text-2xl md:text-[50px] font-bold leading-tight">Fill in your contact details, and</p>
              <p className="text-xl sm:text-2xl md:text-[50px] font-bold leading-tight">we'll take care of the rest</p>
            </div>

            {/* BUTTON */}
            <div className="mt-8 flex justify-center md:justify-center">
              <CustomButton size="lg" className="mt-3" onClick={() => setIsModalOpen(true)}>
                Schedule Demo
              </CustomButton>
            </div>
          </div>
        </div>
      </section>

      <ScheduleDemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
