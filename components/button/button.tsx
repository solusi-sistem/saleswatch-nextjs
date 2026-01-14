import React from 'react';

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function CustomButton({ children, onClick, variant = 'primary', size = 'lg', className = '', disabled = false, type = 'button' }: CustomButtonProps) {
const baseStyles = 'rounded-full font-normal transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variantStyles = {
    primary: 'bg-[#6587A8] text-white hover:bg-[#CFE3C0] hover:text-[#6587A8]',
    secondary: 'bg-[#CFE3C0] text-[#6587A8] hover:bg-[#6587A8] hover:text-white',
    outline: 'bg-transparent border-2 border-[#6587A8] text-[#6587A8] hover:bg-[#6587A8] hover:text-white',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-2 text-base md:text-lg',
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </button>
  );
}