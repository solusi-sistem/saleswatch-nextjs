"use client";

import { urlFor } from '@/lib/sanity.realtime';
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LangKey } from "@/types";
import { SectionProps } from "@/types/section";

const POWERED_BY_LOGOS = [
  { name: "GCP", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/googlecloud.svg" },
  { name: "Cloudflare", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/cloudflare.svg" },
  { name: "Sanity", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/sanity.svg" },
];

const FEATURED_BY_MEDIA = [
  { name: "KOMPAS", className: "font-serif font-black text-xl md:text-2xl text-black/80 tracking-tight" },
  { name: "AKURAT", className: "font-sans font-extrabold text-xl md:text-2xl text-black/80 tracking-tight" },
];

const DUPLICATED_POWERED_BY = Array(6).fill(POWERED_BY_LOGOS).flat();
const DUPLICATED_FEATURED_BY = Array(10).fill(FEATURED_BY_MEDIA).flat();

export default function Testimonial({ data }: SectionProps) {
  const pathname = usePathname();
  const currentLang: LangKey = pathname.startsWith("/id") ? "id" : "";

  const content = data?.testimonial_content;
  const [currentIndex, setCurrentIndex] = useState(0);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);
  const poweredByRef = useRef<HTMLDivElement>(null);
  const featuredByRef = useRef<HTMLDivElement>(null);

  const testimonials = content?.testimonials || [];

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

  useEffect(() => {
    if (testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length === 0) return;

    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -80px 0px",
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate__animated", "animate__fadeInUp");
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    if (leftSideRef.current) observer.observe(leftSideRef.current);
    if (rightSideRef.current) observer.observe(rightSideRef.current);

    return () => {
      observer.disconnect();
    };
  }, [testimonials.length, currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  if (!content || testimonials.length === 0) {
    return null;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marquee-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-marquee-left {
          animation: marquee-left 120s linear infinite;
          will-change: transform;
        }
        .animate-marquee-right {
          animation: marquee-right 120s linear infinite;
          will-change: transform;
        }
      ` }} />
      <section className="relative w-full bg-[#2D2D2F] py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-4xl min-[1272px]:max-w-6xl px-6">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((item, index) => {
              const title =
                currentLang === "id" ? item.title_id : item.title_en;
              const quote =
                currentLang === "id" ? item.quote_id : item.quote_en;
              const company =
                currentLang === "id" ? item.company_id : item.company_en;
              const role =
                currentLang === "id"
                  ? item.client_role_id
                  : item.client_role_en;
              const logoUrl =
                item.company_logo?.asset ? urlFor(item.company_logo).url() : "/assets/images/logo1.webp";

              return (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center text-center md:text-left">
                    <div
                      ref={index === currentIndex ? leftSideRef : null}
                      className="text-white flex flex-col items-center md:items-start opacity-0"
                      style={{
                        animationDelay: "0s",
                        animationFillMode: "both",
                      }}
                    >
                      <p className="text-sm md:text-xl text-white/70 mb-6 max-w-md">
                        {title}
                      </p>

                      <div className="ml-1 flex flex-col gap-3">
                        <div className="w-20 h-20 overflow-hidden transition-transform duration-500 hover:scale-110 self-center md:self-start md:-ml-1">
                          <img
                            src={logoUrl}
                            alt={company}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <p className="-ml-1 font-semibold text-center md:text-left">
                          {company}
                        </p>
                      </div>
                    </div>

                    <div
                      ref={index === currentIndex ? rightSideRef : null}
                      className="text-white opacity-0"
                      style={{
                        animationDelay: "0.2s",
                        animationFillMode: "both",
                      }}
                    >
                      <blockquote className="text-lg md:text-base leading-relaxed">
                        {quote}
                      </blockquote>

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
    <section className="w-full bg-[#DFE1E4] py-12 md:py-20 border-t border-black/[0.06] overflow-hidden">
      <div className="w-full flex flex-col gap-10 md:gap-14">
        
        {/* Didukung Oleh / Powered By */}
        <div 
          ref={poweredByRef}
          className="flex flex-col gap-5 md:gap-6 opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <div className="mx-auto max-w-6xl w-full px-6">
            <h4 className="text-xs font-bold tracking-[0.25em] text-black/40 uppercase text-center">
              {currentLang === "id" ? "Didukung Oleh" : "Powered By"}
            </h4>
          </div>
          
          <div className="relative w-full overflow-hidden py-3">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 md:w-32 bg-gradient-to-r from-[#DFE1E4] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 md:w-32 bg-gradient-to-l from-[#DFE1E4] to-transparent z-10 pointer-events-none" />

            <div className="flex w-max animate-marquee-left">
              {/* Set 1 */}
              <div className="flex items-center gap-12 md:gap-20 px-6 md:px-10 shrink-0">
                {DUPLICATED_POWERED_BY.map((logo, idx) => (
                  <div key={`powered-1-${idx}`} className="flex items-center gap-3 opacity-50 shrink-0">
                    <img src={logo.icon} alt={logo.name} className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                    <span className="font-sans font-bold text-black/80 tracking-wide text-base md:text-lg">{logo.name}</span>
                  </div>
                ))}
              </div>
              {/* Set 2 (Duplicate) */}
              <div className="flex items-center gap-12 md:gap-20 px-6 md:px-10 shrink-0">
                {DUPLICATED_POWERED_BY.map((logo, idx) => (
                  <div key={`powered-2-${idx}`} className="flex items-center gap-3 opacity-50 shrink-0">
                    <img src={logo.icon} alt={logo.name} className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                    <span className="font-sans font-bold text-black/80 tracking-wide text-base md:text-lg">{logo.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Diliput Oleh / Featured By */}
        <div 
          ref={featuredByRef}
          className="flex flex-col gap-5 md:gap-6 opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <div className="mx-auto max-w-6xl w-full px-6">
            <h4 className="text-xs font-bold tracking-[0.25em] text-black/40 uppercase text-center">
              {currentLang === "id" ? "Diliput Oleh" : "Featured By"}
            </h4>
          </div>
          
          <div className="relative w-full overflow-hidden py-3">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 md:w-32 bg-gradient-to-r from-[#DFE1E4] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 md:w-32 bg-gradient-to-l from-[#DFE1E4] to-transparent z-10 pointer-events-none" />

            <div className="flex w-max animate-marquee-right">
              {/* Set 1 */}
              <div className="flex items-center gap-12 md:gap-20 px-6 md:px-10 shrink-0">
                {DUPLICATED_FEATURED_BY.map((media, idx) => (
                  <div key={`featured-1-${idx}`} className="opacity-50 shrink-0">
                    <span className={media.className}>{media.name}</span>
                  </div>
                ))}
              </div>
              {/* Set 2 (Duplicate) */}
              <div className="flex items-center gap-12 md:gap-20 px-6 md:px-10 shrink-0">
                {DUPLICATED_FEATURED_BY.map((media, idx) => (
                  <div key={`featured-2-${idx}`} className="opacity-50 shrink-0">
                    <span className={media.className}>{media.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  </>
);
}
