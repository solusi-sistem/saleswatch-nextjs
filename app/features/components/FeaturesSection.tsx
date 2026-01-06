'use client';

import Image from 'next/image';
import CustomButton from '@/components/button/button';
import { Monitor } from 'lucide-react';
import { webFeatures, mobileFeatures, suiteModules, suiteButtons } from '@/lib/features';

export default function FeaturesSection() {
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
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 place-items-center">
        <div className="w-full flex justify-end p-4">
          <div className="bg-[#061551] rounded-4xl w-full max-w-md px-10 py-8 flex flex-col min-h-[488px]">
            <div className="flex items-center justify-center gap-2">
              <Image src="/assets/images/character2.jpg" alt="Saleswatch Logo" width={60} height={60} priority className="rounded-full" />
              <h5 className="text-[#CFE3C0] font-semibold text-2xl leading-none">SALESWATCH</h5>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full">
              <CustomButton className="py-3 !px-11" onClick={() => scrollToSection('web-features')}>
                Web Features
              </CustomButton>
              <CustomButton className="py-3" onClick={() => scrollToSection('mobile-features')}>
                Mobile Features
              </CustomButton>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-start p-4">
          <div className="bg-[#061551] rounded-4xl w-full max-w-md px-10 py-8 flex flex-col items-center justify-center min-h-[460px]">
            <div className="flex items-center justify-center gap-2">
              <Image src="/assets/images/character2.jpg" alt="Saleswatch Logo" width={60} height={60} priority className="rounded-full" />
              <div>
                <h5 className="text-[#CFE3C0] font-semibold text-2xl leading-none">SALESWATCH</h5>
                <h5 className="text-[#CFE3C0] font-semibold text-2xl leading-none">SUITE</h5>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 mt-8 w-full">
              {suiteButtons.map((item) => (
                <CustomButton key={item} className="py-3 !px-11" onClick={() => scrollToSection('suite-modules')}>
                  {item}
                </CustomButton>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div id="web-features" className="py-10 scroll-mt-32 mt-10">
        <div className="flex justify-center items-center gap-3">
          <Monitor size={36} className="text-black" />
          <h3 className="text-[#061551] font-bold text-2xl md:text-4xl">Web Features</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10 max-w-7xl mx-auto px-4">
          {webFeatures.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center gap-3">
              <Image src={feature.icon} alt={feature.title} width={80} height={80} priority style={{ filter: 'brightness(0)' }} />
              <h5 className="text-[#6587A8] font-semibold text-lg md:text-2xl">{feature.title}</h5>
              <p className="text-base md:text-lg opacity-70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="mobile-features" className="py-10 scroll-mt-32">
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

      <div id="suite-modules" className="py-10 scroll-mt-32">
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
  );
}
