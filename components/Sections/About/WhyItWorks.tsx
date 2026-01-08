'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CustomButton from '@/components/button/button';

export default function WhyItWorks() {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const fraudPreventionRef = useRef<HTMLDivElement>(null);
    const performanceInsightsRef = useRef<HTMLDivElement>(null);
    const fieldCompanionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
        if (fraudPreventionRef.current) observer.observe(fraudPreventionRef.current);
        if (performanceInsightsRef.current) observer.observe(performanceInsightsRef.current);
        if (fieldCompanionRef.current) observer.observe(fieldCompanionRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <section className="bg-[#f2f7ff] py-16 md:py-24 px-6">
            <div className="max-w-6xl mx-auto space-y-24">
                <h2
                    ref={titleRef}
                    className="text-center text-4xl sm:text-5xl md:text-6xl font-bold text-[#2f2e2e] opacity-0"
                >
                    Why It Works
                </h2>

                {/* Fraud Prevention Section */}
                <div
                    ref={fraudPreventionRef}
                    className="grid md:grid-cols-2 gap-10 items-center opacity-0"
                >
                    <div className="flex justify-center md:justify-end -mt-14 md:mt-0">
                        <Image src="/img/undraw_my-current-location_tudq_edited_e.avif" alt="Fraud Prevention Illustration" width={320} height={320} className="w-[240px] sm:w-[280px] md:w-[320px] h-auto" />
                    </div>

                    <div className="text-left max-w-[450px] mx-auto md:mx-0">
                        <h3 className="text-3xl md:text-4xl font-bold text-[#2f2e2e] mb-6">Fraud Prevention</h3>
                        <p className="text-[#5B5B5C] leading-relaxed mb-6">Our system is equipped with multiple preventive measures to ensure reliable reporting and full accountability.</p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#4A6FA5] flex items-center justify-center flex-shrink-0">
                                    <svg className="w- h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-[#5B5B5C] text-sm md:text-base">GPS-verified location tracking for every field visit</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#4A6FA5] flex items-center justify-center flex-shrink-0">
                                    <svg className="w- h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-[#5B5B5C] text-sm md:text-base">Automated timestamp validation to prevent backdating</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#4A6FA5] flex items-center justify-center flex-shrink-0">
                                    <svg className="w- h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-[#5B5B5C] text-sm md:text-base">Photo verification with geo-tagging for proof of visit</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#4A6FA5] flex items-center justify-center flex-shrink-0">
                                    <svg className="w- h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-[#5B5B5C] text-sm md:text-base">Real-time anomaly detection to flag suspicious patterns</p>
                            </div>
                        </div>

                        <div className="flex justify-center md:justify-start">
                            <Link href="/features">
                                <CustomButton size="lg" className="mt-3">
                                    Explore Features
                                </CustomButton>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Performance Insights Section */}
                <div
                    ref={performanceInsightsRef}
                    className="grid md:grid-cols-2 gap-10 items-center opacity-0"
                >
                    <div className="flex justify-center md:justify-start md:order-2 -mt-12 md:mt-0">
                        <Image src="/img/undraw_algorithm-execution_rksm_edited_p.avif" alt="Performance insights illustration" width={340} height={340} className="w-[260px] sm:w-[300px] md:w-[340px] h-auto" />
                    </div>

                    <div className="text-left max-w-[450px] mx-auto md:mx-0 md:justify-self-end pe-0 md:pe-10">
                        <h3 className="text-3xl md:text-4xl font-bold text-[#2f2e2e] mb-6">Performance Insights</h3>
                        <p className="text-[#5B5B5C] leading-relaxed mb-6">Gain actionable insights into sales performance and optimize strategies to scale efficiently.</p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#4A6FA5] flex items-center justify-center flex-shrink-0">
                                    <svg className="w- h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-[#5B5B5C] text-sm md:text-base">Track individual and team KPIs with visual dashboards</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#4A6FA5] flex items-center justify-center flex-shrink-0">
                                    <svg className="w- h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-[#5B5B5C] text-sm md:text-base">Identify training gaps and improvement opportunities</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#4A6FA5] flex items-center justify-center flex-shrink-0">
                                    <svg className="w- h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-[#5B5B5C] text-sm md:text-base">Compare performance across regions and territories</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#4A6FA5] flex items-center justify-center flex-shrink-0">
                                    <svg className="w- h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-[#5B5B5C] text-sm md:text-base">Generate custom reports for strategic decision-making</p>
                            </div>
                        </div>

                        <div className="flex justify-center md:justify-start">
                            <Link href="/features">
                                <CustomButton size="lg" className="mt-3">
                                    Explore Features
                                </CustomButton>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Field Companion App Section */}
                <div
                    ref={fieldCompanionRef}
                    className="grid md:grid-cols-2 gap-10 items-center opacity-0"
                >
                    <div className="flex justify-center md:justify-end -mt-14 md:mt-0 mr-0 md:mr-10">
                        <Image src="/img/image-qr.avif" alt="QR Code for Field Companion App" width={340} height={340} className="w-[260px] sm:w-[300px] md:w-[340px] h-auto rounded-xl bg-[#DFE1E4] p-2 md:p-4" />
                    </div>

                    <div className="text-left max-w-[450px] mx-auto md:mx-0">
                        <h3 className="text-3xl md:text-4xl font-bold text-[#2f2e2e] mb-6">Check Out Our Field Companion App</h3>
                        <p className="text-[#5B5B5C] leading-relaxed mb-6">Get real-time insights and seamless field tracking with our companion app— built to support teams wherever they work.</p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#4A6FA5] flex items-center justify-center flex-shrink-0">
                                    <svg className="w- h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-[#5B5B5C] text-sm md:text-base">Available on iOS & Android platforms</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#4A6FA5] flex items-center justify-center flex-shrink-0">
                                    <svg className="w- h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-[#5B5B5C] text-sm md:text-base">Works offline with automatic sync when connected</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#4A6FA5] flex items-center justify-center flex-shrink-0">
                                    <svg className="w- h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-[#5B5B5C] text-sm md:text-base">Quick setup with intuitive user interface</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#4A6FA5] flex items-center justify-center flex-shrink-0">
                                    <svg className="w- h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-[#5B5B5C] text-sm md:text-base">Scan QR code to download now</p>
                            </div>
                        </div>

                        <div className="flex justify-center md:justify-start">
                            <Link href="/features">
                                <CustomButton size="lg" className="mt-3">
                                    Explore Features
                                </CustomButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}