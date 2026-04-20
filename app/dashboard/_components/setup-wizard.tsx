'use client';

import { useState } from 'react';
import { RetroButton } from '@/components/RetroButton';
import { checkNickname, saveNickname, saveCharacterClass, saveCharacterSkin, completeTutorial } from '../actions';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Shield, Wand2, Target as ArcherIcon, Check, ChevronRight, ChevronLeft, User as UserIcon } from 'lucide-react';
import Image from 'next/image';

const CLASSES = [
  // ... (keep classes as is)
  {
    id: 'WARRIOR',
    name: 'Guerreiro',
    description: 'Especialista em exercícios físicos e força',
    bonus: '+10% XP em treinos e força',
    icon: Shield,
    color: 'text-orange-500',
    borderColor: 'border-orange-500/50',
    bgColor: 'bg-orange-500/10',
    image: '/images/classes/warrior.png'
  },
  {
    id: 'MAGE',
    name: 'Mago',
    description: 'Foco em estudo, concentração e produtividade',
    bonus: '+10% XP em hábitos de aprendizado e produtividade',
    icon: Wand2,
    color: 'text-blue-400',
    borderColor: 'border-blue-400/50',
    bgColor: 'bg-blue-400/10',
    image: '/images/classes/mage.png'
  },
  {
    id: 'ARCHER',
    name: 'Arqueiro',
    description: 'Mestre em rotina e constância',
    bonus: '+10% XP quando há streak ativa',
    icon: ArcherIcon,
    color: 'text-green-400',
    borderColor: 'border-green-400/50',
    bgColor: 'bg-green-400/10',
    image: '/images/classes/archer.png'
  }
];

const SKINS = {
  male: ['skin01.png', 'skin02.png', 'skin03.png', 'skin04.png', 'skin05.png'],
  female: ['skin01.png', 'skin02.png', 'skin03.png', 'skin04.png', 'skin05.png']
};

export function SetupWizard({ userEmail }: { userEmail: string }) {
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [selectedSkin, setSelectedSkin] = useState<string | null>(null);
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
        setStep(2);
      }
    } catch (err) {
      setError('Ocorreu um erro ao salvar o nickname.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClass = async () => {
    if (!selectedClass) return;

    setLoading(true);
    try {
      await saveCharacterClass(selectedClass as any);
      setStep(3); // Skin selection
    } catch (err) {
      setError('Ocorreu um erro ao salvar sua classe.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSkin = async () => {
    if (!selectedSkin) return;

    setLoading(true);
    try {
      await saveCharacterSkin(selectedGender, selectedSkin);
      setStep(4); // Tutorial
    } catch (err) {
      setError('Ocorreu um erro ao salvar sua skin.');
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
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center p-4 md:p-8">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-red-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl w-full relative max-h-[95vh] flex flex-col">

        <div className="p-[2px] pixel-corners bg-gradient-to-b from-white/10 to-transparent overflow-hidden flex flex-col">
          <div className="pixel-corners bg-[#111] p-6 md:p-12 relative overflow-y-auto min-h-[500px] flex flex-col scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            
            {/* Step Indicator (Inside) */}
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div 
                    key={s}
                    className={cn(
                      "h-1.5 w-8 md:w-12 rounded-full transition-all duration-500",
                      step >= s ? "bg-[#ff6b6b] shadow-[0_0_10px_rgba(255,107,107,0.5)]" : "bg-white/10"
                    )}
                  />
                ))}
              </div>
              <span className="font-press-start text-[10px] text-white/40 uppercase tracking-widest">
                {step} / 5
              </span>
            </div>
            
            {/* Step 1: Nickname */}
            {step === 1 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="relative">
                  <div className="text-7xl animate-bounce">🎭</div>
                  <div className="absolute -inset-4 bg-red-500/20 blur-2xl rounded-full -z-10" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="font-press-start text-2xl md:text-4xl text-white tracking-tighter">
                    QUAL SEU <span className="text-[#ff6b6b]">CODNOME</span>?
                  </h2>
                  <p className="text-lg text-gray-400 max-w-lg mx-auto">
                    Sua jornada no PlayerOne começa aqui. Como o mundo deve te conhecer?
                  </p>
                </div>
                
                <div className="w-full max-w-md space-y-6">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="DIGITE SEU NICKNAME..."
                      value={nickname}
                      autoFocus
                      onChange={(e) => setNickname(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                      className="w-full px-8 py-6 bg-white/5 border-2 border-white/10 font-press-start text-center text-xl text-[#ff6b6b] focus:border-[#ff6b6b]/50 focus:bg-white/10 outline-none transition-all pixel-corners"
                    />
                    <div className="absolute inset-0 border-2 border-[#ff6b6b] opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none blur-sm" />
                  </div>
                  
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 pixel-corners">
                      <p className="text-red-500 font-press-start text-[10px]">{error}</p>
                    </div>
                  )}
                  
                  <RetroButton 
                    active 
                    className="w-full py-6 text-xl group" 
                    onClick={handleCreateNickname}
                    disabled={loading || nickname.length < 3}
                  >
                    <span className="flex items-center justify-center gap-4">
                      {loading ? 'PROCESSANDO...' : 'CONTINUAR'}
                      {!loading && <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
                    </span>
                  </RetroButton>
                </div>
              </div>
            )}

            {/* Step 2: Class Selection */}
            {step === 2 && (
              <div className="flex-1 flex flex-col space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="text-center space-y-2">
                  <h2 className="font-press-start text-xl md:text-3xl text-white">ESCOLHA SUA CLASSE</h2>
                  <p className="text-sm text-gray-400">Selecione o arquétipo que melhor define seus objetivos</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {CLASSES.map((cls) => {
                    const isSelected = selectedClass === cls.id;
                    
                    return (
                      <button
                        key={cls.id}
                        onClick={() => setSelectedClass(cls.id)}
                        className={cn(
                          "relative group p-6 flex flex-col items-center text-center space-y-6 transition-all duration-300 pixel-corners border-2",
                          isSelected 
                            ? cls.borderColor + " " + cls.bgColor + " scale-[1.02] shadow-[0_0_30px_rgba(0,0,0,0.5)]" 
                            : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
                        )}
                      >
                        {isSelected && (
                          <div className={cn("absolute top-4 right-4 p-1 rounded-full z-20", cls.bgColor)}>
                            <Check className={cn("w-4 h-4", cls.color)} />
                          </div>
                        )}

                        <div className={cn(
                          "w-32 h-32 rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-500",
                          isSelected ? "ring-4 ring-[#ff6b6b]/50 shadow-[0_0_30px_rgba(255,107,107,0.3)]" : "ring-2 ring-white/5"
                        )}>
                          <Image 
                            src={cls.image} 
                            alt={cls.name} 
                            fill
                            className={cn(
                              "object-cover transition-all duration-700",
                              isSelected ? "scale-110 grayscale-0" : "grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                            )}
                          />
                          <div className={cn(
                            "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-500",
                            isSelected && "opacity-100"
                          )} />
                        </div>

                        <div className="space-y-2 relative z-10">
                          <h3 className={cn("font-press-start text-lg", isSelected ? cls.color : "text-white")}>
                            {cls.name}
                          </h3>
                          <p className="text-sm text-gray-500 leading-relaxed px-4">
                            {cls.description}
                          </p>
                        </div>

                        <div className={cn(
                          "mt-auto px-4 py-2 text-[10px] font-press-start border pixel-corners",
                          isSelected ? cls.borderColor + " " + cls.color : "border-white/5 text-white/20"
                        )}>
                          {cls.bonus}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-white/5">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-press-start text-[10px]"
                  >
                    <ChevronLeft className="w-4 h-4" /> VOLTAR
                  </button>
                  <RetroButton 
                    active={!!selectedClass} 
                    className="px-12 py-4" 
                    onClick={handleSelectClass}
                    disabled={loading || !selectedClass}
                  >
                    {loading ? 'CONFIRMANDO...' : 'ESCOLHER CLASSE'}
                  </RetroButton>
                </div>
              </div>
            )}

            {/* Step 3: Skin Selection */}
            {step === 3 && (
              <div className="flex-1 flex flex-col space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="text-center space-y-2">
                  <h2 className="font-press-start text-xl md:text-3xl text-white">ESCOLHA SUA SKIN</h2>
                  <p className="text-sm text-gray-400">Personalize seu avatar para iniciar a aventura</p>
                </div>

                {/* Gender Toggle */}
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => { setSelectedGender('male'); setSelectedSkin(null); }}
                    className={cn(
                      "px-8 py-4 font-press-start text-xs pixel-corners border-2 transition-all",
                      selectedGender === 'male' ? "bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]" : "bg-white/5 border-white/10 text-gray-500"
                    )}
                  >
                    MASCULINO
                  </button>
                  <button 
                    onClick={() => { setSelectedGender('female'); setSelectedSkin(null); }}
                    className={cn(
                      "px-8 py-4 font-press-start text-xs pixel-corners border-2 transition-all",
                      selectedGender === 'female' ? "bg-pink-500/20 border-pink-500 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.3)]" : "bg-white/5 border-white/10 text-gray-500"
                    )}
                  >
                    FEMININO
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {SKINS[selectedGender].map((skin) => {
                    const isSelected = selectedSkin === skin;
                    const skinPath = `/images/skins/free/${selectedGender}/${skin}`;
                    
                    return (
                      <button
                        key={skin}
                        onClick={() => setSelectedSkin(skin)}
                        className={cn(
                          "relative group aspect-square p-2 pixel-corners border-2 transition-all duration-300",
                          isSelected 
                            ? "bg-red-500/10 border-[#ff6b6b] scale-105 shadow-[0_0_20px_rgba(255,107,107,0.3)]" 
                            : "bg-white/5 border-white/10 hover:border-white/30"
                        )}
                      >
                        <div className="relative w-full h-full">
                          <Image 
                            src={skinPath} 
                            alt={skin} 
                            fill
                            className={cn(
                              "object-contain transition-all duration-500",
                              isSelected ? "grayscale-0" : "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100"
                            )}
                          />
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-[#ff6b6b] p-0.5 rounded-full">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-white/5">
                  <button 
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-press-start text-[10px]"
                  >
                    <ChevronLeft className="w-4 h-4" /> VOLTAR
                  </button>
                  <RetroButton 
                    active={!!selectedSkin} 
                    className="px-12 py-4" 
                    onClick={handleSelectSkin}
                    disabled={loading || !selectedSkin}
                  >
                    {loading ? 'CONFIRMANDO...' : 'VESTIR SKIN'}
                  </RetroButton>
                </div>
              </div>
            )}

            {/* Step 4: Tutorial Map */}
            {step === 4 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500 flex-1 flex flex-col justify-center">
                <div className="text-center space-y-4">
                  <h2 className="font-press-start text-2xl text-white">CONHEÇA SEU QG</h2>
                  <p className="text-gray-400">Suas ferramentas para dominar a realidade</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="group space-y-4 p-6 bg-white/[0.02] border-2 border-white/5 pixel-corners hover:border-red-500/50 transition-all">
                    <div className="text-5xl group-hover:scale-110 transition-transform">⚔️</div>
                    <div className="space-y-2">
                      <h3 className="font-press-start text-red-500 text-xs tracking-wider">HÁBITOS</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">Sete suas tarefas diárias. Cada check-in te dá XP e aumenta sua força.</p>
                    </div>
                  </div>
                  <div className="group space-y-4 p-6 bg-white/[0.02] border-2 border-white/5 pixel-corners hover:border-blue-500/50 transition-all">
                    <div className="text-5xl group-hover:scale-110 transition-transform">💰</div>
                    <div className="space-y-2">
                      <h3 className="font-press-start text-blue-400 text-xs tracking-wider">FINANÇAS</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">Monitore seus ganhos e gastos. Ouro bem gasto é investimento no seu futuro.</p>
                    </div>
                  </div>
                  <div className="group space-y-4 p-6 bg-white/[0.02] border-2 border-white/5 pixel-corners hover:border-green-500/50 transition-all">
                    <div className="text-5xl group-hover:scale-110 transition-transform">🏋️</div>
                    <div className="space-y-2">
                      <h3 className="font-press-start text-green-400 text-xs tracking-wider">TREINO</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">Séries, repetições e carga. Sua força física determina o limite da sua resistência.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                  <RetroButton active className="px-16 py-6 text-lg" onClick={() => setStep(5)}>
                    PRÓXIMO PASSO »
                  </RetroButton>
                </div>
              </div>
            )}

            {/* Step 5: Finalize */}
            {step === 5 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in zoom-in-95 duration-500">
                <div className="relative">
                  <div className="text-8xl animate-pulse">🏆</div>
                  <div className="absolute -inset-8 bg-yellow-500/20 blur-3xl rounded-full -z-10" />
                </div>
                
                <div className="space-y-6">
                  <h2 className="font-press-start text-2xl md:text-4xl text-white uppercase italic tracking-tighter">
                    O RANKING TE ESPERA
                  </h2>
                  <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Você agora faz parte da <strong className="text-white">Season 1</strong>. Cada ação real te aproxima do topo. 
                    Mostre que você é o <strong className="text-[#ff6b6b]">PlayerOne</strong>.
                  </p>
                </div>

                <div className="w-full max-w-md bg-white/[0.03] p-8 pixel-corners border-2 border-yellow-500/20 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-yellow-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-press-start text-[10px] text-yellow-500">CONQUISTA:</span>
                      <span className="font-press-start text-[10px] text-green-400">+50 XP</span>
                    </div>
                    <p className="text-white font-press-start text-sm tracking-widest">PRIMEIROS PASSOS</p>
                  </div>
                </div>
                
                <RetroButton active className="w-full max-w-md py-8 text-2xl shadow-[0_0_50px_rgba(255,107,107,0.3)]" onClick={handleCompleteTutorial} disabled={loading}>
                  {loading ? 'CARREGANDO MUNDO...' : 'INICIAR JORNADA'}
                </RetroButton>
              </div>
            )}

            {/* Decoration */}
            <div className="absolute bottom-4 right-8 opacity-5 font-press-start text-[120px] pointer-events-none select-none">
              {step}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
