'use client';

import { useState } from 'react';

const Faq = () => {
  const faqContent = [
    {
      id: 1,
      title: 'About Software System Solutions',
      content: 'SSS was founded to drive innovation and develop local Indonesian tech talent, helping prevent brain drain and build a strong, sustainable technology ecosystem.',
    },
    {
      id: 2,
      title: 'What Is Sales Watch and Who Is It For?',
      content:
        'Sales Watch is a field work visibility and fraud prevention tool developed by Software System Solutions (SSS). It is designed for distributors and companies that rely on sales representatives in the field, helping supervisors gain better visibility, improve accountability, and protect revenue.',
    },
    {
      id: 3,
      title: 'How Do I Join Sales Watch?',
      content:
        'To get started, your company can contact us to request a demo or trial setup. Once registered, we will provide your company with admin credentials along with our onboarding material. From there, Admins can set up users, add stores, and assign schedules for sales representatives.',
    },
  ];

  const [openId, setOpenId] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-24 px-6 md:px-10 bg-gray-50 overflow-hidden relative">
      {/* Konten Utama Container */}
      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Kolom Kiri: Teks & Accordion */}
          <div className="relative z-10">
            {/* 1. Badge FAQs - Sekarang sejajar di kiri atas judul */}
            <div className="mb-6 inline-flex">
              {/* Layer Luar: Memberikan warna gradasi */}
              <div className="p-[2px] rounded-full bg-gradient-to-r from-[#061551] to-[#10b981]">
                {/* Layer Dalam: Memberikan background putih dan ruang teks */}
                <div className="bg-white rounded-full px-5 py-1 flex items-center justify-center">
                  <span className="text-sm md:text-base  text-[#061551]">FAQs</span>
                </div>
              </div>
            </div>

            {/* 2. Judul & Deskripsi */}
            <h2 className="text-4xl md:text-5xl font-bold text-[#061551] mb-6 leading-tight">Frequently Asked Questions</h2>
            <p className="text-gray-600 mb-10 text-lg max-w-lg">Highlight the most important features and functionalities of the app. Use concise descriptions to emphasize what sets your app apart.</p>

            {/* 3. Accordion List */}
            <div className="space-y-4">
              {faqContent.map((item) => (
                <div key={item.id} className={`border rounded-xl overflow-hidden transition-all duration-300 ${openId === item.id ? 'border-[#061551] bg-white shadow-xl scale-[1.02]' : 'border-gray-200 bg-white/60 hover:bg-white'}`}>
                  <button onClick={() => toggleItem(item.id)} className="w-full px-6 py-5 text-left flex justify-between items-center transition">
                    <span className={`font-bold transition-colors ${openId === item.id ? 'text-[#061551]' : 'text-gray-800'}`}>{item.title}</span>

                    <span className={`text-2xl font-bold transition-all duration-300 ${openId === item.id ? 'text-[#061551]' : 'text-gray-400'}`}>{openId === item.id ? '–' : '+'}</span>
                  </button>

                  <div className={`px-6 transition-all duration-300 ease-in-out ${openId === item.id ? 'max-h-60 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-gray-600 leading-relaxed border-t pt-4">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tetap Absolute terhadap Container agar tidak lari saat zoom-out */}
          <div className="absolute -right-20 lg:-right-18 top-1/2 -translate-y-1/2 w-[50%] max-w-xl hidden lg:block pointer-events-none z-0">
            <img src="/img/deviceframes3.png" alt="Mobile App Screens" className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] transition-transform duration-700 hover:scale-105" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
