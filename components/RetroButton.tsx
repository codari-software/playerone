import React from 'react';

export const RetroButton = ({ active, children, className = "", onClick }: { active?: boolean, children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div onClick={onClick} className={`p-[2px] pixel-corners cursor-pointer transition-transform hover:scale-105 active:scale-95 inline-block ${active ? 'bg-[#ff6b6b]' : 'bg-[#333333] hover:bg-[#ff6b6b]'} ${className}`}>
    <div className={`pixel-corners w-full h-full flex items-center justify-center px-6 py-3 text-2xl tracking-wide ${active ? 'bg-[#ff6b6b] text-white shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.3)]' : 'bg-[#18181b] text-gray-300 hover:text-white'}`}>
       {children}
    </div>
  </div>
);
