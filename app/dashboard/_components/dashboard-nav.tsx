'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Target,
  DollarSign,
  Heart,
  Trophy,
  Award,
  User,
} from 'lucide-react';

const navItems = [
  { name: 'Início', href: '/dashboard', icon: Home },
  { name: 'Hábitos', href: '/dashboard/habits', icon: Target },
  { name: 'Finanças', href: '/dashboard/finances', icon: DollarSign },
  { name: 'Saúde', href: '/dashboard/health', icon: Heart },
  { name: 'Conquistas', href: '/dashboard/achievements', icon: Award },
  { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: Trophy },
  { name: 'Perfil', href: '/dashboard/profile', icon: User },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-[#111] border-r-[4px] border-[#222] min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="block group"
            >
              <div className={cn(
                'p-[2px] pixel-corners transition-all',
                isActive ? 'bg-[#ff6b6b]' : 'bg-[#333] hover:bg-[#555]'
              )}>
                <div className={cn(
                  'pixel-corners flex items-center gap-3 px-4 py-3 text-xl transition-all',
                  isActive ? 'bg-[#ff6b6b] text-white shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.3)]' : 'bg-[#18181b] text-gray-400 group-hover:text-white'
                )}>
                  <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-500 group-hover:text-[#ff6b6b]")} />
                  <span>{item.name}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
