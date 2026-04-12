'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { LogOut, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function DashboardHeader() {
  const { data: session } = useSession() || {};

  return (
    <header className="sticky top-0 z-50 bg-[#111] border-b-[4px] border-[#222]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-3">
            <h1 className="font-press-start text-white text-xl tracking-widest uppercase hover:text-[#ff6b6b] transition-colors">PlayerOne</h1>
          </Link>

          <div className="flex items-center gap-6">
            {/* User Profile */}
            <Link href="/dashboard/profile" className="group">
              <div className="flex items-center gap-3 cursor-pointer p-2 rounded-xl transition-colors">
                <div className="w-8 h-8 p-[1px] pixel-corners bg-[#333] group-hover:bg-[#ff6b6b]">
                  <div className="w-full h-full bg-gradient-to-br from-pink-500 to-orange-400 pixel-corners" />
                </div>
                <span className="font-press-start text-xs hidden sm:block text-gray-400 group-hover:text-white transition-colors">
                  {session?.user?.name || 'Jogador'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white" />
              </div>
            </Link>

            {/* Logout Button */}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-[2px] pixel-corners bg-[#333] hover:bg-[#ff6b6b] group transition-all active:scale-95"
            >
              <div className="pixel-corners bg-[#18181b] px-4 py-2 flex items-center gap-2 group-hover:bg-[#ff6b6b] transition-colors">
                <LogOut className="w-4 h-4 text-gray-400 group-hover:text-white" />
                <span className="text-gray-400 group-hover:text-white text-xl">Sair</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
