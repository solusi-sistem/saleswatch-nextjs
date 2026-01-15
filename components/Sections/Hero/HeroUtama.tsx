'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import CustomButton from '@/components/button/button';
import ScheduleDemoModal from '@/components/modals/ScheduleDemoModal';
import { SectionProps, HeroUtamaContent } from '@/types/section';
import { usePathname } from 'next/navigation';
import { LangKey } from '@/types';
import { getSectionData } from '@/hooks/getSectionData';
import LoadingSpinner from '@/components/loading/LoadingSpinner';

const CACHE_KEY = 'hero_utama_cache';
const CACHE_DURATION = 5 * 60 * 1000;

interface CachedData {
  data: HeroUtamaContent;
  timestamp: number;
}

export default function HeroUtama({ id }: SectionProps) {
  const pathname = usePathname();
  const locale: LangKey = pathname.startsWith('/id') ? 'id' : '';

  const [content, setContent] = useState<HeroUtamaContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statsRef = useRef<HTMLDivElement>(null);
  const stat1Ref = useRef<HTMLDivElement>(null);
  const stat2Ref = useRef<HTMLDivElement>(null);
  const stat3Ref = useRef<HTMLDivElement>(null);
  const stat4Ref = useRef<HTMLDivElement>(null);

  const getCachedData = (): HeroUtamaContent | null => {
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

  const setCachedData = (data: HeroUtamaContent) => {
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
        if (sectionData?.hero_content) {
          setContent(sectionData.hero_content);
          setCachedData(sectionData.hero_content);
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
        if (sectionData?.hero_content) {
          const currentDataString = JSON.stringify(content);
          const newDataString = JSON.stringify(sectionData.hero_content);
          
          if (currentDataString !== newDataString) {
            setContent(sectionData.hero_content);
            setCachedData(sectionData.hero_content);
          }
        }
      } catch (error) {
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [id, content]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!content?.slider_images || content.slider_images.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= content.slider_images!.length) {
          setTimeout(() => {
            setIsTransitioning(false);
            setCurrentImageIndex(0);
          }, 1000);
          return prevIndex;
        }
        return nextIndex;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [content?.slider_images]);

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

    if (stat1Ref.current) observer.observe(stat1Ref.current);
    if (stat2Ref.current) observer.observe(stat2Ref.current);
    if (stat3Ref.current) observer.observe(stat3Ref.current);
    if (stat4Ref.current) observer.observe(stat4Ref.current);

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!content) {
    return null;
  }

  const titleText = content.title_lines ? (locale === 'id' ? content.title_lines.text_id : content.title_lines.text_en) : '';

  const descriptionText = content.description_lines ? (locale === 'id' ? content.description_lines.text_id : content.description_lines.text_en) : '';

  const ctaButtonText = content.cta_button ? (locale === 'id' ? content.cta_button.text_id : content.cta_button.text_en) : '';

  const speechBubbleLines = content.speech_bubble ? (locale === 'id' ? content.speech_bubble.text_lines_id : content.speech_bubble.text_lines_en) : '';

  const images = content.slider_images?.map((img) => img.asset.url) || [];
  const videoUrl = content.background_video?.asset.url;
  const characterImage = content.speech_bubble?.character_image?.asset.url;
  const statistics = content.statistics || [];

  return (
    <>
      <div className="relative w-full overflow-hidden bg-[#061551] pt-12 px-6 md:px-14 lg:px-18 pb-5 md:pb-0">
        <div className="relative w-full overflow-hidden rounded-4xl">
          {videoUrl && (
            <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover rounded-4xl">
              <source src={videoUrl} type="video/mp4" />
            </video>
          )}

          <div className="absolute inset-0 bg-[#061551]/50 rounded-4xl" />

          <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 md:py-20 mt-5 md:mt-0 text-center text-[#DFE1E4]">
            <div className="max-w-3xl">
              {titleText && <h1 className="md:mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl animate__animated animate__fadeIn">{titleText}</h1>}
            </div>

            {descriptionText && (
              <div className="mt-4 md:mt-6 mb-6 md:mb-8">
                <p className="max-w-2xl text-md text-gray-200 text-md md:text-xl animate__animated animate__fadeIn">{descriptionText}</p>
              </div>
            )}

            {speechBubbleLines && (
              <div className="relative mb-6 w-full max-w-md mx-auto animate__animated animate__fadeIn">
                <div className="relative rounded-3xl bg-[#CFE3C0] px-4 py-3 sm:px-6">
                  <p className="text-left text-sm text-[#6587A8] text-md md:text-lg">{speechBubbleLines}</p>

                  <div className="absolute -bottom-2 md:-bottom-3 left-6 sm:left-8 h-5 w-5 sm:h-6 sm:w-6 rotate-45 bg-[#CFE3C0]" />
                </div>

                {characterImage && (
                  <div className="absolute -bottom-28 sm:-bottom-34 -left-5 sm:-left-8 md:translate-x-0 h-28 w-24 sm:h-36 sm:w-32">
                    <Image src={characterImage} alt="Sales Watch Character" fill className="object-contain" />
                  </div>
                )}
              </div>
            )}

            {ctaButtonText && (
              <div className="flex gap-4 mt-0 mb-3 md:mb-0 animate__animated animate__fadeIn">
                <CustomButton size="lg" className="mt-3" onClick={() => setIsModalOpen(true)}>
                  {ctaButtonText}
                </CustomButton>
              </div>
            )}

            {images.length > 0 && (
              <>
                <div className={`relative w-full max-w-[1200px] h-[200px] md:h-[250px] md:h-[450px] overflow-hidden transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <div className={`flex h-full ${isTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`} style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                    {images.map((src, index) => (
                      <div key={index} className="relative min-w-full h-full flex items-center justify-center px-4">
                        <div className="relative w-full max-w-[800px] h-[450px] mx-auto overflow-hidden" style={{ clipPath: 'inset(45px 5px 0 0)' }}>
                          <Image src={src} alt={`Slide ${index + 1}`} fill className="object-contain" priority={index === 0} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-0 md:mt-6 flex justify-center gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsTransitioning(true);
                        setTimeout(() => {
                          setCurrentImageIndex(index);
                          setTimeout(() => {
                            setIsTransitioning(false);
                          }, 700);
                        }, 300);
                      }}
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'}`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {statistics.length > 0 && (
          <div 
            ref={statsRef} 
            className="relative z-10 flex flex-col items-center justify-center px-6 pt-12 pb-8 md:py-20 text-center text-[#DFE1E4]"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12 max-w-6xl mx-auto w-full">
              {statistics.map((stat, index) => {
                const statLabel = locale === 'id' ? stat.label_id : stat.label_en;
                const refMap = [stat1Ref, stat2Ref, stat3Ref, stat4Ref];
                
                return (
                  <div 
                    key={index}
                    ref={refMap[index] || null}
                    className="flex flex-col items-center justify-start text-center"
                    style={{ 
                      animationDelay: `${index * 0.1}s`, 
                      animationFillMode: 'both' 
                    }}
                  >
                    <h1 className="mb-2 md:mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                      {stat.number}
                    </h1>
                    
                    <p className="font-normal text-sm md:text-base lg:text-lg leading-tight px-2 break-words max-w-[180px]">
                      {statLabel}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ScheduleDemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}