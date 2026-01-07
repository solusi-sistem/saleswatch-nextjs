'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import CustomButton from '@/components/button/button';

interface ScheduleDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleDemoModal({ isOpen, onClose }: ScheduleDemoModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPersonName: '',
    companySize: '',
    whatsapp: '',
    industry: '',
    message: '',
  });

  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      setIsClosing(false); // Reset closing state when opening
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Match dengan duration animasi
  };

  const handleSubmit = () => {
    if (!formData.companyName || !formData.contactPersonName || !formData.companySize || !formData.whatsapp || !formData.industry) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('Form submitted:', formData);

    setFormData({
      companyName: '',
      contactPersonName: '',
      companySize: '',
      whatsapp: '',
      industry: '',
      message: '',
    });
    handleClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isClosing ? 'bg-black/0' : 'bg-black/50'
      } backdrop-blur-sm`}
      style={{
        animation: isClosing ? 'fadeOut 0.3s ease-out' : 'fadeIn 0.3s ease-out'
      }}
      onClick={handleClose}
    >
      <div 
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{
          animation: isClosing 
            ? 'modalSlideOut 0.3s ease-out' 
            : 'modalSlideIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-[#061551]">Schedule a Demo</h2>
          <button 
            onClick={handleClose} 
            className="p-1 hover:bg-gray-100 rounded-full transition-all duration-200 hover:rotate-90" 
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <label htmlFor="companyName" className="block text-sm font-medium text-[#061551]">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6587A8] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
              <label htmlFor="contactPersonName" className="block text-sm font-medium text-[#061551]">
                Contact Person Name <span className="text-red-500">*</span>
              </label>
              <input
                id="contactPersonName"
                type="text"
                placeholder="Enter your full name"
                value={formData.contactPersonName}
                onChange={(e) => handleChange('contactPersonName', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6587A8] focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <label htmlFor="companySize" className="block text-sm font-medium text-[#061551]">
                Company Size <span className="text-red-500">*</span>
              </label>
              <select
                id="companySize"
                value={formData.companySize}
                onChange={(e) => handleChange('companySize', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6587A8] focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>

            <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-[#061551]">
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <input
                id="whatsapp"
                type="tel"
                placeholder="+62 812 3456 7890"
                value={formData.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6587A8] focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <label htmlFor="industry" className="block text-sm font-medium text-[#061551]">
              Industry <span className="text-red-500">*</span>
            </label>
            <select
              id="industry"
              value={formData.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6587A8] focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="">Select your industry</option>
              <option value="fmcg">FMCG</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="healthcare">Healthcare</option>
              <option value="technology">Technology</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.35s', animationFillMode: 'both' }}>
            <label htmlFor="message" className="block text-sm font-medium text-[#061551]">
              What would you like to know?
            </label>
            <textarea
              id="message"
              placeholder="Tell us about your requirements or questions..."
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6587A8] focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          <div className="pt-2 animate-fadeInUp" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <CustomButton size="lg" onClick={handleSubmit} className="mt-3 w-full">
              Schedule Demo
            </CustomButton>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes modalSlideOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}