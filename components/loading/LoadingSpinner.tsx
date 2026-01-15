import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  className?: string;
  bgColor?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6 border-2',
  md: 'h-10 w-10 border-2',
  lg: 'h-12 w-12 border-2',
  xl: 'h-16 w-16 border-3',
};

export default function LoadingSpinner({
  size = 'lg',
  text,
  fullScreen = true,
  className = '',
  bgColor = 'bg-[#f2f7ff]',
}: LoadingSpinnerProps) {
  const content = (
    <div className="text-center">
      <div
        className={`animate-spin rounded-full border-b-[#061551] ${sizeClasses[size]} mx-auto ${text ? 'mb-4' : ''}`}
        style={{ borderTopColor: 'transparent', borderRightColor: 'transparent', borderLeftColor: 'transparent' }}
      ></div>
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center ${className}`}>
        {content}
      </div>
    );
  }

  return <div className={`flex items-center justify-center ${className}`}>{content}</div>;
}