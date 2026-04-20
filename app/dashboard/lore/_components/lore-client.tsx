'use client';

import { FileText, Plus, Search, Book, Sparkles, ScrollText, PenTool, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { saveNote, deleteNote } from '../../actions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
}

export function LoreClient({ initialNotes }: { initialNotes: Note[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [search, setSearch] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('DIÁRIO');

  const filteredNotes = initialNotes.filter(n => {
    const matchesCategory = activeCategory === 'ALL' || n.category === activeCategory;
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                          n.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    try {
      await saveNote(title, content, category);
      toast.success('Crônica registrada com sucesso!');
      setIsModalOpen(false);
      setTitle('');
      setContent('');
      router.refresh();
    } catch (error) {
      toast.error('Erro ao salvar nota');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente apagar esta crônica?')) return;

    try {
      await deleteNote(id);
      toast.success('Crônica apagada!');
      router.refresh();
    } catch (error) {
      toast.error('Erro ao apagar crônica');
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="animate-in fade-in slide-in-from-left duration-500">
        <h1 className="font-press-start text-white text-2xl mb-4 flex items-center gap-4">
          <FileText className="w-8 h-8 text-[#ff6b6b]" />
          LORE & NOTAS
        </h1>
        <p className="text-2xl text-gray-400">O diário de bordo da sua evolução e o repositório das suas ideias mais lendárias.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar / Filters */}
        <div className="space-y-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full py-6 bg-[#ff6b6b] text-white font-press-start text-xs pixel-corners hover:bg-red-600 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            NOVA ENTRADA
          </button>

          <div className="p-[2px] pixel-corners bg-[#222]">
            <div className="pixel-corners bg-[#18181b] p-4 space-y-2">
              {['ALL', 'LORE', 'PROJETOS', 'DIÁRIO', 'IDEIAS'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "w-full p-4 font-press-start text-[10px] text-left pixel-corners transition-all",
                    activeCategory === cat ? "bg-[#ff6b6b]/20 text-[#ff6b6b]" : "text-gray-500 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="PESQUISAR NAS CRÔNICAS..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#18181b] border-2 border-[#222] p-6 pl-14 font-vt323 text-2xl text-white pixel-corners focus:border-[#ff6b6b] outline-none transition-all"
            />
          </div>

          <div className="grid gap-6">
            {filteredNotes.map((note) => (
              <div 
                key={note.id}
                className="group p-[2px] pixel-corners bg-[#222] hover:bg-[#ff6b6b] transition-all cursor-pointer"
              >
                <div className="pixel-corners bg-[#18181b] p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <ScrollText className="w-4 h-4 text-[#ff6b6b]" />
                        <h3 className="font-press-start text-sm text-white group-hover:text-[#ff6b6b] transition-colors">{note.title}</h3>
                      </div>
                      <p className="font-vt323 text-xl text-gray-500 uppercase tracking-widest">{note.date} — {note.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(note.id);
                        }}
                        className="p-2 text-gray-700 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <PenTool className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  
                  <p className="font-vt323 text-2xl text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>

                  <div className="pt-4 border-t border-[#222] flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-press-start text-[8px] text-[#ff6b6b]">LER CRÔNICA COMPLETA</span>
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-20 bg-[#18181b] border-2 border-dashed border-[#222] pixel-corners">
              <Book className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="font-press-start text-xs text-gray-600">NENHUMA NOTA ENCONTRADA.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nova Entrada */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl p-[2px] pixel-corners bg-[#ff6b6b]">
            <div className="bg-[#111] pixel-corners p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2">
                <h2 className="font-press-start text-xl text-white">NOVA CRÔNICA</h2>
                <p className="text-gray-500">Registre seus pensamentos ou planos de projeto.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-press-start text-[10px] text-gray-400">TÍTULO</label>
                  <input 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value.toUpperCase())}
                    className="w-full bg-[#18181b] border-2 border-[#222] p-4 font-vt323 text-2xl text-white pixel-corners focus:border-[#ff6b6b] outline-none"
                    placeholder="TITULO DA NOTA..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-press-start text-[10px] text-gray-400">CATEGORIA</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#18181b] border-2 border-[#222] p-4 font-vt323 text-2xl text-white pixel-corners focus:border-[#ff6b6b] outline-none"
                  >
                    {['LORE', 'PROJETOS', 'DIÁRIO', 'IDEIAS'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-press-start text-[10px] text-gray-400">CONTEÚDO</label>
                  <textarea 
                    required
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-[#18181b] border-2 border-[#222] p-4 font-vt323 text-2xl text-white pixel-corners focus:border-[#ff6b6b] outline-none resize-none"
                    placeholder="ESCREVA AQUI..."
                  />
                </div>

                <button 
                  disabled={loading}
                  className="w-full py-6 bg-[#ff6b6b] text-white font-press-start text-xs pixel-corners hover:bg-red-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? 'REGISTRANDO...' : 'SALVAR NA HISTÓRIA'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
