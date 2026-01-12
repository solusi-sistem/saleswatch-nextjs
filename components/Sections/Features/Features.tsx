'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import CustomButton from '@/components/button/button';
import { SectionProps, FeaturesContent } from '@/types/section';
import { getSectionData } from '@/hooks/getSectionData';
import type { LangKey } from '@/types';

export default function Features({ id }: SectionProps) {
  const pathname = usePathname();
  const currentLang: LangKey = pathname.startsWith('/id') ? 'id' : '';

  const [content, setContent] = useState<FeaturesContent | null>(null);
  const [loading, setLoading] = useState(true);

  const webFeaturesRef = useRef<HTMLDivElement>(null);
  const mobileFeaturesRef = useRef<HTMLDivElement>(null);
  const suiteModulesRef = useRef<HTMLDivElement>(null);

  // Fetch data dari Sanity
  useEffect(() => {
    async function fetchContent() {
      if (!id) return;

      try {
        setLoading(true);
        const sectionData = await getSectionData(id);
        if (sectionData?.features_content) {
          setContent(sectionData.features_content);
        }
      } catch (error) {
        console.error('Error fetching features content:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [id]);

  useEffect(() => {
    if (loading) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__animated', 'animate__fadeInUp');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (webFeaturesRef.current) observer.observe(webFeaturesRef.current);
    if (mobileFeaturesRef.current) observer.observe(mobileFeaturesRef.current);
    if (suiteModulesRef.current) observer.observe(suiteModulesRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return <div className="bg-[#f2f7ff]"></div>;
  }

  if (!content || !content.mobile_features || content.mobile_features.length === 0) {
    return null;
  }

  // Pisahkan fitur berdasarkan type - handle null/undefined dengan fallback ke fiturSuite
  const fiturUtamaList = content.mobile_features.filter((f) => f.type_features === 'fiturUtama');
  const fiturSuiteList = content.mobile_features.filter((f) => f.type_features === 'fiturSuite' || !f.type_features);

  // Ambil data dari content
  const logoText = content.logo_text || 'SALESWATCH';
  const logoImage = content.logo_features?.asset?.url;
  const logoTeksFeatures = content.logo_teks_features || 'Saleswatch';
  const suiteText = content.suite_text || 'SUITE';

  return (
    <div className="bg-[#f2f7ff]">
      <div className="container mx-auto py-10 xl:px-30">
        <div className="bg-[#061551] rounded-4xl px-8 py-12 mx-4 animate__animated animate__fadeIn">
          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-0">
            {/* Saleswatch Section */}
            <div className="flex flex-col md:w-[230px] gap-4 justify-between">
              <div className="flex items-center justify-center md:justify-start">
                <h5 className="text-[#CFE3C0] font-semibold text-2xl leading-none">{logoText}</h5>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {fiturUtamaList.map((feature, index) => {
                  const btnText = currentLang === 'id' ? feature.section_title_id || feature.section_title_en : feature.section_title_en || feature.section_title_id;

                  return (
                    <CustomButton key={index} className="py-4 px-6 h-14 w-[204px] text-sm" onClick={() => scrollToSection(`feature-${index}`)}>
                      {btnText}
                    </CustomButton>
                  );
                })}
              </div>
            </div>

            {/* Divider with Character Image */}
            <div className="hidden lg:flex items-end justify-center relative px-8 pb-[0px]">
              <div className="w-[4px] bg-[#6587A8] h-[120px]"></div>
              {logoImage && <Image src={logoImage} alt={logoTeksFeatures} width={120} height={120} priority className="rounded-full absolute -left-0 -top-3" />}
            </div>

            {/* Saleswatch Suite Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-0 md:gap-3 lg:justify-start">
                {logoImage && <Image src={logoImage} alt={logoTeksFeatures} width={60} height={60} priority className="rounded-full lg:hidden" />}
                <div className="flex flex-col justify-start items-start">
                  <h5 className="text-[#CFE3C0] font-semibold text-2xl leading-none">{logoTeksFeatures}</h5>
                  <h5 className="text-[#CFE3C0] font-semibold text-2xl leading-none">{suiteText}</h5>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {fiturSuiteList.flatMap((feature) =>
                  (feature.features_list || []).map((item, itemIndex) => {
                    const btnText = currentLang === 'id' ? item.title?.id || item.title?.en : item.title?.en || item.title?.id;

                    return (
                      <CustomButton key={`suite-btn-${item._id}-${itemIndex}`} className="py-4 px-6 h-14 w-[204px] text-sm" onClick={() => scrollToSection('suite-modules')}>
                        {btnText}
                      </CustomButton>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Render Fitur Utama Sections */}
        {fiturUtamaList.map((feature, index) => {
          const sectionTitle = currentLang === 'id' ? feature.section_title_id || feature.section_title_en : feature.section_title_en || feature.section_title_id;
          const mobileIcon = feature.mobile_icon?.asset?.url;
          const featuresList = feature.features_list || [];

          return (
            <div key={`fitur-utama-${index}`} ref={index === 0 ? mobileFeaturesRef : null} id={`feature-${index}`} className="py-10 scroll-mt-32">
              <div className="flex justify-center items-center gap-3">
                {mobileIcon && <Image src={mobileIcon} alt={sectionTitle} width={30} height={30} priority style={{ filter: 'brightness(0)' }} />}
                <h3 className="text-[#061551] font-bold text-2xl md:text-4xl">{sectionTitle}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10 max-w-7xl mx-auto px-4">
                {featuresList.map((item) => {
                  const title = currentLang === 'id' ? item.title?.id || item.title?.en : item.title?.en || item.title?.id;
                  const description = currentLang === 'id' ? item.description?.id || item.description?.en : item.description?.en || item.description?.id;
                  const icon = item.icon?.asset?.url;

                  return (
                    <div key={item._id} className="flex flex-col items-center text-center gap-3">
                      {icon && <Image src={icon} alt={title || ''} width={80} height={80} priority style={{ filter: 'brightness(0)' }} />}
                      <h5 className="text-[#6587A8] font-semibold text-lg md:text-2xl">{title}</h5>
                      <p className="text-base md:text-lg opacity-70">{description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Render Suite Modules Sections */}
        {fiturSuiteList.map((feature, index) => {
          const sectionTitle = currentLang === 'id' ? feature.section_title_id || feature.section_title_en : feature.section_title_en || feature.section_title_id;
          const mobileIcon = feature.mobile_icon?.asset?.url;
          const featuresList = feature.features_list || [];

          return (
            <div key={`fitur-suite-${index}`} ref={index === 0 ? suiteModulesRef : null} id="suite-modules" className="py-10 scroll-mt-32">
              <div className="flex justify-center items-center gap-3">
                {mobileIcon && <Image src={mobileIcon} alt={sectionTitle} width={40} height={40} priority style={{ filter: 'brightness(0)' }} />}
                <h3 className="text-[#061551] font-bold text-2xl md:text-4xl">{sectionTitle}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10 max-w-7xl mx-auto px-4">
                {featuresList.map((item) => {
                  const title = currentLang === 'id' ? item.title?.id || item.title?.en : item.title?.en || item.title?.id;
                  const description = currentLang === 'id' ? item.description?.id || item.description?.en : item.description?.en || item.description?.id;
                  const icon = item.icon?.asset?.url;

                  return (
                    <div key={item._id} className="flex flex-col items-center text-center gap-3">
                      {icon && <Image src={icon} alt={title || ''} width={80} height={80} priority style={{ filter: 'brightness(0)' }} />}
                      <h5 className="text-[#6587A8] font-semibold text-lg md:text-2xl">{title}</h5>
                      <p className="text-base md:text-lg opacity-70">{description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
