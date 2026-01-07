'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Shield, CreditCard, AlertCircle, XCircle, Scale, RefreshCw, Mail } from 'lucide-react';

export default function TermsAndConditionsSection() {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['description']));

    const toggleSection = (sectionId: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId);
        } else {
            newExpanded.add(sectionId);
        }
        setExpandedSections(newExpanded);
    };

    const sections = [
        {
            id: 'description',
            icon: FileText,
            title: 'Description of Service',
            content: (
                <p className="text-gray-700 leading-relaxed">
                    Sales Watch is a platform that allows companies to monitor the activities of field sales personnel via a mobile app and online dashboard.
                </p>
            )
        },
        {
            id: 'accounts',
            icon: Shield,
            title: 'User Accounts',
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700 mt-4">
                        Company administrator is a person/company employee who manages user access and roles.
                    </p>
                    <p className="text-gray-700 mt-4">
                        Sales rep is a person/employee who is given access only to fill in field data.
                    </p>
                    <p className="text-gray-700 mt-4">
                        You are responsible for securing login credentials and reporting unauthorized use.
                    </p>
                </div>
            )
        },
        {
            id: 'acceptable',
            icon: AlertCircle,
            title: 'Acceptable Use',
            content: (
                <div className="space-y-3">
                    <p className="text-gray-700 font-medium mb-3">You agree not to:</p>
                    <ul className="space-y-3">
                        {[
                            'Engage in unlawful or abusive behavior',
                            'Upload false or misleading data',
                            'Tamper with or reverse-engineer the system',
                            'Introduce malware or disrupt service integrity',
                            'Provide access/information related to software/applications to other parties (other companies/individuals who are not employees of the client company) without providing prior information/notification to Software System Solutions',
                            'Create/copy software/applications that are identical to Sales Watch'
                        ].map((item, index) => (
                            <li key={index} className="flex items-start gap-3 text-gray-700">
                                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        {
            id: 'ownership',
            icon: Shield,
            title: 'Data Ownership',
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                        All uploaded and collected data remains the property of the client company.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        We act as a data processor and do not claim ownership.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        By using the service, you grant us the right to store and process this data solely for providing the service.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        All data related to platform data (application data and online dashboard data) belongs to Software System Solutions.
                    </p>
                </div>
            )
        },
        {
            id: 'fees',
            icon: CreditCard,
            title: 'Fees and Payments',
            content: (
                <div className="space-y-4">
                    {[
                        'Subscription fees are communicated directly by our sales or customer success team and confirmed in writing (via email or WhatsApp).',
                        'All pricing is provided in IDR and is exclusive of applicable taxes unless otherwise stated.',
                        'Payments are due according to the schedule outlined in your service agreement or renewal confirmation.',
                        'Access to the service may be paused or limited in the event of late or non-payment with a grace period of 7 days.',
                        'Refunds are not provided unless explicitly agreed in writing or required by applicable law.',
                        'We may adjust pricing from time to time with at least 30 days’ prior notice, delivered via email or WhatsApp.',
                    ].map((item, index) => (
                        <p className="text-gray-700 leading-relaxed" key={index}>
                            {item}
                        </p>
                    ))}
                </div>
            )
        },
        {
            id: 'liability',
            icon: AlertCircle,
            title: 'Limitation of Liability',
            content: (
                <div className="space-y-3">
                    <p className="text-gray-700 font-medium mb-3">To the extent allowed by law, we are not liable for:</p>
                    <div className="space-y-3">
                        {[
                            'Indirect or consequential damages',
                            'Business loss or reputational harm',
                            'Data loss due to user error or third-party integrations',
                            'Data leaks due to errors/negligence of the client company'
                        ].map((item, index) => (
                            <p className="text-gray-700 leading-relaxed" key={index}>
                                {item}
                            </p>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'cancellation',
            icon: XCircle,
            title: 'Cancellation and Termination',
            content: (
                <div className="space-y-3">
                    {[
                        'You may cancel your subscription at any time by notifying our team in writing through official channels (email, WhatsApp, or in-app request).',
                        'Cancellation will take effect at the end of your current billing period unless otherwise agreed.',
                        'We do not provide prorated refunds for unused time unless stated in a separate agreement.',
                        'Failure to pay renewal fees by the due date may result in automatic suspension or termination of service',
                        'Upon cancellation, your access to the service will be deactivated, and your data may be deleted after 90 days, unless otherwise agreed.',
                        'We reserve the right to terminate accounts that violate these Terms or applicable laws, with or without prior notice.',
                    ].map((item, index) => (
                        <p className="text-gray-700 leading-relaxed" key={index}>
                            {item}
                        </p>
                    ))}
                </div>
            )
        },
        {
            id: 'law',
            icon: Scale,
            title: 'Governing Law',
            content: (
                <p className="text-gray-700 leading-relaxed">
                    These terms are governed by the laws of the Republic of Indonesia. Disputes will be resolved by selecting the legal domicile of the Surabaya District Court.
                </p>
            )
        },
        {
            id: 'updates',
            icon: RefreshCw,
            title: 'Updates to This Policy',
            content: (
                <p className="text-gray-700 leading-relaxed">
                    We may revise our Terms and Conditions. Updates will be published on our website or app with a new effective date. Last updated on 01/10/2025.
                </p>
            )
        },
        {
            id: 'contact',
            icon: Mail,
            title: 'Contact',
            content: (
                <div className="">
                    <p className="text-gray-700 mb-3">If you have questions or concerns:</p>
                    <a
                        href="mailto:support@saleswatch.id"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors"
                    >
                        <Mail className="w-5 h-5" />
                        support@saleswatch.id
                    </a>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Sections */}
                <div className="space-y-4">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isExpanded = expandedSections.has(section.id);

                        return (
                            <div
                                key={section.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 animate__animated animate__fadeInUp"
                            >
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#061551] rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {section.title}
                                        </h2>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {isExpanded ? (
                                            <ChevronUp className="w-6 h-6 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="px-6 pb-6 pt-2 animate-fadeIn">
                                        <div className="pl-16">
                                            {section.content}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};