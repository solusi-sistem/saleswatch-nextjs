'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slideInRight">
      <div 
        className={`
          flex items-start gap-3 p-4 rounded-lg shadow-2xl backdrop-blur-sm
          border-l-4 min-w-[320px] max-w-md
          ${isSuccess 
            ? 'bg-white border-green-500' 
            : 'bg-white border-red-500'
          }
        `}
      >
        {/* Icon */}
        <div className={`flex-shrink-0 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
          {isSuccess ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <XCircle className="w-6 h-6" />
          )}
        </div>

        {/* Message */}
        <div className="flex-1 pt-0.5">
          <h4 className={`font-semibold text-sm mb-1 ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
            {isSuccess ? 'Success!' : 'Error!'}
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar */}
        <div 
          className={`
            absolute bottom-0 left-0 h-1 rounded-b-lg
            ${isSuccess ? 'bg-green-500' : 'bg-red-500'}
          `}
          style={{
            animation: `shrink ${duration}ms linear forwards`
          }}
        />
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}