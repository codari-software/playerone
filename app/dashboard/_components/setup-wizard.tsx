'use client';

import { useState } from 'react';
import { RetroButton } from '@/components/RetroButton';
import { checkNickname, saveNickname, completeTutorial } from '../actions';
import { useRouter } from 'next/navigation';

export function SetupWizard({ userEmail }: { userEmail: string }) {
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreateNickname = async () => {
    if (!nickname || nickname.length < 3) {
      setError('Nickname deve ter pelo menos 3 caracteres.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await saveNickname(nickname);
      if (result.error) {
        setError(result.error);
      } else {
        setStep(2); // Vai para o tutorial
      }
    } catch (err) {
      setError('Ocorreu um erro ao salvar o nickname.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTutorial = async () => {
    setLoading(true);
    try {
      await completeTutorial();
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full p-[4px] pixel-corners bg-gradient-to-r from-[#ff6b6b] to-purple-600 shadow-[0_0_50px_rgba(255,107,107,0.3)]">
        <div className="pixel-corners bg-[#111] p-8 md:p-12 relative overflow-hidden">
          
          {/* Step 1: Nickname */}
          {step === 1 && (
            <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-6xl animate-bounce">🎭</div>
              <h2 className="font-press-start text-2xl md:text-3xl text-white">ESCOLHA SEU NOME DE GUERRA</h2>
              <p className="text-xl text-gray-400 max-w-lg">
                Seu nickname será sua identidade no PlayerOne. Escolha com sabedoria, herói.
              </p>
              
              <div className="w-full max-w-sm space-y-4">
                <input
                  type="text"
                  placeholder="DIGITE SEU NICKNAME..."
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                  className="w-full px-6 py-4 bg-[#18181b] border-4 border-[#333] font-press-start text-center text-[#ff6b6b] focus:border-[#ff6b6b] outline-none transition-colors"
                />
                {error && <p className="text-red-500 font-press-start text-xs tracking-tight">{error}</p>}
                
                <RetroButton 
                  active 
                  className="w-full py-6 text-xl" 
                  onClick={handleCreateNickname}
                  disabled={loading || nickname.length < 3}
                >
                  {loading ? 'PROCESSANDO...' : 'CRIAR PERSONAGEM'}
                </RetroButton>
              </div>
            </div>
          )}

          {/* Step 2: Tutorial Intro */}
          {step === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="text-center">
                <h2 className="font-press-start text-2xl text-white mb-4">MAPA DA JORNADA</h2>
                <p className="text-xl text-gray-400">Pressione "Próximo" para aprender as mecânicas.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-[#18181b] pixel-corners border-2 border-red-500/50 hover:border-red-500 transition-colors">
                  <div className="text-4xl mb-4">⚔️</div>
                  <h3 className="font-press-start text-[#ff6b6b] text-xs mb-2">HÁBITOS</h3>
                  <p className="text-gray-400">Sete suas tarefas diárias. Complete para ganhar XP e Ouro.</p>
                </div>
                <div className="p-4 bg-[#18181b] pixel-corners border-2 border-blue-500/50 hover:border-blue-500 transition-colors">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="font-press-start text-blue-400 text-xs mb-2">FINANÇAS</h3>
                  <p className="text-gray-400">Cuide do seu tesouro. Categorize gastos e bata metas de economia.</p>
                </div>
                <div className="p-4 bg-[#18181b] pixel-corners border-2 border-green-500/50 hover:border-green-500 transition-colors">
                  <div className="text-4xl mb-4">❤️</div>
                  <h3 className="font-press-start text-green-400 text-xs mb-2">SAÚDE</h3>
                  <p className="text-gray-400">Mantenha seu HP cheio bebendo água, dormindo e treinando.</p>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <RetroButton active className="px-12" onClick={() => setStep(3)}>
                  ENTENDER MECÂNICAS »
                </RetroButton>
              </div>
            </div>
          )}

          {/* Step 3: Social & Rank Tutorial */}
          {step === 3 && (
            <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="text-6xl">🏆</div>
              <h2 className="font-press-start text-2xl text-white uppercase italic">O RANKING GLOBAL TE ESPERA</h2>
              <p className="text-xl text-gray-400 max-w-2xl">
                Você agora faz parte da <strong className="text-white">Season 1</strong>. Cada ação sua no mundo real te coloca mais perto do topo do Leaderboard. 
                Prove que você é o <strong className="text-[#ff6b6b]">PlayerOne</strong>.
              </p>

              <div className="w-full bg-[#18181b] p-6 pixel-corners border-2 border-yellow-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-press-start text-xs text-yellow-500">CONQUISTA DESBLOQUEADA:</span>
                  <span className="font-press-start text-xs text-green-400">+50 XP</span>
                </div>
                <p className="text-white font-press-start text-sm">PRIMEIROS PASSOS</p>
              </div>
              
              <RetroButton active className="px-12 py-6 text-xl" onClick={handleCompleteTutorial} disabled={loading}>
                {loading ? 'CARREGANDO MUNDO...' : 'INICIAR JOGO AGORA'}
              </RetroButton>
            </div>
          )}

          {/* Background decoration elements */}
          <div className="absolute top-0 right-0 p-4 opacity-10 font-press-start text-[100px] pointer-events-none">1</div>
          <div className="absolute bottom-0 left-0 p-4 opacity-5 font-press-start text-[140px] pointer-events-none select-none">P</div>
        </div>
      </div>
    </div>
  );
}
