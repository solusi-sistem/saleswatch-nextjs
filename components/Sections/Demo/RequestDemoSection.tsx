'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import CustomButton from '@/components/button/button';
import ScheduleDemoModal from '@/components/modals/ScheduleDemoModal';
import type { LangKey } from '@/types';
import { SectionProps, RequestDemoContent } from '@/types/section';
import { getSectionData } from '@/hooks/getSectionData';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import { urlFor } from '@/lib/sanity';

export default function RequestDemoSection({ id }: SectionProps) {
  const pathname = usePathname();
  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : '';

  const [content, setContent] = useState<RequestDemoContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animationStates, setAnimationStates] = useState({
    badge: false,
    title: false,
    button: false
  });

  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLHeadingElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Fetch data dari Sanity
  useEffect(() => {
    async function fetchContent() {
      if (!id) return;

      try {
        setLoading(true);
        const sectionData = await getSectionData(id);
        if (sectionData?.request_demo_content) {
          setContent(sectionData.request_demo_content);
        }
      } catch (error) {
        console.error('Error fetching request demo content:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [id]);

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
    if (loading || !content) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px'
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;

          if (target === badgeRef.current) {
            setAnimationStates(prev => ({ ...prev, badge: true }));
          } else if (target === titleContainerRef.current) {
            setAnimationStates(prev => ({ ...prev, title: true }));
          } else if (target === buttonRef.current) {
            setAnimationStates(prev => ({ ...prev, button: true }));
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
  }, [loading, content]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!content) {
    return null;
  }

  console.log(content);

  const badgeText = currentLang === '' ? content.badge_text_en : content.badge_text_id;
  const titleText = currentLang === '' ? content.title_lines?.text_en : content.title_lines?.text_id;
  const buttonText = currentLang === '' ? content.cta_button?.text_en : content.cta_button?.text_id;
  const backgroundImage = content.background_image
    ? urlFor(content.background_image)
      .format('webp')
      .quality(90)
      .url()
    : '';

  return (
    <>
      {backgroundImage && (
        <div
          className={`fixed inset-0 -z-20 bg-cover bg-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          style={{
            backgroundImage: `linear-gradient(rgba(6, 21, 81, 0.6), rgba(6, 21, 81, 0.6)), url('${backgroundImage}')`,
          }}
        />
      )}

      <section ref={sectionRef} className="relative w-full overflow-hidden py-16 md:py-24 min-h-[400px]">
        <div className="relative z-10 flex justify-center px-4 text-[#DFE1E4]">
          <div className="w-full max-w-4xl text-center md:text-left">
            {/* Badge dengan Icon */}
            {badgeText && (
              <h2
                ref={badgeRef}
                className={`mb-4 text-lg sm:text-xl md:text-3xl font-semibold text-white flex items-center justify-center md:justify-start gap-3 transition-all duration-700 ${animationStates.badge
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-4'
                  }`}
              >
                <svg viewBox="0 0 60 60" className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 1.9C14.5 1.9 1.9 14.5 1.9 30c0 15.5 12.6 28.1 28.1 28.1S58.1 45.5 58.1 30C58.1 14.5 45.5 1.9 30 1.9zm0 44c-8.8 0-15.9-7.1-15.9-15.9S21.2 14.1 30 14.1 45.9 21.2 45.9 30 38.8 45.9 30 45.9z" />
                </svg>
                <span>{badgeText}</span>
              </h2>
            )}

            {/* Title */}
            {titleText && (
              <div
                ref={titleContainerRef}
                className={`transition-all duration-700 delay-200 ${animationStates.title
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
                  }`}
              >
                <p className="text-xl sm:text-2xl md:text-[50px] font-bold leading-tight text-white">
                  {titleText}
                </p>
              </div>
            )}

            {/* CTA Button dengan Zoom In */}
            {buttonText && (
              <div
                ref={buttonRef}
                className={`mt-8 flex justify-center md:justify-center transition-all duration-700 delay-500 ${animationStates.button
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95'
                  }`}
              >
                <CustomButton
                  size="lg"
                  className="hover:scale-110 transition-transform duration-300"
                  onClick={() => setIsModalOpen(true)}
                >
                  {buttonText}
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      </section>

      <ScheduleDemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}