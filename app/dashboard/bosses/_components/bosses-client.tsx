'use client';

import { Skull, Shield, Sword, Lock, CheckCircle2, Zap, Trophy, Star, Target, CheckSquare, Square } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { defeatBoss, toggleBossObjective } from '../../actions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Objective {
  id: string;
  description: string;
  hpDamage: number;
  isCompleted: boolean;
}

interface BossProgress {
  id: string;
  status: 'LOCKED' | 'UNLOCKED' | 'DEFEATED';
  boss: {
    id: string;
    name: string;
    description: string;
    level: number;
    hp: number;
    xpReward: number;
    difficulty: number;
    imageUrl: string | null;
    order: number;
    objectives: Objective[];
  };
}

export function BossesClient({ progress }: { progress: BossProgress[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const currentBoss = progress.find(p => p.status === 'UNLOCKED');
  
  const currentHp = useMemo(() => {
    if (!currentBoss) return 0;
    const damage = currentBoss.boss.objectives
      .filter(obj => obj.isCompleted)
      .reduce((acc, obj) => acc + obj.hpDamage, 0);
    return Math.max(0, currentBoss.boss.hp - damage);
  }, [currentBoss]);

  const allObjectivesDone = useMemo(() => {
    if (!currentBoss) return false;
    return currentBoss.boss.objectives.every(obj => obj.isCompleted);
  }, [currentBoss]);

  const handleToggleObjective = async (objectiveId: string) => {
    try {
      await toggleBossObjective(objectiveId);
      router.refresh();
    } catch (error) {
      toast.error('Erro ao atualizar objetivo.');
    }
  };

  const handleDefeat = async (bossId: string) => {
    if (!allObjectivesDone) {
      toast.error('Você ainda não completou todos os objetivos para derrotar este boss!');
      return;
    }

    setLoading(bossId);
    try {
      const res = await defeatBoss(bossId);
      if (res.success) {
        toast.success('CHEFÃO DERROTADO! XP ADQUIRIDO.');
        router.refresh();
      } else {
        toast.error('Erro ao derrotar chefão.');
      }
    } catch (error) {
      toast.error('Erro de conexão.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="animate-in fade-in slide-in-from-left duration-500">
        <h1 className="font-press-start text-white text-2xl mb-4 flex items-center gap-4">
          <Skull className="w-8 h-8 text-red-500" />
          CHEFÕES DO DIA
        </h1>
        <p className="text-2xl text-gray-400">Complete seus objetivos para causar dano e derrotar os bosses.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Main Boss Display */}
        <div className="lg:col-span-8 space-y-8">
          {currentBoss ? (
            <div className="group p-[2px] pixel-corners bg-gradient-to-b from-[#333] to-[#111] hover:from-red-600 hover:to-black transition-all duration-500">
              <div className="bg-[#0a0a0a] pixel-corners overflow-hidden relative">
                {/* Boss Image Section */}
                <div className="relative h-[300px] w-full bg-[#111]">
                   <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-red-600 px-4 py-2 pixel-corners font-press-start text-[10px] text-white">
                      <Trophy className="w-4 h-4" />
                      +{currentBoss.boss.xpReward} XP
                   </div>
                   
                   {currentBoss.boss.imageUrl ? (
                     <div className="w-full h-full relative">
                        <img 
                          src={currentBoss.boss.imageUrl} 
                          alt={currentBoss.boss.name}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                     </div>
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-[#18181b]">
                        <Skull className="w-32 h-32 text-gray-800" />
                     </div>
                   )}

                   <div className="absolute bottom-6 left-10 right-10 z-20 space-y-2">
                      <h2 className="font-press-start text-3xl text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                        {currentBoss.boss.name}
                      </h2>
                      <p className="font-vt323 text-2xl text-gray-400 italic">
                        "{currentBoss.boss.description}"
                      </p>
                   </div>
                </div>

                {/* Stats & Objectives Section */}
                <div className="p-8 space-y-10">
                   {/* HP Bar */}
                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                         <span className="font-press-start text-[10px] text-red-500 uppercase flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Vida do Boss (HP)
                         </span>
                         <span className="font-press-start text-sm text-white">{currentHp}/{currentBoss.boss.hp}</span>
                      </div>
                      <div className="h-6 w-full bg-[#222] pixel-corners overflow-hidden p-1">
                         <div 
                           className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-700 ease-out relative" 
                           style={{ width: `${(currentHp / currentBoss.boss.hp) * 100}%` }}
                         >
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                         </div>
                      </div>
                   </div>

                   {/* Objectives List */}
                   <div className="space-y-6">
                      <h3 className="font-press-start text-xs text-blue-400 uppercase flex items-center gap-3">
                         <Target className="w-5 h-5" /> Objetivos para Derrotar
                      </h3>
                      
                      <div className="grid gap-4">
                        {currentBoss.boss.objectives.map((obj) => (
                          <button
                            key={obj.id}
                            onClick={() => handleToggleObjective(obj.id)}
                            className={cn(
                              "w-full p-6 pixel-corners border-2 transition-all flex items-center justify-between text-left group",
                              obj.isCompleted 
                                ? "bg-green-500/10 border-green-500/50 text-green-500" 
                                : "bg-[#18181b] border-[#222] text-gray-400 hover:border-blue-500 hover:text-white"
                            )}
                          >
                            <div className="flex items-center gap-4">
                               {obj.isCompleted ? (
                                 <CheckSquare className="w-6 h-6 shrink-0" />
                               ) : (
                                 <Square className="w-6 h-6 shrink-0 group-hover:text-blue-400" />
                               )}
                               <span className="font-vt323 text-2xl uppercase tracking-widest">{obj.description}</span>
                            </div>
                            <span className="font-press-start text-[8px] text-red-500/50 group-hover:text-red-500">
                               -{obj.hpDamage} HP
                            </span>
                          </button>
                        ))}
                      </div>
                   </div>

                   {/* Action Button */}
                   <div className="pt-4">
                     <button 
                       onClick={() => handleDefeat(currentBoss.boss.id)}
                       disabled={loading !== null || !allObjectivesDone}
                       className={cn(
                         "w-full py-8 font-press-start text-sm pixel-corners transition-all active:scale-[0.98] flex items-center justify-center gap-4",
                         allObjectivesDone 
                           ? "bg-red-600 hover:bg-red-700 text-white shadow-[0_8px_0_#991b1b] hover:translate-y-[4px] hover:shadow-[0_4px_0_#991b1b] active:translate-y-[8px] active:shadow-none" 
                           : "bg-[#222] text-gray-600 cursor-not-allowed opacity-50"
                       )}
                     >
                       {loading === currentBoss.boss.id ? (
                         'FINALIZANDO...'
                       ) : allObjectivesDone ? (
                         <>
                           <Sword className="w-6 h-6" />
                           FINALIZAR CHEFÃO
                         </>
                       ) : (
                         'COMPLETE OS OBJETIVOS'
                       )}
                     </button>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-20 text-center bg-[#111] border-2 border-dashed border-[#222] pixel-corners space-y-6">
               <Trophy className="w-20 h-20 text-yellow-500 mx-auto animate-bounce" />
               <h2 className="font-press-start text-xl text-white">TODOS OS BOSSES DERROTADOS!</h2>
               <p className="font-vt323 text-2xl text-gray-400 uppercase tracking-widest">Você alcançou a maestria suprema por hoje.</p>
            </div>
          )}
        </div>

        {/* Boss Progression List */}
        <div className="lg:col-span-4 space-y-6">
           <h3 className="font-press-start text-[10px] text-gray-500 uppercase mb-4 tracking-widest">Ordem de Desafios</h3>
           <div className="space-y-4">
              {progress.map((p) => (
                <div 
                  key={p.boss.id}
                  className={cn(
                    "p-4 pixel-corners border-2 transition-all",
                    p.status === 'DEFEATED' ? "bg-green-500/5 border-green-500/20" : 
                    p.status === 'UNLOCKED' ? "bg-red-500/5 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)]" : 
                    "bg-[#111] border-[#222] opacity-50"
                  )}
                >
                  <div className="flex items-center gap-4">
                     <div className={cn(
                       "w-12 h-12 pixel-corners flex items-center justify-center shrink-0",
                       p.status === 'DEFEATED' ? "bg-green-500/20 text-green-500" :
                       p.status === 'UNLOCKED' ? "bg-red-600 text-white" : "bg-[#222] text-gray-600"
                     )}>
                        {p.status === 'DEFEATED' ? <CheckCircle2 className="w-6 h-6" /> : 
                         p.status === 'UNLOCKED' ? <Zap className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                     </div>
                     <div>
                        <div className="font-press-start text-[10px] text-white">{p.boss.name}</div>
                        <div className="font-vt323 text-lg text-gray-500 uppercase tracking-widest">
                           {p.status === 'DEFEATED' ? 'CONQUISTADO' : p.status === 'UNLOCKED' ? 'DESAFIO ATUAL' : 'BLOQUEADO'}
                        </div>
                     </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
