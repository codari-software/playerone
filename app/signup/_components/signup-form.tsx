'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { RetroButton } from '@/components/RetroButton';
import toast from 'react-hot-toast';

export function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error ?? 'Falha ao criar conta');
        return;
      }

      toast.success('Pombo correio enviado com seu código!');
      setStep('verify');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('Ocorreu um erro.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error ?? 'Código inválido');
        return;
      }

      toast.success('Conta verificada! Entrando no servidor...');

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Falha ao autenticar.');
        router.push('/login');
        return;
      }

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Verify error:', error);
      toast.error('Erro ao verificar o código');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <form onSubmit={handleVerify} className="space-y-6">
        <div className="text-center mb-6">
          <p className="text-gray-400 text-xl font-vt323">
            Enviamos um código de acesso para <span className="text-[#ff6b6b]">{formData.email}</span>.
          </p>
        </div>
        <div className="space-y-3">
          <label htmlFor="code" className="block text-[#ff6b6b] font-press-start text-[10px] uppercase">Código Especial</label>
          <div className="p-[2px] pixel-corners bg-[#333] focus-within:bg-[#ff6b6b] transition-colors">
            <input
              id="code"
              type="text"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full bg-[#111] pixel-corners px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none text-center text-4xl font-press-start tracking-widest"
            />
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" disabled={isLoading} className="w-full">
            <RetroButton active className="w-full">
              {isLoading ? 'VERIFICANDO...' : 'CONFIRMAR ACESSO'}
            </RetroButton>
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSignup} className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="name" className="block text-[#ff6b6b] font-press-start text-[10px] uppercase">Nome do Jogador</label>
        <div className="p-[2px] pixel-corners bg-[#333] focus-within:bg-[#ff6b6b] transition-colors">
          <input
            id="name"
            type="text"
            placeholder="SEU NOME DE HERÓI"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full bg-[#111] pixel-corners px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none text-2xl uppercase"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="email" className="block text-[#ff6b6b] font-press-start text-[10px] uppercase">Email de Acesso</label>
        <div className="p-[2px] pixel-corners bg-[#333] focus-within:bg-[#ff6b6b] transition-colors">
          <input
            id="email"
            type="email"
            placeholder="PLAYER@EXEMPLO.COM"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full bg-[#111] pixel-corners px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none text-2xl uppercase"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="password" className="block text-[#ff6b6b] font-press-start text-[10px] uppercase">Senha de Segurança</label>
        <div className="p-[2px] pixel-corners bg-[#333] focus-within:bg-[#ff6b6b] transition-colors">
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={6}
            className="w-full bg-[#111] pixel-corners px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none text-2xl"
          />
        </div>
      </div>

      <div className="pt-2">
        <button type="submit" disabled={isLoading} className="w-full">
          <RetroButton active className="w-full">
            {isLoading ? 'CRIANDO PERSONAGEM...' : 'INICIAR AVENTURA'}
          </RetroButton>
        </button>
      </div>
    </form>
  );
}
