'use client';

import { Activity, Droplets, Moon, Trash2, Zap } from 'lucide-react';
import { formatDateTime, cn } from '@/lib/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface HealthLogListProps {
  logs: any[];
}

export function HealthLogList({ logs }: HealthLogListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (logId: string) => {
    if (!confirm('Deseja descartar este status de vida?')) return;

    setDeletingId(logId);
    try {
      const res = await fetch('/api/health/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId }),
      });

      if (!res.ok) {
        toast.error('Falha ao deletar log');
        return;
      }

      toast.success('Log deletado');
      router.refresh();
    } catch (error: any) {
      console.error('Delete log error:', error);
      toast.error('Algo deu errado');
    } finally {
      setDeletingId(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'EXERCISE':
        return <Activity className="w-5 h-5 text-orange-500" />;
      case 'WATER':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'SLEEP':
        return <Moon className="w-5 h-5 text-purple-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'EXERCISE': return 'TREINO';
      case 'WATER': return 'ÁGUA';
      case 'SLEEP': return 'SONO';
      default: return type;
    }
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <p className="font-press-start text-[10px] sm:text-xs text-gray-600 uppercase italic">
          Nenhum status vital registrado. Mantenha seu herói vivo!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-press-start text-white text-xs mb-6 uppercase tracking-widest">Logs de Status Vital</h3>
      <div className="space-y-3">
        {logs.map((log: any, index: number) => (
          <motion.div
            key={log?.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="p-[1px] pixel-corners bg-[#222] hover:bg-[#333] transition-all group"
          >
            <div className="pixel-corners bg-[#111] p-4 flex items-center gap-6">
              <div className="p-3 pixel-corners bg-[#18181b] border border-[#222]">
                {getIcon(log?.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-press-start text-[10px] text-white uppercase truncate mb-1">
                  {getTypeLabel(log?.type)} - {log?.value} {log?.unit}
                </div>
                {log?.description && (
                  <div className="font-vt323 text-xl text-gray-500 truncate lowercase leading-tight">
                    {log.description}
                  </div>
                )}
                <div className="font-vt323 text-lg text-gray-700 mt-1 uppercase">
                  {formatDateTime(log?.date)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#111] px-2 py-1 pixel-corners border border-[#222]">
                   <span className="font-press-start text-[8px] text-blue-400">+{log?.xpEarned ?? 5} XP</span>
                </div>
                <button
                  onClick={() => handleDelete(log?.id)}
                  disabled={deletingId === log?.id}
                  className="p-2 pixel-corners hover:bg-red-500/20 text-gray-700 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
