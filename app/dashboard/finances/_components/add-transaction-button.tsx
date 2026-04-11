'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AddTransactionModal } from './add-transaction-modal';

export function AddTransactionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-[2px] pixel-corners bg-[#4dbdff] hover:bg-blue-400 transition-all group active:scale-95"
      >
        <div className="pixel-corners bg-[#4dbdff] px-6 py-3 flex items-center gap-2 shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.3)]">
          <Plus className="w-5 h-5 text-white" />
          <span className="font-press-start text-[10px] sm:text-xs text-white uppercase mt-1">Negociar Tesouro</span>
        </div>
      </button>
      <AddTransactionModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
