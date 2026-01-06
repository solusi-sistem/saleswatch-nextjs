'use client';

import React from 'react';
import Link from 'next/link';

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#43C38A] flex-shrink-0">
    <path
      d="M12.2442 0.289465L5.02298 7.10457L2.68046 4.6782C1.1639 3.21126 -0.947636 5.40321 0.466273 6.97165L3.86805 10.4952C4.57501 11.1719 5.52228 11.1284 6.08225 10.4952L13.7211 1.81682C14.5914 0.787306 13.2358 -0.611965 12.2465 0.289465H12.2442Z"
      fill="currentColor"
    />
  </svg>
);

export default function PricingSection() {
  const plans = [
    { name: 'LITE', popular: false, bg: 'bg-white', border: 'border-gray-200' },
    { name: 'STARTER', popular: false, bg: 'bg-white', border: 'border-gray-200' },
    {
      name: 'STANDARD',
      popular: true,
      bg: 'bg-[#F0F7FF]',
      border: 'border-[#6587A8]',
    },
    { name: 'PLUS', popular: false, bg: 'bg-white', border: 'border-gray-200' },
  ];

  const rows = [
    {
      no: '1',
      feature: 'Harga Per User',
      values: ['Mulai dari Rp 30.000 / bulan', '[Hubungi Sales]', '[Hubungi Sales]', '[Hubungi Sales]'],
    },
    {
      no: '2',
      feature: 'Setup Fee (Sekali Bayar)',
      values: ['Rp 1.000.000', '[Hubungi Sales]', '[Hubungi Sales]', '[Hubungi Sales]'],
    },
    {
      no: '3',
      feature: 'Fitur Utama',
      values: [
        `- Basic GPS Tracking
- Selfie Check-in
- Offline Mode
- Basic Report
- Data Retention 6 Bulan
- Admin Gratis 2 User`,
        `- Semua fitur LITE
- Visit Planning
- Dashboard Analytics
- Multimedia Evidence
- Data Retention 1 Tahun
- Admin Gratis 5 User`,
        `- Semua fitur STARTER
- Smart Location Validation
- Fraud Alert
- Delivery Tracking
- Priority Support
- Data Retention 2 Tahun
- Admin Gratis 10 User`,
        `- Semua fitur STANDARD
- HQ Dashboard
- SKU Monitoring
- Gratis Flex User
- API Access
- Data Retention 3 Tahun
- Admin Gratis 20 User`,
      ],
    },
    {
      no: '4',
      feature: 'Flex User',
      values: ['Add On Berbayar', 'Add On Berbayar', 'Add On Berbayar', 'Included (Gratis)'],
    },
  ];

  // Render fitur dalam format list
  const renderFeatureValue = (value: string, isFlex = false) => {
    const lines = value.split('\n');
    return (
      <div className="space-y-1.5">
        {lines.map((line, i) => {
          const isItem = line.trim().startsWith('-');
          const text = isItem ? line.trim().substring(1).trim() : line.trim();

          let textColor = '';
          if (isFlex) {
            textColor = value.includes('Gratis') ? 'text-[#43C38A] font-medium' : 'text-[#E06565] font-medium';
          }

          return (
            <div key={i} className="flex items-start gap-2">
              {isItem && <CheckIcon />}
              <span className={textColor}>{text}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <main className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* ================= DESKTOP: TABEL ================= */}
        <div className="hidden lg:block max-w-7xl mx-auto overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="py-5 px-4 bg-gray-100 sticky left-0 z-20 text-center font-semibold">No</th>
                <th className="py-5 px-4 bg-gray-100 min-w-[240px] text-center font-semibold">Fitur & Benefit</th>
                {plans.map((plan) => (
                  <th key={plan.name} className={`py-5 px-4 min-w-[180px] text-center ${plan.bg} ${plan.border} relative`}>
                    {plan.popular && <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#6587A8] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">MOST POPULAR</span>}
                    <h3 className="font-bold text-lg text-[#061551] mb-3">{plan.name}</h3>
                    <Link href="/demo" className="inline-block w-full py-2 bg-[#6587A8] hover:bg-[#CFE3C0] hover:text-[#6587A8] text-white font-medium rounded-md transition text-sm">
                      Contact Sales
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-4 px-4 sticky left-0 bg-inherit z-10 font-medium border-r text-center">{row.no}</td>
                  <td className="py-4 px-4 font-medium text-gray-800 text-center">{row.feature}</td>
                  {row.values.map((value, planIdx) => (
                    <td key={planIdx} className={`py-4 px-4 align-top text-sm ${plans[planIdx].bg} ${plans[planIdx].border} text-center`}>
                      {row.no === '4' ? renderFeatureValue(value, true) : renderFeatureValue(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE: CARD PER PAKET ================= */}
        <div className="lg:hidden max-w-2xl mx-auto space-y-6">
          {plans.map((plan, planIdx) => (
            <div key={plan.name} className={`rounded-xl border ${plan.border} ${plan.bg} overflow-hidden shadow-sm`}>
              {/* Header Card */}
              <div className="p-5 text-center border-b border-gray-200">
                {plan.popular && <span className="inline-block bg-[#6587A8] text-white text-xs font-bold px-3 py-1 rounded-full mb-2">MOST POPULAR</span>}
                <h3 className="font-bold text-lg text-[#061551]">{plan.name}</h3>
                <Link href="/demo" className="mt-3 inline-block w-full py-2 bg-[#6587A8] hover:bg-[#CFE3C0] hover:text-[#6587A8] text-white font-medium rounded-md transition text-sm">
                  Contact Sales
                </Link>
              </div>

              {/* Fitur List */}
              <div className="p-5 space-y-4">
                {rows.map((row, rowIdx) => (
                  <div key={row.no} className="space-y-1">
                    <div className="font-medium text-gray-800">{row.feature}</div>
                    <div className="text-sm text-gray-700">{row.no === '4' ? renderFeatureValue(row.values[planIdx], true) : renderFeatureValue(row.values[planIdx])}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-gray-600">Butuh bantuan memilih paket? Hubungi tim kami untuk konsultasi gratis.</div>
      </main>
    </>
  );
}
