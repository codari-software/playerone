'use client';

import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  transactions: any[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (transactionId: string) => {
    if (!confirm('Deseja descartar este loot permanentemente?')) return;

    setDeletingId(transactionId);
    try {
      const res = await fetch('/api/finances/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId }),
      });

      if (!res.ok) {
        toast.error('Falha ao deletar transação');
        return;
      }

      toast.success('Transação deletada');
      router.refresh();
    } catch (error: any) {
      console.error('Delete transaction error:', error);
      toast.error('Algo deu errado');
    } finally {
      setDeletingId(null);
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <p className="font-press-start text-[10px] sm:text-xs text-gray-600 uppercase italic">
          Nenhum ouro registrado. Explore o mapa para ganhar loot!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-press-start text-white text-xs mb-6 uppercase tracking-widest">Registros de Tesouro</h3>
      <div className="space-y-3">
        {transactions.map((transaction: any, index: number) => (
          <motion.div
            key={transaction?.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="p-[1px] pixel-corners bg-[#222] hover:bg-[#333] transition-all group"
          >
            <div className="pixel-corners bg-[#111] p-4 flex items-center gap-6">
              <div className={cn(
                "p-3 pixel-corners",
                transaction?.type === 'INCOME' ? "bg-green-500/10" : "bg-red-500/10"
              )}>
                {transaction?.type === 'INCOME' ? (
                  <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500 flex-shrink-0" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-press-start text-[10px] text-white uppercase truncate mb-1">
                  {transaction?.category}
                </div>
                {transaction?.description && (
                  <div className="font-vt323 text-xl text-gray-500 truncate lowercase leading-tight">
                    {transaction.description}
                  </div>
                )}
                <div className="font-vt323 text-lg text-gray-700 mt-1 uppercase">
                  {formatDate(transaction?.date)}
                </div>
              </div>

              <div className={cn(
                "font-press-start text-sm sm:text-base whitespace-nowrap",
                transaction?.type === 'INCOME' ? "text-green-500" : "text-red-500"
              )}>
                {transaction?.type === 'INCOME' ? '+' : '-'}
                {formatCurrency(transaction?.amount ?? 0)}
              </div>

              <button
                onClick={() => handleDelete(transaction?.id)}
                disabled={deletingId === transaction?.id}
                className="p-2 pixel-corners hover:bg-red-500/20 text-gray-700 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
