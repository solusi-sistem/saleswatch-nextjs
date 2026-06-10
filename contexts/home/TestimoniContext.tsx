'use client';

import { urlFor } from '@/lib/sanity.realtime';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTestimonial } from '@/contexts/HomeContext';
import type { LangKey } from '@/types';

export default function TestimoniSection() {
  const pathname = usePathname();
  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : '';
  const { data, loading } = useTestimonial();

  const [currentIndex, setCurrentIndex] = useState(0);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);
  const poweredByRef = useRef<HTMLDivElement>(null);
  const featuredByRef = useRef<HTMLDivElement>(null);

  const testimonials = data?.testimonial_content?.testimonials || [];

  useEffect(() => {
    const pEl = poweredByRef.current;
    const fEl = featuredByRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate__animated", "animate__fadeInUp");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (pEl) observer.observe(pEl);
    if (fEl) observer.observe(fEl);
    return () => observer.disconnect();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Animation observer - sama seperti FAQ
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

          if (target === leftSideRef.current) {
            target.classList.add('animate__animated', 'animate__fadeInLeft');
          } else if (target === rightSideRef.current) {
            target.classList.add('animate__animated', 'animate__fadeInRight');
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (leftSideRef.current) observer.observe(leftSideRef.current);
    if (rightSideRef.current) observer.observe(rightSideRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  if (loading) {
    return (
      <section className="relative w-full bg-[#2D2D2F] py-16 md:py-24 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 animate-pulse">
              <div className="h-20 bg-white/10 rounded w-3/4"></div>
              <div className="w-20 h-20 rounded-full bg-white/10"></div>
              <div className="h-6 bg-white/10 rounded w-1/2"></div>
            </div>
            <div className="space-y-4 animate-pulse">
              <div className="h-32 bg-white/10 rounded"></div>
              <div className="h-6 bg-white/10 rounded w-1/3"></div>
              <div className="h-4 bg-white/10 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data || testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];
  const title = currentLang === '' ? currentTestimonial.title_en : currentTestimonial.title_id;
  const quote = currentLang === '' ? currentTestimonial.quote_en : currentTestimonial.quote_id;
  const company = currentLang === '' ? currentTestimonial.company_en : currentTestimonial.company_id;
  const role = currentLang === '' ? currentTestimonial.client_role_en : currentTestimonial.client_role_id;
  const logoUrl = currentTestimonial.company_logo?.asset ? urlFor(currentTestimonial.company_logo).url() : '/assets/images/logo1.webp';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-right {
          animation: marquee-right 25s linear infinite;
        }
      ` }} />
      <section className="relative w-full bg-[#2D2D2F] py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center text-center md:text-left">
          {/* Left Side */}
          <div
            ref={leftSideRef}
            className="text-white flex flex-col items-center md:items-start opacity-0"
            style={{
              animationDelay: '0.1s',
              animationFillMode: 'both'
            }}
          >
            <p className="text-sm md:text-xl text-white/70 mb-6 max-w-md">
              {title}
            </p>

            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-500 hover:scale-110">
                <img
                  src={logoUrl}
                  alt={company}
                  className="w-full h-full object-contain"
                />
              </div>

              <p className="font-semibold">{company}</p>
            </div>
          </div>

          {/* Right Side */}
          <div
            ref={rightSideRef}
            className="text-white opacity-0"
            style={{
              animationDelay: '0.2s',
              animationFillMode: 'both'
            }}
          >
            <blockquote className="text-lg md:text-base leading-relaxed">
              {quote}
            </blockquote>

            <div className="mt-6">
              <p className="font-semibold">{currentTestimonial.client_name}</p>
              <p className="text-sm text-white/60">{role}</p>
              <div className="mt-3 h-1 w-10 bg-white/60 rounded-full mx-auto md:mx-0" />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        {testimonials.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white/60 hover:text-white hover:scale-110 transition-all duration-300 hidden lg:block"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-8 h-8" strokeWidth={1.5} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white/60 hover:text-white hover:scale-110 transition-all duration-300 hidden lg:block"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-8 h-8" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>
    </section>

    {/* Section baru setelah testimonial */}
    <section className="w-full bg-[#DFE1E4] py-16 border-t border-black/[0.06] overflow-hidden">
      <div className="w-full flex flex-col gap-12">
        
        {/* Didukung Oleh / Powered By */}
        <div 
          ref={poweredByRef}
          className="flex flex-col gap-6 opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <div className="mx-auto max-w-6xl w-full px-6">
            <h4 className="text-xs font-bold tracking-[0.2em] text-black/40 uppercase text-center">
              {currentLang === "id" ? "Didukung Oleh" : "Powered By"}
            </h4>
          </div>
          
          <div className="relative w-full overflow-hidden py-2">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#DFE1E4] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#DFE1E4] to-transparent z-10 pointer-events-none" />

            <div className="flex w-[200%] animate-marquee-right">
              {/* Set 1 */}
              <div className="flex justify-around items-center w-1/2 shrink-0 gap-8 px-4">
                <div className="flex items-center gap-3 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/googlecloud.svg" alt="GCP" className="w-8 h-8 object-contain" />
                  <span className="font-sans font-bold text-black/80 tracking-wide text-lg">GCP</span>
                </div>
                <div className="flex items-center gap-3 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/cloudflare.svg" alt="Cloudflare" className="w-8 h-8 object-contain" />
                  <span className="font-sans font-bold text-black/80 tracking-wide text-lg">Cloudflare</span>
                </div>
                <div className="flex items-center gap-3 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/sanity.svg" alt="Sanity" className="w-8 h-8 object-contain" />
                  <span className="font-sans font-bold text-black/80 tracking-wide text-lg">Sanity</span>
                </div>
                <div className="flex items-center gap-3 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/googlecloud.svg" alt="GCP" className="w-8 h-8 object-contain" />
                  <span className="font-sans font-bold text-black/80 tracking-wide text-lg">GCP</span>
                </div>
                <div className="flex items-center gap-3 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/cloudflare.svg" alt="Cloudflare" className="w-8 h-8 object-contain" />
                  <span className="font-sans font-bold text-black/80 tracking-wide text-lg">Cloudflare</span>
                </div>
                <div className="flex items-center gap-3 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/sanity.svg" alt="Sanity" className="w-8 h-8 object-contain" />
                  <span className="font-sans font-bold text-black/80 tracking-wide text-lg">Sanity</span>
                </div>
              </div>
              {/* Set 2 (Duplicate) */}
              <div className="flex justify-around items-center w-1/2 shrink-0 gap-8 px-4">
                <div className="flex items-center gap-3 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/googlecloud.svg" alt="GCP" className="w-8 h-8 object-contain" />
                  <span className="font-sans font-bold text-black/80 tracking-wide text-lg">GCP</span>
                </div>
                <div className="flex items-center gap-3 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/cloudflare.svg" alt="Cloudflare" className="w-8 h-8 object-contain" />
                  <span className="font-sans font-bold text-black/80 tracking-wide text-lg">Cloudflare</span>
                </div>
                <div className="flex items-center gap-3 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/sanity.svg" alt="Sanity" className="w-8 h-8 object-contain" />
                  <span className="font-sans font-bold text-black/80 tracking-wide text-lg">Sanity</span>
                </div>
                <div className="flex items-center gap-3 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/googlecloud.svg" alt="GCP" className="w-8 h-8 object-contain" />
                  <span className="font-sans font-bold text-black/80 tracking-wide text-lg">GCP</span>
                </div>
                <div className="flex items-center gap-3 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/cloudflare.svg" alt="Cloudflare" className="w-8 h-8 object-contain" />
                  <span className="font-sans font-bold text-black/80 tracking-wide text-lg">Cloudflare</span>
                </div>
                <div className="flex items-center gap-3 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/sanity.svg" alt="Sanity" className="w-8 h-8 object-contain" />
                  <span className="font-sans font-bold text-black/80 tracking-wide text-lg">Sanity</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diliput Oleh / Featured By */}
        <div 
          ref={featuredByRef}
          className="flex flex-col gap-6 opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <div className="mx-auto max-w-6xl w-full px-6">
            <h4 className="text-xs font-bold tracking-[0.2em] text-black/40 uppercase text-center">
              {currentLang === "id" ? "Diliput Oleh" : "Featured By"}
            </h4>
          </div>
          
          <div className="relative w-full overflow-hidden py-2">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#DFE1E4] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#DFE1E4] to-transparent z-10 pointer-events-none" />

            <div className="flex w-[200%] animate-marquee-right">
              {/* Set 1 */}
              <div className="flex justify-around items-center w-1/2 shrink-0 gap-8 px-4">
                <div className="flex items-center gap-2 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <span className="font-serif font-black text-2xl text-black/80 tracking-tight">KOMPAS</span>
                </div>
                <div className="flex items-center gap-2 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <span className="font-sans font-extrabold text-2xl text-black/80 tracking-tight">AKURAT</span>
                </div>
                <div className="flex items-center gap-2 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <span className="font-serif font-black text-2xl text-black/80 tracking-tight">KOMPAS</span>
                </div>
                <div className="flex items-center gap-2 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <span className="font-sans font-extrabold text-2xl text-black/80 tracking-tight">AKURAT</span>
                </div>
                <div className="flex items-center gap-2 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <span className="font-serif font-black text-2xl text-black/80 tracking-tight">KOMPAS</span>
                </div>
                <div className="flex items-center gap-2 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <span className="font-sans font-extrabold text-2xl text-black/80 tracking-tight">AKURAT</span>
                </div>
              </div>
              {/* Set 2 (Duplicate) */}
              <div className="flex justify-around items-center w-1/2 shrink-0 gap-8 px-4">
                <div className="flex items-center gap-2 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <span className="font-serif font-black text-2xl text-black/80 tracking-tight">KOMPAS</span>
                </div>
                <div className="flex items-center gap-2 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <span className="font-sans font-extrabold text-2xl text-black/80 tracking-tight">AKURAT</span>
                </div>
                <div className="flex items-center gap-2 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <span className="font-serif font-black text-2xl text-black/80 tracking-tight">KOMPAS</span>
                </div>
                <div className="flex items-center gap-2 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <span className="font-sans font-extrabold text-2xl text-black/80 tracking-tight">AKURAT</span>
                </div>
                <div className="flex items-center gap-2 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <span className="font-serif font-black text-2xl text-black/80 tracking-tight">KOMPAS</span>
                </div>
                <div className="flex items-center gap-2 opacity-40 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <span className="font-sans font-extrabold text-2xl text-black/80 tracking-tight">AKURAT</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  </>
);
}
