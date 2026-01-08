'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Database, MapPin, Users, FileText, Scale, Share2, Lock, Shield, RefreshCw, Mail } from 'lucide-react';

export default function PrivacyPolicySection() {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['introduction']));

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
            id: 'introduction',
            icon: FileText,
            title: 'Introduction',
            content: (
                <p className="text-gray-700 leading-relaxed">
                    Software System Solutions ("we", "our", "us") provides a web-based and Android application used by companies to monitor and manage field sales representatives (Sales Watch). This Privacy Policy (01/10/2025) explains how we collect, use, share, and protect personal data in accordance with Indonesia's Personal Data Protection Law (Law No. 27 of 2022 on Personal Data Protection) and other applicable laws in Indonesia.
                </p>
            )
        },
        {
            id: 'information',
            icon: Database,
            title: 'Information We Collect',
            content: (
                <div className="space-y-4">
                    <div>
                        <p className="text-gray-900 font-semibold mb-2">Sales Representative Data:</p>
                        <ul className="space-y-2 ml-4">
                            {[
                                'GPS location (live and historical)',
                                'Photos captured during store visits',
                                'Time and date of visits',
                                'Device information (model, OS version, etc.)',
                                'And other information as specified on the Play Store privacy policy'
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="text-gray-900 font-semibold mb-2">Client Admin Data:</p>
                        <ul className="space-y-2 ml-4">
                            {[
                                'Names and contact details',
                                'Uploaded store lists and visit schedules'
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="text-gray-900 font-semibold mb-2">Automatically Collected Data:</p>
                        <ul className="space-y-2 ml-4">
                            {[
                                'IP addresses and access logs',
                                'Device/browser metadata',
                                'Usage and performance statistics'
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: 'usage',
            icon: MapPin,
            title: 'How We Use Data',
            content: (
                <div className="space-y-3">
                    <p className="text-gray-700 mb-3">We use this information to:</p>
                    <ul className="space-y-2 ml-4">
                        {[
                            'Track field team presence and schedule compliance',
                            'Provide reports and insights to client companies',
                            'Improve system performance and user experience',
                            'Comply with applicable legal requirements'
                        ].map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        {
            id: 'legal',
            icon: Scale,
            title: 'Legal Basis for Processing',
            content: (
                <div className="space-y-3">
                    <p className="text-gray-700 mb-3">Our processing is based on:</p>
                    <ul className="space-y-2 ml-4">
                        {[
                            'Consent (where applicable)',
                            'Contractual obligations',
                            'Legal compliance',
                            'Legitimate business interests'
                        ].map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        {
            id: 'sharing',
            icon: Share2,
            title: 'Data Sharing',
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed font-semibold">
                        We do not sell your personal data.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        We may share data with:
                    </p>
                    <ul className="space-y-2 ml-4">
                        {[
                            'Your employer or client company',
                            'Trusted service providers (e.g., cloud infrastructure) with prior client approval',
                            'Government or regulatory agencies, when legally required'
                        ].map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        {
            id: 'retention',
            icon: Lock,
            title: 'Data Retention and Security',
            content: (
                <div className="space-y-3">
                    <p className="text-gray-700 leading-relaxed">
                        We retain data only as long as necessary for the purposes outlined above.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        We implement technical and organizational measures to ensure data security.
                    </p>
                </div>
            )
        },
        {
            id: 'rights',
            icon: Shield,
            title: 'Your Rights',
            content: (
                <div className="space-y-3">
                    <p className="text-gray-700 mb-3">In accordance with Indonesian law, you have the right to:</p>
                    <ul className="space-y-2 ml-4">
                        {[
                            'Access or correct your personal data',
                            'Withdraw consent (where applicable)',
                            'Request deletion of your data',
                            'File complaints with data protection authorities',
                            'Give opinion/input regarding software/applications'
                        ].map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        {
            id: 'international',
            icon: Users,
            title: 'International Data Transfers',
            content: (
                <p className="text-gray-700 leading-relaxed">
                    If data is transferred outside Indonesia, we ensure it is protected in compliance with relevant data transfer regulations.
                </p>
            )
        },
        {
            id: 'updates',
            icon: RefreshCw,
            title: 'Updates to This Policy',
            content: (
                <p className="text-gray-700 leading-relaxed">
                    We may revise this Privacy Policy. Updates will be published on our website or app with a new effective date.
                </p>
            )
        },
        {
            id: 'contact',
            icon: Mail,
            title: 'Contact Us',
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
        <div className="min-h-screen bg-gray-50">
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
}