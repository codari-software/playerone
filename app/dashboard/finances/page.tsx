import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { TransactionList } from './_components/transaction-list';
import { AddTransactionButton } from './_components/add-transaction-button';
import { FinanceChart } from './_components/finance-chart';
import { RecurringBills } from './_components/recurring-bills';
import { formatCurrency, cn } from '@/lib/utils';
import { startOfMonth, endOfMonth } from 'date-fns';

import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function FinancesPage() {
  const session = await getServerSession(authOptions);
  const guestId = cookies().get('playerone_guest_id')?.value;
  const userId = (session?.user as any)?.id || guestId;
  
  if (!userId) {
    redirect('/');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      financeTransactions: {
        orderBy: { date: 'desc' },
      },
      recurringBills: {
        orderBy: { updatedAt: 'desc' }
      }
    },
  });

  if (!user) {
    redirect('/');
  }


  // Filtrar apenas transações do mês atual para os contadores principais
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const currentMonthTransactions = user.financeTransactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate >= start && tDate <= end;
  });

  const totalIncome = currentMonthTransactions
    ?.filter?.((t: any) => t?.type === 'INCOME')
    ?.reduce?.((sum: number, t: any) => sum + (t?.amount ?? 0), 0) ?? 0;

  const totalExpenses = currentMonthTransactions
    ?.filter?.((t: any) => t?.type === 'EXPENSE')
    ?.reduce?.((sum: number, t: any) => sum + (t?.amount ?? 0), 0) ?? 0;

  const balance = totalIncome - totalExpenses;

  const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(now);

  return (
    <div className="space-y-10 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 pb-4 border-b-2 border-[#222]">
        <div className="animate-in fade-in slide-in-from-left duration-500 max-w-full">
          <h1 className="font-press-start text-white text-xl md:text-2xl mb-4 flex items-center gap-4">
            <DollarSign className="w-8 h-8 text-blue-400" />
            FINANÇAS & OURO
          </h1>
          <p className="font-vt323 text-2xl text-gray-400 leading-tight">
            Seu saldo de <span className="text-white uppercase">{monthName}</span>. O ouro reseta visualmente a cada novo mês!
          </p>
        </div>
        <div className="flex-shrink-0">
           <AddTransactionButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
        <div className="p-[2px] pixel-corners bg-[#333]">
          <div className="pixel-corners bg-[#18181b] p-6 h-full">
            <div className="flex items-center gap-2 text-gray-600 font-vt323 text-2xl uppercase mb-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Ganhos ({monthName})
            </div>
            <div className="font-press-start text-xl sm:text-2xl text-green-500 break-all leading-tight">
              {formatCurrency(totalIncome)}
            </div>
          </div>
        </div>

        <div className="p-[2px] pixel-corners bg-[#333]">
          <div className="pixel-corners bg-[#18181b] p-6 h-full">
            <div className="flex items-center gap-2 text-gray-600 font-vt323 text-2xl uppercase mb-3">
              <TrendingDown className="w-5 h-5 text-red-500" />
              Gastos ({monthName})
            </div>
            <div className="font-press-start text-xl sm:text-2xl text-red-500 break-all leading-tight">
              {formatCurrency(totalExpenses)}
            </div>
          </div>
        </div>

        <div className="p-[2px] pixel-corners bg-[#333]">
          <div className="pixel-corners bg-[#18181b] p-6 h-full">
            <div className="flex items-center gap-2 text-gray-600 font-vt323 text-2xl uppercase mb-3">
              <Wallet className="w-5 h-5 text-blue-400" />
              Saldo Atual
            </div>
            <div className={cn(
              "font-press-start text-xl sm:text-2xl break-all leading-tight",
              balance >= 0 ? 'text-blue-400' : 'text-red-500'
            )}>
              {formatCurrency(balance)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-[2px] pixel-corners bg-[#333] animate-in fade-in duration-1000 delay-200">
         <div className="pixel-corners bg-[#18181b] p-6 sm:p-10 space-y-12 overflow-hidden">
            <div className="w-full">
               <FinanceChart transactions={user.financeTransactions ?? []} />
            </div>
            <div className="border-t-2 border-[#222] pt-12">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="font-press-start text-[10px] text-white uppercase">Transações de {monthName}</h3>
               </div>
               <TransactionList transactions={currentMonthTransactions} />
            </div>
         </div>
      </div>

      <div className="animate-in fade-in duration-1000 delay-300">
         <RecurringBills bills={user.recurringBills ?? []} />
      </div>
    </div>
  );
}
