"use client";

import { useState } from "react";

export default function FaqSection() {
    const [activeTab, setActiveTab] = useState<"company" | "security" | "other">("company");
    const [openFAQs, setOpenFAQs] = useState<Record<string, boolean>>({});

    const faqs = {
        company: [
            {
                id: "1",
                question: "About Software System Solutions",
                answer:
                    "Our founder started Software System Solutions (SSS) with a strong commitment to fostering innovation and talent within Indonesia. The goal was to spark a movement of local tech development that drives progress while helping to retain the country’s brightest minds, this to prevent brain drain and nurture a thriving tech ecosystem that Indonesia can be proud of. SSS is an innovative tech startup focused on solving real world business challenges. We build intuitive, scalable, and secure tools that simplify business operations and improve productivity. Our development team is passionate about creating practical solutions that help businesses stay ahead in an increasingly digital world. With Sales Watch, we bring this vision to life—empowering distributors with visibility, accountability, and fraud prevention in the field.",
            },
            {
                id: "2",
                question: "What Is Sales Watch and Who Is It For?",
                answer:
                    "Sales Watch is a field work visibility and fraud prevention tool developed by Software System Solutions (SSS). It is designed for distributors and companies that rely on sales representatives in the field, helping supervisors gain better visibility, improve accountability, and protect revenue.",
            },
            {
                id: "3",
                question: "How Do I Join Sales Watch?",
                answer:
                    "To get started, your company can contact us to request a demo or trial setup. Once registered, we will provide your company with admin credentials along with our onboarding material.<br /><br />Sales Watch is offered as a subscription service. Pricing is based on the number of users. For more details, please reach out to our team.",
            },
        ],
        security: [
            {
                id: "4",
                question: "Is My Data Secure with Sales Watch?",
                answer:
                    "Absolutely. We use end-to-end encryption, role-based access control, and regular third-party security audits to ensure your data remains confidential and protected at all times.",
            },
            {
                id: "5",
                question: "Do You Comply with GDPR or Local Data Regulations?",
                answer:
                    "Yes. Sales Watch complies with international standards including GDPR, as well as local regulations such as Indonesia’s PDP Law.",
            },
            {
                id: "6",
                question: "Can I Control Who Sees My Team’s Data?",
                answer:
                    "Yes. Administrators can assign roles and permissions to users, allowing granular control over which data each team member can view or edit.",
            },
        ],
        other: [
            {
                id: "7",
                question: "What Devices Are Supported?",
                answer:
                    "Sales Watch works on Android smartphones and tablets. iOS support is planned. Web dashboard is accessible via modern browsers.",
            },
            {
                id: "8",
                question: "How Much Does Sales Watch Cost?",
                answer:
                    "Pricing is based on the number of active users and required features. Contact our sales team for a custom quote.",
            },
            {
                id: "9",
                question: "Do You Offer Training and Onboarding?",
                answer:
                    "Yes. We provide live onboarding sessions, video tutorials, and documentation.",
            },
        ],
    };

    const toggleFAQ = (id: string) => {
        setOpenFAQs((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const currentFAQs = faqs[activeTab];

    return (
        <>

            <main className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 pt-30 pb-16">
                    {/* Title */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#061551] leading-tight animate__animated animate__fadeInUp">
                            Frequently Asked Questions
                        </h1>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto animate__animated animate__fadeInUp">
                            Find answers about Sales Watch, security, pricing, and onboarding.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="max-w-4xl mx-auto mb-10 border-b border-gray-200">
                        <div className="flex gap-6 overflow-x-auto justify-start sm:justify-center pb-2">
                            {[
                                { key: "company", label: "About Company" },
                                { key: "security", label: "Security" },
                                { key: "other", label: "Other FAQs" },
                            ].map((tab, index) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as any)}
                                    className={`whitespace-nowrap pb-3 text-sm sm:text-base font-medium transition animate__animated animate__fadeInUp ${activeTab === tab.key
                                        ? "border-b-2 border-[#061551] text-[#061551]"
                                        : "text-gray-500 hover:text-[#061551]"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FAQ List */}
                    <div className="max-w-4xl mx-auto space-y-4">
                        {currentFAQs.map((faq, index) => (
                            <div
                                key={faq.id}
                                className={`border border-gray-200 rounded-xl bg-white shadow-sm animate__animated animate__fadeInUp`}
                            >
                                <button
                                    className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                                    onClick={() => toggleFAQ(faq.id)}
                                    aria-expanded={openFAQs[faq.id]}
                                >
                                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                                        {faq.question}
                                    </h3>
                                    <span className="text-[#061551] text-xl font-semibold">
                                        {openFAQs[faq.id] ? "−" : "+"}
                                    </span>
                                </button>

                                {openFAQs[faq.id] && (
                                    <div className="px-5 pb-5 text-gray-600 text-sm sm:text-base border-t border-gray-100">
                                        <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Support CTA */}
                    <div className="mt-16 text-center text-gray-600 text-sm sm:text-base animate__animated animate__fadeInUp">
                        Already a customer? Visit our{" "}
                        <a href="/support" className="text-[#061551] underline font-medium">
                            Support Center
                        </a>{" "}
                        for setup and troubleshooting.
                    </div>
                </div>
            </main>

        </>
    );
}
