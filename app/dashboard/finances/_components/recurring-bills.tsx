'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, Trash2, Rocket, Calculator } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface RecurringBill {
  id: string;
  name: string;
  amount: number;
  category: string;
}

interface RecurringBillsProps {
  bills: RecurringBill[];
}

export function RecurringBills({ bills }: RecurringBillsProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'ESSENCIAL',
  });

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/finances/recurring/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Falha ao criar');

      toast.success('Conta recorrente adicionada!');
      setFormData({ name: '', amount: '', category: 'ESSENCIAL' });
      setIsAdding(false);
      router.refresh();
    } catch (error) {
      toast.error('Erro ao adicionar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBill = async (billId: string) => {
    if (!confirm('Tem certeza?')) return;

    try {
      const res = await fetch('/api/finances/recurring/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billId }),
      });

      if (!res.ok) throw new Error('Falha ao excluir');

      toast.success('Removido da lista!');
      router.refresh();
    } catch (error) {
      toast.error('Erro ao excluir');
    }
  };

  const handleBatchAdd = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/finances/recurring/batch-add', {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Falha ao processar');

      const data = await res.json();
      toast.success(`${data.count} contas adicionadas aos gastos do mês!`);
      router.refresh();
    } catch (error) {
      toast.error('Erro ao processar contas');
    } finally {
      setIsLoading(false);
    }
  };

  const totalMonthly = bills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b-2 border-[#222] pb-6">
        <h2 className="font-press-start text-white text-lg tracking-wider">CONTAS RECORRENTES</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="p-[2px] pixel-corners bg-[#333] hover:bg-blue-500 group transition-all"
          >
            <div className="pixel-corners bg-[#18181b] px-4 py-2 flex items-center gap-2 group-hover:bg-blue-500 transition-colors">
              <Plus className="w-4 h-4 text-blue-500 group-hover:text-white" />
              <span className="font-press-start text-[10px] text-gray-400 group-hover:text-white uppercase line-height-none">Novo</span>
            </div>
          </button>
          
          {bills.length > 0 && (
            <button
              onClick={handleBatchAdd}
              disabled={isLoading}
              className="p-[2px] pixel-corners bg-[#ff6b6b] hover:bg-[#ff8b8b] group transition-all"
            >
              <div className="pixel-corners bg-[#ff6b6b] px-4 py-2 flex items-center gap-2 transition-colors shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.3)]">
                <Rocket className="w-4 h-4 text-white" />
                <span className="font-press-start text-[10px] text-white uppercase">Lanĉar Tudo</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="p-[2px] pixel-corners bg-blue-500 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleAddBill} className="pixel-corners bg-[#111] p-6 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="font-vt323 text-xl text-gray-500 uppercase">Nome</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#18181b] border-2 border-[#222] p-2 font-vt323 text-xl text-white outline-none focus:border-blue-500"
                placeholder="Ex: Netflix"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="font-vt323 text-xl text-gray-500 uppercase">Valor</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-[#18181b] border-2 border-[#222] p-2 font-vt323 text-xl text-white outline-none focus:border-blue-500"
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="font-vt323 text-xl text-gray-500 uppercase">Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-[47px] bg-[#18181b] border-2 border-[#222] px-2 font-vt323 text-xl text-white outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ESSENCIAL">Essencial</option>
                <option value="LAZER">Lazer</option>
                <option value="SAUDE">Saúde</option>
                <option value="DIVERSOS">Diversos</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-500 text-white font-press-start text-[10px] py-4 pixel-corners hover:bg-blue-600 transition-colors"
              >
                SALVAR
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 bg-[#222] text-gray-500 font-press-start text-[10px] py-4 pixel-corners hover:bg-[#333]"
              >
                X
              </button>
            </div>
          </form>
        </div>
      )}

      {bills.length === 0 ? (
        <div className="text-center py-10 bg-[#111] pixel-corners border-2 border-dashed border-[#222]">
          <p className="font-vt323 text-2xl text-gray-600 uppercase tracking-widest">Nenhuma conta recorrente forjada ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bills.map((bill) => (
            <div key={bill.id} className="p-[2px] pixel-corners bg-[#222] hover:bg-[#333] transition-all group">
              <div className="pixel-corners bg-[#111] p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="font-press-start text-[10px] text-white uppercase">{bill.name}</div>
                    <div className="font-vt323 text-lg text-gray-600 uppercase tracking-widest">{bill.category}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteBill(bill.id)}
                    className="p-2 hover:text-red-500 text-gray-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="font-press-start text-xl text-blue-400">
                  {formatCurrency(bill.amount)}
                </div>
              </div>
            </div>
          ))}
          
          {/* Resumo card */}
          <div className="p-[2px] pixel-corners bg-blue-500/30">
            <div className="pixel-corners bg-[#111] p-6 flex flex-col justify-center h-full">
               <div className="flex items-center gap-3 text-gray-500 text-xl uppercase mb-2">
                  <Calculator className="w-5 h-5" />
                  Total Recorrente
               </div>
               <div className="font-press-start text-2xl text-blue-400">
                  {formatCurrency(totalMonthly)}
               </div>
               <div className="font-vt323 text-lg text-gray-600 leading-tight mt-2 italic">
                  Gasto fixo mensal estimado.
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
