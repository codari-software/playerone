'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  limitations?: string[];
  recommended?: boolean;
}

export function PricingCard({ name, price, description, features, limitations, recommended }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="relative"
    >
      {recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-player-cyan to-player-magenta text-white px-4 py-1 rounded-full text-sm font-semibold">
            Recomendado
          </div>
        </div>
      )}
      
      <Card className={`bg-player-dark/80 h-full backdrop-blur-sm transition-all ${
        recommended 
          ? 'border-2 border-player-cyan shadow-xl shadow-player-cyan/20' 
          : 'border border-player-cyan/30 hover:border-player-cyan'
      }`}>
        <CardHeader>
          <CardTitle className="text-2xl text-white">{name}</CardTitle>
          <CardDescription className="text-gray-300">{description}</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold text-white">{price}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-3">
            {features?.map?.((feature: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-player-cyan flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">{feature}</span>
              </li>
            ))}
            {limitations?.map?.((limitation: string, index: number) => (
              <li key={`limit-${index}`} className="flex items-start gap-2">
                <X className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-500 text-sm">{limitation}</span>
              </li>
            ))}
          </ul>
          
          <Link href="/signup" className="block">
            <Button 
              className={`w-full mt-4 ${
                recommended 
                  ? 'bg-gradient-to-r from-player-cyan to-player-magenta hover:opacity-90' 
                  : 'bg-player-cyan hover:bg-player-cyan/90'
              }`}
            >
              Começar Agora
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
