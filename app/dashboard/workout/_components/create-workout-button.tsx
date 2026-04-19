'use client';

import { useState } from 'react';
import { Plus, Dumbbell, X } from 'lucide-react';
import { createWorkout } from '../actions';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export function CreateWorkoutButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;

    setLoading(true);
    try {
      await createWorkout(name);
      toast.success('Treino iniciado, herói!');
      setName('');
      setIsOpen(false);
    } catch (err) {
      toast.error('Falha ao iniciar treino');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-[2px] pixel-corners bg-[#ff6b6b] hover:bg-[#ff8b8b] transition-all group"
      >
        <div className="pixel-corners bg-[#ff6b6b] px-8 py-4 flex items-center gap-3 text-white shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.3)]">
          <Plus className="w-5 h-5" />
          <span className="font-press-start text-xs uppercase mt-1">NOVO TREINO</span>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-md p-[2px] pixel-corners bg-[#333] animate-in zoom-in duration-300">
            <div className="pixel-corners bg-[#18181b] p-8">
              <div className="flex items-center justify-between mb-8 border-b-2 border-[#222] pb-6">
                <h2 className="font-press-start text-white text-lg flex items-center gap-3">
                  <Dumbbell className="w-5 h-5 text-[#ff6b6b]" />
                  INICIAR SESSÃO
                </h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-vt323 text-2xl text-gray-500 uppercase tracking-widest">NOME DO TREINO</label>
                  <input 
                    type="text"
                    placeholder="Ex: Treino A - Peito & Triceps"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    className="w-full bg-[#111] border-2 border-[#222] p-4 font-vt323 text-2xl text-white outline-none focus:border-[#ff6b6b] transition-colors pixel-corners"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="w-full p-[2px] pixel-corners bg-[#ff6b6b] hover:bg-[#ff8b8b] transition-all group disabled:opacity-50"
                >
                  <div className="pixel-corners bg-[#ff6b6b] py-5 font-press-start text-xs text-white shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.3)]">
                    {loading ? 'CARREGANDO...' : 'INICIAR TREINO'}
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
