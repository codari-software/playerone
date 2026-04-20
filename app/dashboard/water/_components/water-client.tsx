'use client';

import { Droplets, GlassWater, Scale, Plus, Sparkles, Trophy } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { updateUserWeight, logWaterIntake } from '../../actions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface WaterLog {
  id: string;
  amountMl: number;
  createdAt: Date;
}

export function WaterClient({ initialWeight, todayLogs }: { initialWeight: number | null, todayLogs: WaterLog[] }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [weight, setWeight] = useState(initialWeight?.toString() || '');
  const [isUpdatingWeight, setIsUpdatingWeight] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }
  }, []);

  // Notification Timer
  useEffect(() => {
    if (!notificationsEnabled) return;

    const interval = setInterval(() => {
      if (Notification.permission === 'granted') {
        new Notification('🛡️ PlayerOne: HORA DA ÁGUA!', {
          body: 'Seu avatar precisa de hidratação para manter o bônus de XP. Beba um copo agora!',
          icon: '/favicon.ico'
        });
      }
    }, 10 * 60 * 1000); // 10 minutos

    return () => clearInterval(interval);
  }, [notificationsEnabled]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Seu navegador não suporta notificações.');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      toast.success('Lembretes ativados! Notificação a cada 10 min.');
      new Notification('🛡️ Sistema Ativado', { body: 'Lembretes de hidratação configurados.' });
    } else {
      setNotificationsEnabled(false);
      toast.error('Permissão negada.');
    }
  };

  const waterGoalMl = useMemo(() => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return 2000; // Fallback default
    return Math.round(w * 35);
  }, [weight]);

  const totalDrankMl = useMemo(() => {
    return todayLogs.reduce((acc, log) => acc + log.amountMl, 0);
  }, [todayLogs]);

  const progressPercentage = Math.min(100, Math.round((totalDrankMl / waterGoalMl) * 100));

  const handleUpdateWeight = async () => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
      toast.error('Por favor, insira um peso válido.');
      return;
    }

    setIsUpdatingWeight(true);
    try {
      await updateUserWeight(w);
      toast.success('Peso atualizado e meta recalculada!');
      router.refresh();
    } catch (error) {
      toast.error('Erro ao atualizar peso.');
    } finally {
      setIsUpdatingWeight(false);
    }
  };

  const handleLogWater = async (amount: number) => {
    setIsLogging(true);
    try {
      await logWaterIntake(amount);
      toast.success(`${amount}ml adicionados! +10 XP`);
      router.refresh();
    } catch (error) {
      toast.error('Erro ao registrar água.');
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="animate-in fade-in slide-in-from-left duration-500">
        <h1 className="font-press-start text-white text-2xl mb-4 flex items-center gap-4">
          <Droplets className="w-8 h-8 text-blue-400" />
          SISTEMA DE HIDRATAÇÃO
        </h1>
        <p className="text-2xl text-gray-400">Mantenha seu avatar hidratado para manter o bônus de performance.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Coluna 1: Configurações */}
        <div className="space-y-6">
          {/* Configuração de Peso */}
          <div className="p-[2px] pixel-corners bg-blue-500/30">
            <div className="pixel-corners bg-[#18181b] p-6 space-y-6">
              <div className="flex items-center gap-3 font-press-start text-xs text-blue-400 uppercase">
                <Scale className="w-5 h-5" />
                Configurar Peso
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="number" 
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="SEU PESO (KG)"
                    className="w-full bg-[#111] border-2 border-[#222] p-4 font-vt323 text-2xl text-white pixel-corners focus:border-blue-500 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-press-start text-[10px] text-gray-600">KG</span>
                </div>

                <button 
                  onClick={handleUpdateWeight}
                  disabled={isUpdatingWeight}
                  className="w-full py-4 bg-blue-600 text-white font-press-start text-[10px] pixel-corners hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {isUpdatingWeight ? 'ATUALIZANDO...' : 'SALVAR E CALCULAR META'}
                </button>
              </div>

              {parseFloat(weight) > 0 && (
                <div className="p-4 bg-blue-500/10 pixel-corners border border-blue-500/20">
                  <p className="font-vt323 text-xl text-blue-300">
                    Sua meta recomendada é de <span className="text-white font-bold">{waterGoalMl}ml</span> por dia (35ml por kg).
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card de Notificações */}
          <div className="p-[2px] pixel-corners bg-purple-500/30">
             <div className="pixel-corners bg-[#18181b] p-6 space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3 font-press-start text-[10px] text-purple-400 uppercase">
                      <Sparkles className="w-4 h-4" />
                      Lembretes Desktop
                   </div>
                   <div className={cn(
                     "w-3 h-3 rounded-full animate-pulse",
                     notificationsEnabled ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500"
                   )} />
                </div>
                
                <p className="font-vt323 text-lg text-gray-500">
                   Receba um alerta no seu PC a cada 10 minutos para não esquecer de beber água.
                </p>

                <button 
                  onClick={notificationsEnabled ? () => setNotificationsEnabled(false) : requestNotificationPermission}
                  className={cn(
                    "w-full py-3 font-press-start text-[8px] pixel-corners transition-all",
                    notificationsEnabled 
                      ? "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white" 
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  )}
                >
                  {notificationsEnabled ? 'DESATIVAR ALERTAS' : 'ATIVAR ALERTAS (10 MIN)'}
                </button>
             </div>
          </div>
        </div>

        {/* Coluna 2: Progresso e Ações */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Card */}
          <div className="p-[2px] pixel-corners bg-gradient-to-r from-blue-600 to-cyan-400">
            <div className="pixel-corners bg-[#111] p-8 space-y-8 relative overflow-hidden">
               {/* Wave background effect */}
               <div 
                 className="absolute bottom-0 left-0 w-full bg-blue-500/10 transition-all duration-1000 ease-in-out" 
                 style={{ height: `${progressPercentage}%` }}
               />

               <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-left space-y-2">
                    <div className="font-press-start text-xs text-blue-400 uppercase tracking-widest">Progresso Diário</div>
                    <div className="font-press-start text-4xl text-white">{totalDrankMl}<span className="text-xl text-gray-500">/{waterGoalMl}ml</span></div>
                  </div>

                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="64" cy="64" r="58" fill="transparent" stroke="#222" strokeWidth="12" />
                      <circle 
                        cx="64" cy="64" r="58" fill="transparent" 
                        stroke="url(#blue-grad)" strokeWidth="12" 
                        strokeDasharray={364.4}
                        strokeDashoffset={364.4 - (364.4 * progressPercentage) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-in-out"
                      />
                      <defs>
                        <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#22d3ee" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-press-start text-lg text-white">{progressPercentage}%</span>
                    </div>
                  </div>
               </div>

               <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <button 
                    onClick={() => handleLogWater(250)}
                    disabled={isLogging}
                    className="group p-4 bg-[#18181b] border-2 border-[#222] hover:border-blue-500 pixel-corners transition-all flex flex-col items-center gap-3 active:scale-95"
                  >
                    <GlassWater className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="font-press-start text-[8px] text-white">250ML</span>
                  </button>

                  <button 
                    onClick={() => handleLogWater(500)}
                    disabled={isLogging}
                    className="group p-4 bg-[#18181b] border-2 border-[#222] hover:border-blue-500 pixel-corners transition-all flex flex-col items-center gap-3 active:scale-95"
                  >
                    <div className="relative">
                      <GlassWater className="w-10 h-10 text-blue-500 group-hover:scale-110 transition-transform" />
                      <Plus className="absolute -top-1 -right-1 w-4 h-4 text-white bg-blue-600 rounded-full p-0.5" />
                    </div>
                    <span className="font-press-start text-[8px] text-white">500ML</span>
                  </button>

                  <button 
                    onClick={() => handleLogWater(1000)}
                    disabled={isLogging}
                    className="group p-4 bg-[#18181b] border-2 border-[#222] hover:border-blue-500 pixel-corners transition-all flex flex-col items-center gap-3 active:scale-95 col-span-2 sm:col-span-1"
                  >
                    <Droplets className="w-10 h-10 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="font-press-start text-[8px] text-white">1 LITRO</span>
                  </button>
               </div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="space-y-4">
            <h3 className="font-press-start text-xs text-white uppercase flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Logs de Hoje
            </h3>
            
            <div className="grid gap-3">
              {todayLogs.length > 0 ? todayLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-4 bg-[#18181b] border-2 border-[#222] pixel-corners flex justify-between items-center group hover:border-blue-500/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Droplets className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-press-start text-[10px] text-white">{log.amountMl}ml Ingeridos</div>
                      <div className="font-vt323 text-lg text-gray-500 uppercase tracking-widest">
                         ÀS {mounted ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </div>
                    </div>
                  </div>
                  <Trophy className="w-5 h-5 text-yellow-600 opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
              )) : (
                <div className="p-10 text-center border-2 border-dashed border-[#222] pixel-corners">
                  <p className="font-press-start text-[8px] text-gray-600">NENHUM LOG REGISTRADO HOJE. COMECE A BEBER!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
