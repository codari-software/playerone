import React from 'react';

interface RetroButtonProps {
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export const RetroButton = ({ active, disabled, children, className = "", onClick, type = "button" }: RetroButtonProps) => (
  <button 
    type={type}
    onClick={disabled ? undefined : onClick} 
    disabled={disabled}
    className={`p-[2px] pixel-corners transition-transform inline-block 
      ${disabled ? 'bg-[#222] cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105 active:scale-95'} 
      ${active && !disabled ? 'bg-[#ff6b6b]' : 'bg-[#333333] hover:bg-[#ff6b6b]'} 
      ${className}`}
  >
    <div className={`pixel-corners w-full h-full flex items-center justify-center px-6 py-3 text-2xl tracking-wide 
      ${active && !disabled ? 'bg-[#ff6b6b] text-white shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.3)]' : 'bg-[#18181b] text-gray-300 hover:text-white'}`}>
       {children}
    </div>
  </button>
);

