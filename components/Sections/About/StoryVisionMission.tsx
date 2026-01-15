'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { LangKey } from '@/types';
import { SectionProps, StoryVisionMissionContent } from '@/types/section';
import { getSectionData } from '@/hooks/getSectionData';
import LoadingSpinner from '@/components/loading/LoadingSpinner';

const CACHE_KEY = 'story_vision_mission_cache';
const CACHE_DURATION = 5 * 60 * 1000;

interface CachedData {
  data: StoryVisionMissionContent;
  timestamp: number;
}

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

export default function StoryVisionMission({ id }: SectionProps) {
  const pathname = usePathname();
  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : '';

  const [content, setContent] = useState<StoryVisionMissionContent | null>(null);
  const [loading, setLoading] = useState(true);

  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  const getCachedData = (): StoryVisionMissionContent | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const parsedCache: CachedData = JSON.parse(cached);
      const now = Date.now();

      if (now - parsedCache.timestamp < CACHE_DURATION) {
        return parsedCache.data;
      } else {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
    } catch (error) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  };

  const setCachedData = (data: StoryVisionMissionContent) => {
    try {
      const cacheData: CachedData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
    }
  };

  useEffect(() => {
    async function fetchContent() {
      if (!id) return;

      const cachedContent = getCachedData();
      if (cachedContent) {
        setContent(cachedContent);
        setLoading(false);
      }

      try {
        const sectionData = await getSectionData(id);
        if (sectionData?.story_vision_mission) {
          setContent(sectionData.story_vision_mission);
          setCachedData(sectionData.story_vision_mission);
        }
      } catch (error) {
        if (!content && cachedContent) {
          setContent(cachedContent);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const interval = setInterval(async () => {
      try {
        const sectionData = await getSectionData(id);
        if (sectionData?.story_vision_mission) {
          const currentDataString = JSON.stringify(content);
          const newDataString = JSON.stringify(sectionData.story_vision_mission);
          
          if (currentDataString !== newDataString) {
            setContent(sectionData.story_vision_mission);
            setCachedData(sectionData.story_vision_mission);
          }
        }
      } catch (error) {
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [id, content]);

  useEffect(() => {
    if (loading) return;

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

    if (card1Ref.current) observer.observe(card1Ref.current);
    if (card2Ref.current) observer.observe(card2Ref.current);
    if (card3Ref.current) observer.observe(card3Ref.current);

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!content?.items || content.items.length === 0) {
    return null;
  }

  const items = content.items;
  const cardRefs = [card1Ref, card2Ref, card3Ref];

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
                ref={cardRefs[index]}
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