'use client';

import { useState } from 'react';
import { Check, Dumbbell, Book, Users, Heart, Briefcase, Loader2, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleHabitDay, deleteHabit } from '../actions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const iconMap: Record<string, any> = {
  'Academia': Dumbbell,
  'Estudar': Book,
  'Familia': Users,
  'Cardio': Heart,
  'Trabalhar': Briefcase,
};


export function HabitGrid({ habits }: { habits: any[] }) {
  const [loadingDays, setLoadingDays] = useState<string[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  // Todos os dias do mês atual
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleToggle = async (habitId: string, day: number) => {
    const key = `${habitId}-${day}`;
    if (loadingDays.includes(key)) return;

    setLoadingDays(prev => [...prev, key]);
    try {
      const result = await toggleHabitDay(habitId, day);
      if (result?.error) {
        toast.error('Erro ao atualizar hábito.');
      } else {
        toast.success(`Hábito atualizado!`, { icon: '⚔️' });
      }
    } catch (err) {
      toast.error('Erro de conexão.');
    } finally {
      setLoadingDays(prev => prev.filter(k => k !== key));
    }
  };

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const res = await fetch('/api/habits/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newHabitName }),
      });

      if (res.ok) {
        toast.success('Missão aceita!', { icon: '⚔️' });
        setNewHabitName('');
        router.refresh();
      } else {
        toast.error('Falha ao criar hábito.');
      }
    } catch (err) {
      toast.error('Erro de conexão.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (habitId: string, name: string) => {
    if (!confirm(`Deseja realmente excluir a missão "${name}"?`)) return;

    try {
      const result = await deleteHabit(habitId);
      if (result.success) {
        toast.success('Missão removida do mapa.');
        router.refresh();
      } else {
        toast.error('Erro ao remover missão.');
      }
    } catch (err) {
      toast.error('Erro de conexão.');
    }
  };

  return (
    <div className="p-[2px] pixel-corners bg-[#222] overflow-x-auto relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      
      <table className="w-full border-collapse bg-[#111] min-w-[800px]">
        <thead>
          <tr className="border-b-2 border-[#222]">
            <th className="p-4 text-left font-press-start text-[8px] text-gray-500 w-40 sticky left-0 bg-[#0a0a0a] z-10 border-r-2 border-[#222]">Hábito</th>
            {days.map(d => (
              <th key={d} className="p-2 font-press-start text-[8px] text-gray-500 hover:text-white transition-colors">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => {
            const Icon = iconMap[habit.name] || Check;
            
            return (
              <tr key={habit.id} className="border-b border-[#222] hover:bg-white/5 transition-colors group">
                <td className="p-4 sticky left-0 bg-[#0a0a0a] z-10 border-r-2 border-[#222]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#ff6b6b] group-hover:scale-110 transition-transform" />
                      <span className="font-press-start text-[8px] text-white uppercase truncate max-w-[80px]">{habit.name}</span>
                    </div>
                    <button 
                      onClick={() => handleDelete(habit.id, habit.name)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500"
                      title="Excluir Missão"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
                {days.map(d => {
                  const key = `${habit.id}-${d}`;
                  const isLoading = loadingDays.includes(key);
                  const isCompleted = habit.logs?.some((log: any) => {
                    const logDate = new Date(log.date);
                    return logDate.getDate() === d && logDate.getMonth() === now.getMonth();
                  });

                  return (
                    <td key={d} className="p-1 text-center">
                      <button 
                        onClick={() => handleToggle(habit.id, d)}
                        disabled={isLoading}
                        className={cn(
                          "w-6 h-6 mx-auto pixel-corners flex items-center justify-center transition-all relative overflow-hidden",
                          isCompleted 
                            ? "bg-green-500/20 border-2 border-green-500 text-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]" 
                            : "bg-[#1a1a1a] border-2 border-[#333] hover:border-[#ff6b6b] text-gray-700 hover:text-white"
                        )}
                      >
                        {isLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : isCompleted ? (
                          <Check className="w-3 h-3" />
                        ) : null}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
          
          {/* Quick Add Row */}
          <tr className="border-b border-[#222] bg-white/[0.02]">
            <td className="p-4 sticky left-0 bg-[#111] z-10 border-r-2 border-[#222]">
              <form onSubmit={handleAddHabit} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="NOVA MISSÃO..."
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="w-full bg-transparent font-press-start text-[8px] text-[#ff6b6b] outline-none placeholder:text-gray-700"
                />
                <button 
                  type="submit" 
                  disabled={isCreating || !newHabitName.trim()}
                  className="p-1 hover:bg-[#ff6b6b]/20 pixel-corners transition-colors disabled:opacity-0"
                >
                  <Plus className="w-3 h-3 text-[#ff6b6b]" />
                </button>
              </form>
            </td>
            <td colSpan={daysInMonth} className="p-4 text-left font-vt323 text-xl text-gray-700 italic">
              DIGITE O NOME E PRESSIONE ENTER PARA FORJAR UMA NOVA MISSÃO
            </td>
          </tr>
        </tbody>
      </table>
      <div className="p-4 bg-[#0a0a0a] flex justify-between items-center font-press-start text-[8px] text-gray-600 uppercase sticky left-0 border-t border-[#222] min-w-full">
        <div className="flex gap-4">
          <span>HÁBITOS: {habits.length}</span>
          <span className="text-blue-500">MÊS ATUAL: {now.toLocaleDateString('pt-BR', { month: 'long' })}</span>
        </div>
        <span className="text-green-500 animate-pulse">Servidor Online</span>
      </div>
    </div>
  );
}

