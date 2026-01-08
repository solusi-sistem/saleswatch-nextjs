'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import CustomButton from '@/components/button/button';
import { useWhyItWorks } from '@/contexts/HomeContext';
import type { LangKey } from '@/types';

export default function WhyItWorks() {
  const pathname = usePathname();
  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : 'en';
  const { data, loading } = useWhyItWorks();

  const titleRef = useRef<HTMLHeadingElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (loading) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__animated', 'animate__fadeInUp');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (titleRef.current) observer.observe(titleRef.current);
    featureRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  if (loading) {
    return (
      <section className="bg-[#f2f7ff] py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-24">
          <div className="h-16 bg-white/50 animate-pulse rounded w-1/2 mx-auto"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid md:grid-cols-2 gap-10 items-center">
              <div className="h-80 bg-white/50 animate-pulse rounded"></div>
              <div className="space-y-4">
                <div className="h-10 bg-white/50 animate-pulse rounded w-3/4"></div>
                <div className="h-20 bg-white/50 animate-pulse rounded"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-6 bg-white/50 animate-pulse rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!data || !data.why_it_works) {
    return null;
  }

  const content = data.why_it_works;
  const sectionTitle = currentLang === 'en' ? content.section_title_en : content.section_title_id;
  const features = content.features || [];

  return (
    <section className="bg-[#f2f7ff] py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-24">
        <h2 
          ref={titleRef}
          className="text-center text-4xl sm:text-5xl md:text-6xl font-bold text-[#2f2e2e] opacity-0"
        >
          {sectionTitle}
        </h2>

        {features.map((feature, index) => {
          const title = currentLang === 'en' ? feature.title_en : feature.title_id;
          const description = currentLang === 'en' ? feature.description_en : feature.description_id;
          const buttonText = currentLang === 'en' ? feature.cta_button.text_en : feature.cta_button.text_id;
          const imageUrl = feature.image?.asset?.url || '/img/placeholder.avif';
          const isImageLeft = feature.image_position === 'left';

          return (
            <div 
              key={index}
              ref={(el) => { featureRefs.current[index] = el; }}
              className="grid md:grid-cols-2 gap-10 items-center opacity-0"
            >
              {/* Image */}
              <div 
                className={`flex justify-center ${
                  isImageLeft 
                    ? 'md:justify-center' 
                    : 'md:justify-center md:mr-30 md:order-2'
                } -mt-14 md:mt-0 ${!isImageLeft ? 'mr-0 md:mr-10' : ''}`}
              >
                <Image 
                  src={imageUrl} 
                  alt={title} 
                  width={340} 
                  height={340} 
                  className="w-[260px] sm:w-[300px] md:w-[340px] h-auto rounded-xl" 
                />
              </div>

              {/* Content */}
              <div className={`text-left max-w-[450px] mx-auto md:mx-0 ${
                !isImageLeft ? 'md:justify-self-end pe-0 md:pe-10' : ''
              }`}>
                <h3 className="text-3xl md:text-4xl font-bold text-[#2f2e2e] mb-6">
                  {title}
                </h3>
                <p className="text-[#5B5B5C] leading-relaxed mb-6">
                  {description}
                </p>

                {/* Checklist */}
                <div className="space-y-3 mb-8">
                  {feature.checklist_items.map((item, itemIndex) => {
                    const checklistText = currentLang === 'en' ? item.text_en : item.text_id;
                    return (
                      <div key={itemIndex} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#4A6FA5] flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-[#5B5B5C] text-sm md:text-base">
                          {checklistText}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* CTA Button */}
                <div className="flex justify-center md:justify-start">
                  <Link href={feature.cta_button.link}>
                    <CustomButton size="lg" className="mt-3">
                      {buttonText}
                    </CustomButton>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}