'use client';

import { Activity, CheckCircle2, DollarSign, Heart } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface RecentActivityProps {
  habits: any[];
  transactions: any[];
  healthLogs: any[];
  achievements: any[];
}

export function RecentActivity({ habits, transactions, healthLogs, achievements }: RecentActivityProps) {
  const allActivity = [
    ...(habits?.map?.((h: any) => ({
      type: 'habit',
      icon: CheckCircle2,
      color: 'text-blue-400',
      description: `Quest Cumprida: ${h?.name}`,
      date: h?.completedAt ?? h?.createdAt,
    })) ?? []),
    ...(transactions?.map?.((t: any) => ({
      type: 'finance',
      icon: DollarSign,
      color: t?.type === 'INCOME' ? 'text-green-500' : 'text-red-500',
      description: `${t?.type === 'INCOME' ? 'Ouro Recebido' : 'Gasto realizado'}: ${t?.category}`,
      date: t?.date,
    })) ?? []),
    ...(healthLogs?.map?.((h: any) => ({
      type: 'health',
      icon: Heart,
      color: 'text-[#ff6b6b]',
      description: `HP Atualizado: ${h?.type} - ${h?.value}${h?.unit}`,
      date: h?.date,
    })) ?? []),
    ...(achievements?.map?.((a: any) => ({
      type: 'achievement',
      icon: Activity,
      color: 'text-yellow-500',
      description: `Conquista Rara: ${a?.achievement?.name}`,
      date: a?.unlockedAt,
    })) ?? []),
  ]
    .filter((item: any) => item?.date)
    .sort((a: any, b: any) => new Date(b?.date).getTime() - new Date(a?.date).getTime())
    .slice(0, 10);

  return (
    <div className="p-[2px] pixel-corners bg-[#333]">
      <div className="pixel-corners bg-[#18181b] p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-8 text-white">
          <Activity className="w-6 h-6 text-blue-500" />
          <h2 className="font-press-start text-lg uppercase tracking-wider">Log de Atividades</h2>
        </div>

        {allActivity.length === 0 ? (
          <p className="text-2xl text-gray-500 text-center py-10">O log está vazio. Comece sua aventura!</p>
        ) : (
          <div className="space-y-4">
            {allActivity.map((item: any, index: number) => {
              const Icon = item?.icon ?? Activity;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-[#111] border-l-4 border-[#333] hover:border-[#ff6b6b] transition-colors"
                >
                  <Icon className={cn("w-6 h-6 flex-shrink-0 mt-1", item?.color ?? 'text-gray-400')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xl leading-snug truncate">{item?.description}</p>
                    <p className="text-gray-500 text-lg">{formatDateTime(item?.date)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
