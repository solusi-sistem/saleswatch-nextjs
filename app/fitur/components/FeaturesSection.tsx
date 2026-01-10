'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import CustomButton from '@/components/button/button';
import { Monitor } from 'lucide-react';
import { webFeatures, mobileFeatures, suiteModules, suiteButtons } from '@/lib/features';

export default function FeaturesSection() {
  const webFeaturesRef = useRef<HTMLDivElement>(null);
  const mobileFeaturesRef = useRef<HTMLDivElement>(null);
  const suiteModulesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

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

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto py-10">
        <div className="bg-[#061551] rounded-4xl px-8 py-12 mx-4 animate__animated animate__fadeIn">
          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-0">
            {/* Saleswatch Section */}
            <div className="flex flex-col justify-between w-[205px]">
              <div className="flex items-center justify-center">
                <h5 className="text-[#CFE3C0] font-semibold text-2xl leading-none">SALESWATCH</h5>
              </div>
              <div className="flex flex-col gap-4">
                <CustomButton className="py-4 px-6 h-14 w-full text-base" onClick={() => scrollToSection('web-features')}>
                  Web Features
                </CustomButton>
                <CustomButton className="py-4 px-6 h-14 w-full text-base" onClick={() => scrollToSection('mobile-features')}>
                  Mobile Features
                </CustomButton>
              </div>
            </div>

            {/* Divider with Character Image */}
            <div className="hidden lg:flex items-end justify-center relative px-8 pb-[0px]">
              <div className="w-[4px] bg-[#6587A8] h-[125px]"></div>
              <Image src="/assets/images/character2.jpg" alt="Saleswatch Logo" width={60} height={60} priority className="rounded-full absolute -left-0 -top-4" />
            </div>

            {/* Saleswatch Suite Section */}
            <div className="flex flex-col justify-between gap-4">
              <div className="flex items-center justify-center gap-3 lg:justify-start">
                <Image src="/assets/images/character2.jpg" alt="Saleswatch Logo" width={60} height={60} priority className="rounded-full lg:hidden" />
                <div>
                  <h5 className="text-[#CFE3C0] font-semibold text-2xl leading-none">SALESWATCH</h5>
                  <h5 className="text-[#CFE3C0] font-semibold text-2xl leading-none">SUITE</h5>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {suiteButtons.slice(0, 3).map((item) => (
                  <CustomButton key={item} className="py-4 px-6 h-14 w-[205px] text-sm" onClick={() => scrollToSection('suite-modules')}>
                    {item}
                  </CustomButton>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {suiteButtons.slice(3).map((item) => (
                  <CustomButton key={item} className="py-4 px-6 h-14 w-[205px] text-sm" onClick={() => scrollToSection('suite-modules')}>
                    {item}
                  </CustomButton>
                ))}
                <div></div>
              </div>
            </div>
          </div>
        </div>

        <div ref={mobileFeaturesRef} id="mobile-features" className="py-10 scroll-mt-32 opacity-0">
          <div className="flex justify-center items-center gap-3">
            <Image src="/svg/handphone.svg" alt="Mobile" width={30} height={30} priority style={{ filter: 'brightness(0)' }} />
            <h3 className="text-[#061551] font-bold text-2xl md:text-4xl">Mobile Features</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10 max-w-7xl mx-auto px-4">
            {mobileFeatures.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center gap-3">
                <Image src={feature.icon} alt={feature.title} width={80} height={80} priority style={{ filter: 'brightness(0)' }} />
                <h5 className="text-[#6587A8] font-semibold text-lg md:text-2xl">{feature.title}</h5>
                <p className="text-base md:text-lg opacity-70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div ref={suiteModulesRef} id="suite-modules" className="py-10 scroll-mt-32 opacity-0">
          <div className="flex justify-center items-center gap-3">
            <Image src="/svg/suite-modules.svg" alt="Suite Modules" width={40} height={40} priority style={{ filter: 'brightness(0)' }} />
            <h3 className="text-[#061551] font-bold text-2xl md:text-4xl">Suite Modules</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10 max-w-7xl mx-auto px-4">
            {suiteModules.map((module) => (
              <div key={module.title} className="flex flex-col items-center text-center gap-3">
                <Image src={module.icon} alt={module.title} width={80} height={80} priority style={{ filter: 'brightness(0)' }} />
                <h5 className="text-[#6587A8] font-semibold text-lg md:text-2xl">{module.title}</h5>
                <p className="text-base md:text-lg opacity-70">{module.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
