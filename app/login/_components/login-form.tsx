'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { RetroButton } from '@/components/RetroButton';
import toast from 'react-hot-toast';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid credentials');
        return;
      }

      toast.success('Welcome back, player!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="email" className="block text-[#ff6b6b] font-press-start text-[10px] uppercase">Email</label>
        <div className="p-[2px] pixel-corners bg-[#333] focus-within:bg-[#ff6b6b] transition-colors">
          <input
            id="email"
            type="email"
            placeholder="PLAYER@EXEMPLO.COM"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full bg-[#111] pixel-corners px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none text-2xl"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="block text-[#ff6b6b] font-press-start text-[10px] uppercase">Senha</label>
        </div>
        <div className="p-[2px] pixel-corners bg-[#333] focus-within:bg-[#ff6b6b] transition-colors">
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="w-full bg-[#111] pixel-corners px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none text-2xl"
          />
        </div>
      </div>

      <div className="pt-2">
        <RetroButton type="submit" active className="w-full" disabled={isLoading}>
          {isLoading ? 'LOGIN NO SERVIDOR...' : 'ENTRAR NO JOGO'}
        </RetroButton>
      </div>
    </form>
  );
}
