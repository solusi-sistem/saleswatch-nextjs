'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
    {
        title: 'Berikut pernyataan klien tentang pengalaman mereka dengan Mekari Qontak',
        quote:
            '"Dengan mengintegrasikan Mekari Qontak ke dalam proses penjualan kami, waktu respon tim sales meningkat karena setiap prospek masuk yang menghubungi perusahaan secara otomatis ditugaskan kepada sales representative yang tersedia untuk segera ditindaklanjuti."',
        company: 'Healthcare and Biotech',
        clientName: 'Andreas Pratama',
        role: 'Marketing Manager',
        logo: '/assets/images/logo1.webp',
    },
    {
        title: 'Berikut pernyataan klien tentang pengalaman mereka dengan Mekari Qontak',
        quote:
            '"Sejak menggunakan Mekari Qontak, tim kami bisa mengelola leads lebih cepat dan terstruktur. Proses follow-up menjadi jauh lebih efisien dan berdampak langsung pada peningkatan konversi penjualan."',
        company: 'FMCG Distribution',
        clientName: 'Rizky Mahendra',
        role: 'Sales Operation Lead',
        logo: '/assets/images/logo2.webp',
    },
];

export default function Testimonial() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const leftSideRef = useRef<HTMLDivElement>(null);
    const rightSideRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        if (leftSideRef.current) observer.observe(leftSideRef.current);
        if (rightSideRef.current) observer.observe(rightSideRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? testimonials.length - 1 : prev - 1
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    return (
        <section className="relative w-full bg-[#2D2D2F] py-16 md:py-24 overflow-hidden">
            <div className="mx-auto max-w-6xl px-6">

                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {testimonials.map((item, index) => (
                            <div key={index} className="w-full flex-shrink-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center text-center md:text-left">

                                    <div
                                        ref={index === currentIndex ? leftSideRef : null}
                                        className="text-white flex flex-col items-center md:items-start opacity-0"
                                        style={{
                                            animationDelay: '0s',
                                            animationFillMode: 'both'
                                        }}
                                    >
                                        <p className="text-sm md:text-xl text-white/70 mb-6 max-w-md">
                                            {item.title}
                                        </p>

                                        <div className="flex flex-col items-center md:items-start gap-3">
                                            <div className="w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-500 hover:scale-110">
                                                <Image
                                                    src={item.logo}
                                                    alt={item.company}
                                                    width={100}
                                                    height={100}
                                                    className="object-contain"
                                                />
                                            </div>

                                            <p className="font-semibold">{item.company}</p>
                                        </div>
                                    </div>

                                    <div
                                        ref={index === currentIndex ? rightSideRef : null}
                                        className="text-white opacity-0"
                                        style={{
                                            animationDelay: '0.2s',
                                            animationFillMode: 'both'
                                        }}
                                    >
                                        <blockquote className="text-lg md:text-base leading-relaxed">
                                            {item.quote}
                                        </blockquote>

                                        <div className="mt-6">
                                            <p className="font-semibold">{item.clientName}</p>
                                            <p className="text-sm text-white/60">{item.role}</p>
                                            <div className="mt-3 h-1 w-10 bg-white/60 rounded-full mx-auto md:mx-0" />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

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

                {/* DOTS - Uncomment if needed */}
                {/* <div className="mt-10 flex justify-center gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/40 hover:bg-white/70'
                }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div> */}

            </div>
        </section>
    );
}