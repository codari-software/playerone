'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'INCOME',
    amount: 0,
    category: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/finances/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data?.error ?? 'Falha ao registrar transação');
        return;
      }

      const { handleUnlockedAchievements } = await import('@/lib/toast-achievements');
      handleUnlockedAchievements(data?.unlockedAchievements);

      toast.success('Tesouro registrado!');
      setFormData({ type: 'INCOME', amount: 0, category: '', description: '' });
      onClose();
      router.refresh();
    } catch (error: any) {
      console.error('Add transaction error:', error);
      toast.error('Algo deu errado');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg p-[2px] pixel-corners bg-[#333] shadow-2xl animate-in zoom-in duration-300">
        <div className="pixel-corners bg-[#18181b] p-8 sm:p-10">
          <div className="flex items-center justify-between mb-8 border-b-2 border-[#222] pb-6">
            <h2 className="font-press-start text-white text-lg tracking-tight uppercase">REGISTRAR OURO</h2>
            <button onClick={onClose} className="p-1 hover:bg-[#222] pixel-corners transition-colors">
              <X className="w-6 h-6 text-gray-400 hover:text-[#4dbdff]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="type" className="font-vt323 text-2xl text-gray-300 uppercase block tracking-wider">Tipo de Transação</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full h-16 bg-[#111] border-2 border-[#222] px-4 font-vt323 text-2xl text-white pixel-corners focus:border-[#4dbdff] outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="INCOME">Entrada (Ganho de Ouro)</option>
                <option value="EXPENSE">Saída (Gasto de Ouro)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label htmlFor="amount" className="font-vt323 text-2xl text-gray-300 uppercase block tracking-wider">Quantidade</label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  required
                  min="0"
                  className="w-full bg-[#111] border-2 border-[#222] p-4 font-vt323 text-2xl text-white pixel-corners focus:border-[#4dbdff] outline-none transition-colors"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="category" className="font-vt323 text-2xl text-gray-300 uppercase block tracking-wider">Categoria</label>
                <input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Salário, Drop..."
                  required
                  className="w-full bg-[#111] border-2 border-[#222] p-4 font-vt323 text-2xl text-white pixel-corners focus:border-[#4dbdff] outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="description" className="font-vt323 text-2xl text-gray-300 uppercase block tracking-wider">Descrição (Opcional)</label>
              <input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhes do loot"
                className="w-full bg-[#111] border-2 border-[#222] p-4 font-vt323 text-2xl text-white pixel-corners focus:border-[#4dbdff] outline-none transition-colors"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 p-[2px] pixel-corners bg-[#222] hover:bg-[#333] group transition-all"
              >
                <div className="pixel-corners bg-[#18181b] py-4 font-press-start text-xs text-gray-400 group-hover:text-white uppercase">
                  Cancelar
                </div>
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 p-[2px] pixel-corners bg-[#4dbdff] hover:bg-blue-400 group transition-all disabled:opacity-50"
              >
                <div className="pixel-corners bg-[#4dbdff] py-4 font-press-start text-xs text-white shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.3)]">
                  {isLoading ? 'Salvando...' : 'Confirmar Loot'}
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
