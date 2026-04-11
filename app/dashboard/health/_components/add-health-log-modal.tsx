'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface AddHealthLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddHealthLogModal({ isOpen, onClose }: AddHealthLogModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'EXERCISE',
    value: 0,
    description: '',
  });

  const getUnit = () => {
    switch (formData.type) {
      case 'EXERCISE':
        return 'min';
      case 'WATER':
        return 'copos';
      case 'SLEEP':
        return 'horas';
      default:
        return '';
    }
  };

  const getLabel = () => {
    switch (formData.type) {
      case 'EXERCISE':
        return 'Tempo de Treino';
      case 'WATER':
        return 'Dose de Poção (Água)';
      case 'SLEEP':
        return 'Descanso (Sono)';
      default:
        return 'Valor';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/health/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          unit: getUnit(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error ?? 'Falha ao registrar atividade');
        return;
      }

      const { handleUnlockedAchievements } = await import('@/lib/toast-achievements');
      handleUnlockedAchievements(data?.unlockedAchievements);

      toast.success(`Atividade registrada! +${data?.xpEarned ?? 5} XP`);
      setFormData({ type: 'EXERCISE', value: 0, description: '' });
      onClose();
      router.refresh();
    } catch (error: any) {
      console.error('Add health log error:', error);
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
            <h2 className="font-press-start text-white text-lg tracking-tight uppercase">STATUS DE VIDA</h2>
            <button onClick={onClose} className="p-1 hover:bg-[#222] pixel-corners transition-colors">
              <X className="w-6 h-6 text-gray-400 hover:text-[#ff6b6b]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="type" className="font-vt323 text-2xl text-gray-300 uppercase block tracking-wider">Tipo de Atividade</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full h-16 bg-[#111] border-2 border-[#222] px-4 font-vt323 text-2xl text-white pixel-corners focus:border-[#ff6b6b] outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="EXERCISE">Exercício (minutos)</option>
                <option value="WATER">Ingestão de Água (copos)</option>
                <option value="SLEEP">Sono (horas)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label htmlFor="value" className="font-vt323 text-2xl text-gray-300 uppercase block tracking-wider">
                {getLabel()} ({getUnit()})
              </label>
              <input
                id="value"
                type="number"
                step="0.1"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                required
                min="0"
                className="w-full bg-[#111] border-2 border-[#222] p-4 font-vt323 text-2xl text-white pixel-corners focus:border-[#ff6b6b] outline-none transition-colors"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="description" className="font-vt323 text-2xl text-gray-300 uppercase block tracking-wider">Descrição (Opcional)</label>
              <input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Treino de força, Yoga..."
                className="w-full bg-[#111] border-2 border-[#222] p-4 font-vt323 text-2xl text-white pixel-corners focus:border-[#ff6b6b] outline-none transition-colors"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 p-[2px] pixel-corners bg-[#222] hover:bg-[#333] group transition-all"
              >
                <div className="pixel-corners bg-[#18181b] py-4 font-press-start text-xs text-gray-500 group-hover:text-white uppercase">
                  Cancelar
                </div>
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 p-[2px] pixel-corners bg-[#ff6b6b] hover:bg-[#ff8b8b] group transition-all disabled:opacity-50"
              >
                <div className="pixel-corners bg-[#ff6b6b] py-4 font-press-start text-xs text-white shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.3)]">
                  {isLoading ? 'Registrando...' : 'Atualizar Status'}
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
