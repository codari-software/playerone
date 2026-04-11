'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Mensagem enviada! O pombo correio já partiu.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast.error('O feitiço falhou. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-vt323 text-xl">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-gray-300">NOME DO JOGADOR(A)</label>
          <div className="p-[2px] pixel-corners bg-[#333]">
            <input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Guerreiro P1"
              required
              className="w-full bg-[#111] pixel-corners text-white px-4 py-3 placeholder:text-gray-600 focus:outline-none focus:bg-[#222]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-gray-300">CANAIS DE COMUNICAÇÃO (EMAIL)</label>
          <div className="p-[2px] pixel-corners bg-[#333]">
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="seu@email.com.br"
              required
              className="w-full bg-[#111] pixel-corners text-white px-4 py-3 placeholder:text-gray-600 focus:outline-none focus:bg-[#222]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-gray-300">SOBRE O QUE É A QUEST? (ASSUNTO)</label>
        <div className="p-[2px] pixel-corners bg-[#333]">
          <input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Qual é o tema?"
            required
            className="w-full bg-[#111] pixel-corners text-white px-4 py-3 placeholder:text-gray-600 focus:outline-none focus:bg-[#222]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-gray-300">MENSAGEM SECRETA</label>
        <div className="p-[2px] pixel-corners bg-[#333]">
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Descreva todos os detalhes aqui..."
            required
            rows={6}
            className="w-full bg-[#111] pixel-corners text-white px-4 py-3 placeholder:text-gray-600 focus:outline-none focus:bg-[#222] resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 p-[2px] pixel-corners bg-[#ff6b6b] hover:bg-[#ff8b8b] w-full transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
      >
        <div className="pixel-corners w-full h-full flex items-center justify-center px-6 py-4 text-2xl tracking-wide bg-[#ff6b6b] text-white shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.3)]">
          {isLoading ? 'CONJURANDO MENSAGEM...' : 'ENVIAR PARA A GUILDA'}
        </div>
      </button>
    </form>
  );
}
