import React from 'react';

export default function StoryVisionMission() {
    return (
        <section 
            id="about" 
            className="bg-[#DFE1E4] py-16 md:py-24 px-4"
            style={{ scrollMarginTop: '100px' }}
        >
            <div className="max-w-6xl mx-auto">

                <div className="grid gap-12 md:gap-16 lg:gap-20 md:grid-cols-3 text-center">

                    {/* OUR STORY */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="h-14 flex items-center justify-center">
                            <svg
                                width="44"
                                height="42"
                                viewBox="5.137 5.637 188.725 188.725"
                                preserveAspectRatio="xMidYMid meet"
                                xmlns="http://www.w3.org/2000/svg"
                                role="presentation"
                                aria-hidden="true"
                                className="text-[#061551]"
                            >
                                <g>
                                    <path
                                        d="M149.8,80l37.8-37.8c8.3-8.3,8.3-21.9,0-30.3s-21.9-8.3-30.3,0l-37.8,37.8c-8.3,8.3-8.3,21.9,0,30.3S141.4,88.3,149.8,80z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M49.2,120l-37.8,37.8c-8.3,8.3-8.3,21.9,0,30.3s21.9,8.3,30.3,0l37.8-37.8c8.3-8.3,8.3-21.9,0-30.3S57.6,111.7,49.2,120z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M149.8,120c-8.3-8.3-21.9-8.3-30.3,0s-8.3,21.9,0,30.3l37.8,37.8c8.3,8.3,21.9,8.3,30.3,0s8.3-21.9,0-30.3L149.8,120z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M41.7,12c-8.3-8.3-21.9-8.3-30.3,0s-8.3,21.9,0,30.3L49.2,80c8.3,8.3,21.9,8.3,30.3,0s8.3-21.9,0-30.3L41.7,12z"
                                        fill="currentColor"
                                    />
                                </g>
                            </svg>
                        </div>

                        <h3 className="text-xl font-bold text-[#6587A8]">
                            Our Story
                        </h3>

                        <p className="text-[#5B5B5C] text-sm leading-relaxed max-w-xs">
                            Sales Watch was born from firsthand experience in the distribution industry. After years of struggling with limited visibility and poor accountability in sales teams, we decided to create a tool to help monitor field activities.
                        </p>
                    </div>

                    {/* OUR VISION */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="h-14 flex items-center justify-center">
                            <svg
                                width="44"
                                height="42"
                                viewBox="0 0 44 42"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-[#061551]"
                            >
                                <circle cx="22" cy="21" r="16" stroke="currentColor" strokeWidth="6" />
                            </svg>
                        </div>

                        <h3 className="text-xl font-bold text-[#6587A8]">
                            Our Vision
                        </h3>

                        <p className="text-[#5B5B5C] text-sm leading-relaxed max-w-xs">
                            To eliminate the guesswork in managing sales teams by creating a culture of visibility, accountability, and trust.
                        </p>
                    </div>

                    {/* OUR MISSION */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="h-14 flex items-center justify-center">
                            <svg
                                width="44"
                                height="42"
                                viewBox="0 0 44 42"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-[#061551]"
                            >
                                <path
                                    d="M22 8 V34 M10 21 H34"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <h3 className="text-xl font-bold text-[#6587A8]">
                            Our Mission
                        </h3>

                        <p className="text-[#5B5B5C] text-sm leading-relaxed max-w-xs">
                            Sales Watch empowers distributors with smart, lightweight tools that bring clarity and control to field sales, making performance management simple, effective, and accessible.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}