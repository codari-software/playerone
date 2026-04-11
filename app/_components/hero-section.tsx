'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-player-cyan/10 via-transparent to-player-magenta/10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Gamepad2 className="w-6 h-6 text-player-cyan" />
              <span className="text-player-cyan font-semibold">Sua Vida, Seu Jogo</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Transforme Cada Dia Em Uma
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-player-cyan to-player-magenta">
                Jornada Épica
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              O PlayerOne gamifica sua vida real. Transforme hábitos em missões, gerencie finanças como tesouros e melhore a saúde evoluindo seu personagem. Ganhe XP, desbloqueie conquistas e suba de nível no jogo da vida.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="bg-player-dark/60 rounded-lg px-4 py-2 border border-player-cyan/30">
                <div className="text-2xl font-bold text-player-cyan">100+</div>
                <div className="text-sm text-gray-400">Níveis para Alcançar</div>
              </div>
              <div className="bg-player-dark/60 rounded-lg px-4 py-2 border border-player-magenta/30">
                <div className="text-2xl font-bold text-player-magenta">50+</div>
                <div className="text-sm text-gray-400">Conquistas</div>
              </div>
              <div className="bg-player-dark/60 rounded-lg px-4 py-2 border border-player-cyan/30">
                <div className="text-2xl font-bold text-player-cyan">3</div>
                <div className="text-sm text-gray-400">Módulos de Jogo</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-player-cyan/20 to-player-magenta/20 rounded-full blur-3xl" />
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center space-y-6">
                  <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-player-cyan to-player-magenta">
                    P1
                  </div>
                  <div className="text-2xl font-bold text-white">
                    Suba de Nível na Vida
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
