'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface ModuleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  color: 'cyan' | 'magenta';
}

export function ModuleCard({ icon, title, description, features, color }: ModuleCardProps) {
  const borderColor = color === 'cyan' ? 'border-player-cyan/30' : 'border-player-magenta/30';
  const hoverBorderColor = color === 'cyan' ? 'hover:border-player-cyan' : 'hover:border-player-magenta';
  const iconColor = color === 'cyan' ? 'text-player-cyan' : 'text-player-magenta';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      <Card className={`bg-player-dark/80 border ${borderColor} ${hoverBorderColor} transition-all h-full backdrop-blur-sm`}>
        <CardHeader>
          <div className={`${iconColor} mb-4`}>
            {icon}
          </div>
          <CardTitle className="text-white">{title}</CardTitle>
          <CardDescription className="text-gray-300">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {features?.map?.((feature: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
                <span className="text-gray-300 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
