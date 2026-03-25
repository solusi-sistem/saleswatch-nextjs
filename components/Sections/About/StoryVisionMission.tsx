'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import type { LangKey } from '@/types';
import { SectionProps } from '@/types/section';

const iconComponents = {
  cross: (
    <svg width="44" height="42" viewBox="5.137 5.637 188.725 188.725" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="presentation" aria-hidden="true" className="text-[#061551]">
      <g>
        <path d="M149.8,80l37.8-37.8c8.3-8.3,8.3-21.9,0-30.3s-21.9-8.3-30.3,0l-37.8,37.8c-8.3,8.3,8.3,21.9,0,30.3S141.4,88.3,149.8,80z" fill="currentColor" />
        <path d="M49.2,120l-37.8,37.8c-8.3,8.3-8.3,21.9,0,30.3s21.9,8.3,30.3,0l37.8-37.8c8.3-8.3,8.3-21.9,0-30.3S57.6,111.7,49.2,120z" fill="currentColor" />
        <path d="M149.8,120c-8.3-8.3-21.9-8.3-30.3,0s-8.3,21.9,0,30.3l37.8,37.8c8.3,8.3,21.9,8.3,30.3,0s8.3-21.9,0-30.3L149.8,120z" fill="currentColor" />
        <path d="M41.7,12c-8.3-8.3-21.9-8.3-30.3,0s-8.3,21.9,0,30.3L49.2,80c8.3,8.3,21.9,8.3,30.3,0s8.3-21.9,0-30.3L41.7,12z" fill="currentColor" />
      </g>
    </svg>
  ),
  circle: (
    <svg width="44" height="42" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#061551]">
      <circle cx="22" cy="21" r="16" stroke="currentColor" strokeWidth="6" />
    </svg>
  ),
  plus: (
    <svg width="44" height="42" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#061551]">
      <path d="M22 8 V34 M10 21 H34" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function StoryVisionMission({ data }: SectionProps) {
  const pathname = usePathname();
  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : '';

  const content = data?.story_vision_mission;
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!content?.items || content.items.length === 0) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__animated', 'animate__fadeInUp');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    cardRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [content]);

  if (!content?.items || content.items.length === 0) {
    return null;
  }

  const items = content.items;

  return (
    <section className="bg-[#DFE1E4] py-16 md:py-24 px-4" style={{ scrollMarginTop: '100px' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-12 md:gap-16 lg:gap-20 md:grid-cols-3 text-center">
          {items.map((item, index) => {
            const title = currentLang === 'id' ? item.title_id : item.title_en;
            const description = currentLang === 'id' ? item.description_id : item.description_en;

            return (
              <div
                key={index}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="flex flex-col items-center space-y-4 opacity-0"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationFillMode: 'both',
                }}
              >
                <div className="h-14 flex items-center justify-center">{iconComponents[item.icon_type as keyof typeof iconComponents]}</div>

                <h3 className="text-xl font-bold text-[#6587A8]">{title}</h3>

                <p className="text-[#5B5B5C] text-md leading-relaxed max-w-xs">{description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
