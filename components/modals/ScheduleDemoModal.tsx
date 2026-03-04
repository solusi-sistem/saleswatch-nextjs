"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import CustomButton from "@/components/button/button";
import Toast from "@/components/ui/Toast";
import { useListOptions } from "@/contexts/ListOptionsContext";
import type { LangKey } from "@/types";

interface ScheduleDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

const translations = {
  "": {
    title: "Schedule a Demo",
    closeAriaLabel: "Close modal",
    companyName: "Company Name",
    contactPersonName: "Contact Person Name",
    companySize: "Company Size",
    whatsapp: "WhatsApp Number",
    industry: "Industry",
    message: "What would you like to know?",
    required: "Please fill in all required fields",
    successMessage: "Demo request successfully sent! Our team will contact you soon.",
    errorMessage: "Failed to send demo request. Please try again.",
    genericError: "An error occurred. Please try again later.",
    placeholderCompanyName: "Enter your company name",
    placeholderContactName: "Enter your full name",
    placeholderWhatsapp: "+62 812 3456 7890",
    placeholderMessage: "Tell us about your requirements or questions...",
    selectCompanySize: "Select company size",
    selectIndustry: "Select your industry",
    loading: "Loading...",
    sending: "Sending...",
    scheduleDemo: "Schedule Demo",
  },
  id: {
    title: "Jadwalkan Demo",
    closeAriaLabel: "Tutup modal",
    companyName: "Nama Perusahaan",
    contactPersonName: "Nama Kontak",
    companySize: "Ukuran Perusahaan",
    whatsapp: "Nomor WhatsApp",
    industry: "Industri",
    message: "Apa yang ingin Anda ketahui?",
    required: "Harap isi semua kolom yang wajib diisi",
    successMessage: "Permintaan demo berhasil dikirim! Tim kami akan segera menghubungi Anda.",
    errorMessage: "Gagal mengirim permintaan demo. Silakan coba lagi.",
    genericError: "Terjadi kesalahan. Silakan coba lagi nanti.",
    placeholderCompanyName: "Masukkan nama perusahaan Anda",
    placeholderContactName: "Masukkan nama lengkap Anda",
    placeholderWhatsapp: "+62 812 3456 7890",
    placeholderMessage: "Ceritakan tentang kebutuhan atau pertanyaan Anda...",
    selectCompanySize: "Pilih ukuran perusahaan",
    selectIndustry: "Pilih industri Anda",
    loading: "Memuat...",
    sending: "Mengirim...",
    scheduleDemo: "Jadwalkan Demo",
  },
};

export default function ScheduleDemoModal({
  isOpen,
  onClose,
}: ScheduleDemoModalProps) {
  const pathname = usePathname();
  const currentLang: LangKey = pathname.startsWith("/id") ? "id" : "";
  const t = translations[currentLang];

  const {
    industryOptions,
    companySizeOptions,
    isLoading: isLoadingOptions,
  } = useListOptions();

  const [formData, setFormData] = useState({
    companyName: "",
    contactPersonName: "",
    companySize: "",
    whatsapp: "",
    industry: "",
    message: "",
  });

  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
      setIsClosing(false);

      setToast({
        show: false,
        message: "",
        type: "success",
      });
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  const handleSubmit = async () => {
    if (
      !formData.companyName ||
      !formData.contactPersonName ||
      !formData.companySize ||
      !formData.whatsapp ||
      !formData.industry
    ) {
      showToast(t.required, "error");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("📤 Sending demo request...", formData);

      const response = await fetch("/api/send-demo-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log("📥 Response status:", response.status);
      console.log("📥 Response data:", data);

      if (response.ok) {
        console.log("✅ Email sent successfully to", data.sentTo, "recipients");
        showToast(t.successMessage, "success");

        setFormData({
          companyName: "",
          contactPersonName: "",
          companySize: "",
          whatsapp: "",
          industry: "",
          message: "",
        });

        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        console.error("❌ Failed to send email:", data.error);
        console.error("Details:", data.details);
        showToast(data.error || t.errorMessage, "error");
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      showToast(t.genericError, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen && !isClosing) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isClosing ? "bg-black/0" : "bg-black/50"} backdrop-blur-sm`}
        style={{
          animation: isClosing
            ? "fadeOut 0.3s ease-out"
            : "fadeIn 0.3s ease-out",
        }}
        onClick={handleClose}
      >
        <div
          className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl transition-all duration-300 ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
          style={{
            animation: isClosing
              ? "modalSlideOut 0.3s ease-out"
              : "modalSlideIn 0.3s ease-out",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-[#061551]">{t.title}</h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-all duration-200 hover:rotate-90"
              aria-label={t.closeAriaLabel}
              disabled={isSubmitting}
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="space-y-2 animate-fadeInUp"
                style={{ animationDelay: "0.1s", animationFillMode: "both" }}
              >
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-[#061551]"
                >
                  {t.companyName} <span className="text-red-500">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  placeholder={t.placeholderCompanyName}
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6587A8] focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div
                className="space-y-2 animate-fadeInUp"
                style={{ animationDelay: "0.15s", animationFillMode: "both" }}
              >
                <label
                  htmlFor="contactPersonName"
                  className="block text-sm font-medium text-[#061551]"
                >
                  {t.contactPersonName} <span className="text-red-500">*</span>
                </label>
                <input
                  id="contactPersonName"
                  type="text"
                  placeholder={t.placeholderContactName}
                  value={formData.contactPersonName}
                  onChange={(e) =>
                    handleChange("contactPersonName", e.target.value)
                  }
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6587A8] focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="space-y-2 animate-fadeInUp"
                style={{ animationDelay: "0.2s", animationFillMode: "both" }}
              >
                <label
                  htmlFor="companySize"
                  className="block text-sm font-medium text-[#061551]"
                >
                  {t.companySize} <span className="text-red-500">*</span>
                </label>
                <select
                  id="companySize"
                  value={formData.companySize}
                  onChange={(e) => handleChange("companySize", e.target.value)}
                  disabled={isSubmitting || isLoadingOptions}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6587A8] focus:border-transparent transition-all duration-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {isLoadingOptions ? t.loading : t.selectCompanySize}
                  </option>
                  {companySizeOptions.map((option) => (
                    <option key={option._id} value={option.value}>
                      {currentLang === "id" ? option.label.id : option.label.en}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className="space-y-2 animate-fadeInUp"
                style={{ animationDelay: "0.25s", animationFillMode: "both" }}
              >
                <label
                  htmlFor="whatsapp"
                  className="block text-sm font-medium text-[#061551]"
                >
                  {t.whatsapp} <span className="text-red-500">*</span>
                </label>
                <input
                  id="whatsapp"
                  type="tel"
                  placeholder={t.placeholderWhatsapp}
                  value={formData.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6587A8] focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div
              className="space-y-2 animate-fadeInUp"
              style={{ animationDelay: "0.3s", animationFillMode: "both" }}
            >
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-[#061551]"
              >
                {t.industry} <span className="text-red-500">*</span>
              </label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
                disabled={isSubmitting || isLoadingOptions}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6587A8] focus:border-transparent transition-all duration-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {isLoadingOptions ? t.loading : t.selectIndustry}
                </option>
                {industryOptions.map((option) => (
                  <option key={option._id} value={option.value}>
                    {currentLang === "id" ? option.label.id : option.label.en}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="space-y-2 animate-fadeInUp"
              style={{ animationDelay: "0.35s", animationFillMode: "both" }}
            >
              <label
                htmlFor="message"
                className="block text-sm font-medium text-[#061551]"
              >
                {t.message}
              </label>
              <textarea
                id="message"
                placeholder={t.placeholderMessage}
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                disabled={isSubmitting}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6587A8] focus:border-transparent transition-all duration-200 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div
              className="pt-2 animate-fadeInUp"
              style={{ animationDelay: "0.4s", animationFillMode: "both" }}
            >
              <CustomButton
                size="lg"
                onClick={handleSubmit}
                className="mt-3 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t.sending}
                  </span>
                ) : (
                  t.scheduleDemo
                )}
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

      {/* Toast Notification */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </>
  );
}
