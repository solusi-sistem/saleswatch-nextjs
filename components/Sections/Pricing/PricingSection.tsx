'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getSectionData } from '@/hooks/getSectionData';
import { PricingContent } from '@/types/section';
import ScheduleDemoModal from '@/components/modals/ScheduleDemoModal';

// Type definition for language
type BlogLocale = 'en' | 'id';

const isValidLanguage = (lang: string): lang is BlogLocale => {
  return lang === 'en' || lang === 'id';
};

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#43C38A] flex-shrink-0">
    <path
      d="M12.2442 0.289465L5.02298 7.10457L2.68046 4.6782C1.1639 3.21126 -0.947636 5.40321 0.466273 6.97165L3.86805 10.4952C4.57501 11.1719 5.52228 11.1284 6.08225 10.4952L13.7211 1.81682C14.5914 0.787306 13.2358 -0.611965 12.2465 0.289465H12.2442Z"
      fill="currentColor"
    />
  </svg>
);

interface PricingSectionProps {
  id?: string;
}

export default function PricingSection({ id }: PricingSectionProps) {
  const pathname = usePathname();
  const languageString = pathname.startsWith('/id') ? 'id' : 'en';
  const currentLang: BlogLocale = isValidLanguage(languageString) ? languageString : 'en';

  const [content, setContent] = useState<PricingContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data dari Sanity
  useEffect(() => {
    async function fetchContent() {
      if (!id) return;

      try {
        setLoading(true);
        const sectionData = await getSectionData(id);
        if (sectionData?.pricing_content) {
          setContent(sectionData.pricing_content);
        }
      } catch (error) {
        console.error('Error fetching pricing content:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#f2f7ff] py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  if (!content || !content.pricing_plans || content.pricing_plans.length === 0) {
    return null;
  }

  const plans = content.pricing_plans.filter((p) => p.status === 'active');
  const footerNote = content.footer_note;

  // Render text biasa tanpa centang (untuk Price & Setup Fee)
  const renderPlainText = (value: string) => {
    const lines = value.split('\n').filter((line) => line.trim());
    
    return (
      <div className="space-y-1">
        {lines.map((line, i) => (
          <div key={i}>
            <span>{line.trim()}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render Flex User dengan warna (tanpa centang)
  const renderFlexUser = (value: string) => {
    const text = value.trim();
    const textColor = text.toLowerCase().includes('gratis') || text.toLowerCase().includes('free') || text.toLowerCase().includes('included')
      ? 'text-[#43C38A] font-medium'
      : 'text-[#E06565] font-medium';

    return <span className={textColor}>{text}</span>;
  };

  const renderFeatureArray = (features: string[]) => {
    return (
      <div className="space-y-1.5">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckIcon />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <main className="bg-[#f2f7ff] py-12 px-4 sm:px-6 lg:px-8">
        {/* ================= DESKTOP: TABEL ================= */}
        <div className="hidden lg:block max-w-7xl mx-auto overflow-x-auto">
          <table className="min-w-full border-collapse border-spacing-0">
            <thead>
              <tr>
                <th className="py-5 px-4 bg-gray-100 min-w-[240px] text-center font-semibold">
                  {content.table_headers?.feature_column?.[currentLang] || 'Fitur & Benefit'}
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan._id}
                    className={`py-5 px-4 min-w-[180px] text-center ${plan.is_popular ? 'bg-[#f2f7ff]' : plan.styling.background_color} relative`}
                  >
                    {plan.is_popular && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#061551] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        MOST POPULAR
                      </span>
                    )}
                    <h3 className="font-bold text-lg mb-3 text-[#061551]">{plan.plan_name}</h3>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-block w-full py-2 font-medium rounded-md transition text-sm bg-[#6587A8] text-white hover:bg-[#CFE3C0] hover:text-[#6587A8]"
                    >
                      {currentLang === 'id' ? plan.cta_button.text_id : plan.cta_button.text_en}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Harga Per User */}
              <tr>
                <td className="py-4 px-4 font-medium text-gray-800 text-center bg-white">Harga Per User</td>
                {plans.map((plan) => (
                  <td
                    key={plan._id}
                    className={`py-4 px-4 align-top text-sm text-left ${
                      plan.is_popular ? 'bg-[#f2f7ff] text-gray-700' : `${plan.styling.background_color} text-gray-700`
                    }`}
                  >
                    {renderPlainText(currentLang === 'id' ? plan.price.id : plan.price.en)}
                  </td>
                ))}
              </tr>

              {/* Setup Fee */}
              <tr>
                <td className="py-4 px-4 font-medium text-gray-800 text-center bg-gray-50">Setup Fee (Sekali Bayar)</td>
                {plans.map((plan) => (
                  <td
                    key={plan._id}
                    className={`py-4 px-4 align-top text-sm text-left ${
                      plan.is_popular ? 'bg-[#f2f7ff] text-gray-700' : `${plan.styling.background_color} text-gray-700`
                    }`}
                  >
                    {renderPlainText(currentLang === 'id' ? plan.setup_fee.id : plan.setup_fee.en)}
                  </td>
                ))}
              </tr>

              {/* Fitur Utama */}
              <tr>
                <td className="py-4 px-4 font-medium text-gray-800 text-center bg-white">Fitur Utama</td>
                {plans.map((plan) => (
                  <td
                    key={plan._id}
                    className={`py-4 px-4 align-top text-sm text-left ${
                      plan.is_popular ? 'bg-[#f2f7ff] text-gray-700' : `${plan.styling.background_color} text-gray-700`
                    }`}
                  >
                    {renderFeatureArray(currentLang === 'id' ? plan.main_features.id : plan.main_features.en)}
                  </td>
                ))}
              </tr>

              {/* Flex User */}
              <tr>
                <td className="py-4 px-4 font-medium text-gray-800 text-center bg-gray-50">Flex User</td>
                {plans.map((plan) => (
                  <td
                    key={plan._id}
                    className={`py-4 px-4 align-top text-sm text-left ${
                      plan.is_popular ? 'bg-[#f2f7ff] text-gray-700' : `${plan.styling.background_color} text-gray-700`
                    }`}
                  >
                    {renderFlexUser(currentLang === 'id' ? plan.flex_user.id : plan.flex_user.en)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE: CARD PER PAKET ================= */}
        <div className="lg:hidden max-w-2xl mx-auto space-y-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`rounded-xl border ${plan.styling.border_color} overflow-hidden shadow-sm ${
                plan.is_popular ? 'bg-[#f2f7ff]' : plan.styling.background_color
              }`}
            >
              {/* Header Card */}
              <div className={`p-5 text-center border-b ${plan.is_popular ? 'border-gray-200' : 'border-gray-200'}`}>
                {plan.is_popular && (
                  <span className="inline-block bg-[#061551] text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="font-bold text-lg text-[#061551]">{plan.plan_name}</h3>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-3 inline-block w-full py-2 font-medium rounded-md transition text-sm bg-[#6587A8] text-white hover:bg-[#CFE3C0] hover:text-[#6587A8]"
                >
                  {currentLang === 'id' ? plan.cta_button.text_id : plan.cta_button.text_en}
                </button>
              </div>

              {/* Fitur List */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <div className="font-medium text-gray-800">Harga Per User</div>
                  <div className="text-sm text-gray-700">
                    {renderPlainText(currentLang === 'id' ? plan.price.id : plan.price.en)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-medium text-gray-800">Setup Fee (Sekali Bayar)</div>
                  <div className="text-sm text-gray-700">
                    {renderPlainText(currentLang === 'id' ? plan.setup_fee.id : plan.setup_fee.en)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-medium text-gray-800">Fitur Utama</div>
                  <div className="text-sm text-gray-700">
                    {renderFeatureArray(currentLang === 'id' ? plan.main_features.id : plan.main_features.en)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-medium text-gray-800">Flex User</div>
                  <div className="text-sm text-gray-700">
                    {renderFlexUser(currentLang === 'id' ? plan.flex_user.id : plan.flex_user.en)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        {footerNote && (
          <div className="mt-12 text-center text-gray-600">
            {currentLang === 'id' ? footerNote.id : footerNote.en}
          </div>
        )}
      </main>

      {/* Schedule Demo Modal */}
      <ScheduleDemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}