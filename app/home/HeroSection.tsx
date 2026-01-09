'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import CustomButton from '@/components/button/button';
import ScheduleDemoModal from '@/components/modals/ScheduleDemoModal';

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statsRef = useRef<HTMLDivElement>(null);
  const stat1Ref = useRef<HTMLDivElement>(null);
  const stat2Ref = useRef<HTMLDivElement>(null);
  const stat3Ref = useRef<HTMLDivElement>(null);
  const stat4Ref = useRef<HTMLDivElement>(null);

  const images = ['/assets/images/gambar1.avif', '/assets/images/gambar2.avif'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= images.length) {
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
  }, [images.length]);

  // Intersection Observer untuk animasi scroll stats section
  useEffect(() => {
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
  }, []);

  return (
    <>
      <div className="relative w-full overflow-hidden bg-[#061551] pt-12 px-6 md:px-14 lg:px-18 pb-5 md:pb-0">
        <div className="relative w-full overflow-hidden rounded-4xl">
          <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover rounded-4xl">
            <source src="/assets/video/file.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-[#061551]/50 rounded-4xl" />

          <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 md:py-20 mt-5 md:mt-0 text-center text-[#DFE1E4]">
            <h1 className="md:mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl animate__animated animate__fadeIn">Increase Visibility.</h1>
            <h1 className="md:mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl animate__animated animate__fadeIn">Strengthen Sales. Predict</h1>
            <h1 className="md:mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl animate__animated animate__fadeIn">Demand. Built in</h1>
            <h1 className="md:mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl animate__animated animate__fadeIn">Collaboration with Major</h1>
            <h1 className="md:mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl animate__animated animate__fadeIn">FMCG Players.</h1>

            <div className="mt-4 md:mt-6 mb-6 md:mb-8">
              <p className="max-w-2xl text-md text-gray-200 text-md md:text-xl animate__animated animate__fadeIn">Sales Watch is a sales rep monitoring solution developed by SSS</p>
              <p className="max-w-2xl text-md text-gray-200 text-md md:text-xl animate__animated animate__fadeIn">(Software System Solutions), designed to empower distributors and</p>
              <p className="max-w-2xl text-md text-gray-200 tex-md md:text-xl animate__animated animate__fadeIn">companies with control over their sales teams in the field.</p>
            </div>

            <div className="relative mb-6 w-full max-w-md mx-auto animate__animated animate__fadeIn">
              <div className="relative rounded-3xl bg-[#CFE3C0] px-4 py-3 sm:px-6">
                <p className="text-left text-sm text-[#6587A8] text-md md:text-lg">
                  <span className="block">
                    See how <span className="font-bold">SALESWATCH</span> can eliminate
                  </span>
                  <span className="block">fraud and boost on-ground</span>
                  <span className="block">productivity.</span>
                </p>

                <div className="absolute -bottom-2 md:-bottom-3 left-6 sm:left-8 h-5 w-5 sm:h-6 sm:w-6 rotate-45 bg-[#CFE3C0]" />
              </div>

              <div className="absolute -bottom-28 sm:-bottom-34 -left-4 sm:-left-8 md:translate-x-0 h-28 w-24 sm:h-36 sm:w-32">
                <Image src="/assets/images/character.png" alt="Sales Watch Character" fill className="object-contain" />
              </div>
            </div>

            <div className="flex gap-4 mt-0 mb-3 md:mb-9 animate__animated animate__fadeIn">
              <CustomButton size="lg" className="mt-3" onClick={() => setIsModalOpen(true)}>
                Schedule Demo
              </CustomButton>
            </div>

            <div className={`relative w-full max-w-[1200px] h-[200px] md:h-[250px] md:h-[450px] overflow-hidden transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className={`flex h-full ${isTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`} style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                {images.map((src, index) => (
                  <div key={index} className="relative min-w-full h-full flex items-center justify-center px-4">
                    <div className="relative w-full max-w-[800px] h-[450px] mx-auto">
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
          </div>
        </div>

        {/* Stats Section dengan Staggered Animation */}
        <div
          ref={statsRef}
          className="relative z-10 flex flex-col items-center justify-center px-6 pt-12 pb-8 md:py-20 text-center text-[#DFE1E4]"
        >
          <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center md:items-start gap-6 md:gap-8 lg:gap-16 xl:gap-20 max-w-6xl mx-auto w-full">
            {/* Stat Card 1 */}
            <div
              ref={stat1Ref}
              className="flex flex-col items-center text-center opacity-0 md:min-w-[120px] lg:min-w-[150px]"
              style={{ animationDelay: '0s', animationFillMode: 'both' }}
            >
              <h1 className="mb-2 md:mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                500+
              </h1>
              <p className="font-normal text-sm md:text-base lg:text-lg leading-tight whitespace-nowrap">
                Sales Activities Tracked
              </p>
            </div>

            {/* Stat Card 2 */}
            <div
              ref={stat2Ref}
              className="flex flex-col items-center text-center opacity-0 md:min-w-[120px] lg:min-w-[150px]"
              style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
            >
              <h1 className="mb-2 md:mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                50+
              </h1>
              <p className="font-normal text-sm md:text-base lg:text-lg leading-tight whitespace-nowrap">
                Verified Sales Visits
              </p>
            </div>

            {/* Stat Card 3 */}
            <div
              ref={stat3Ref}
              className="flex flex-col items-center text-center opacity-0 md:min-w-[120px] lg:min-w-[150px]"
              style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
            >
              <h1 className="mb-2 md:mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                100+
              </h1>
              <p className="font-normal text-sm md:text-base lg:text-lg leading-tight whitespace-nowrap">
                Companies Using
              </p>
            </div>

            {/* Stat Card 4 */}
            <div
              ref={stat4Ref}
              className="flex flex-col items-center text-center opacity-0 md:min-w-[120px] lg:min-w-[150px]"
              style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
            >
              <h1 className="mb-2 md:mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                97%+
              </h1>
              <p className="font-normal text-sm md:text-base lg:text-lg leading-tight whitespace-nowrap">
                Customer Satisfaction
              </p>
            </div>
          </div>
        </div>
      </div>

      <ScheduleDemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}