'use client';

import { HabitCard } from './habit-card';
import { motion } from 'framer-motion';

interface HabitListProps {
  habits: any[];
}

export function HabitList({ habits }: HabitListProps) {
  if (!habits || habits.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <p className="font-press-start text-[10px] sm:text-xs text-gray-600 uppercase">Nenhuma missão ativa. Forje sua primeira jornada agora!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {habits.map((habit: any, index: number) => (
        <motion.div
          key={habit?.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <HabitCard habit={habit} />
        </motion.div>
      ))}
    </div>
  );
}
