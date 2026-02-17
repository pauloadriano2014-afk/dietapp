'use client'

import { X } from 'lucide-react'

interface Suggestion {
  type: string;
  options: string;
}

export default function EatingOutModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  const suggestions: Suggestion[] = [
    { type: 'Proteína Limpa', options: 'Filé de frango, Mignon, Peixe grelhado ou Omelete (sem queijo).' },
    { type: 'Carboidratos Complexos', options: 'Arroz branco, Batata cozida ou Legumes no vapor.' },
    { type: 'Estratégia do Campeão', options: 'Peça o molho à parte, evite frituras/empanados e priorize água com limão.' }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[45px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase italic leading-none tracking-tighter">
              Comer<br/><span className="text-blue-600">Fora</span>
            </h2>
            <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full"></div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
          Estratégias de Performance
        </p>
        
        <div className="space-y-4 mb-10">
          {suggestions.map((s, i) => (
            <div key={i} className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col gap-1">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                {s.type}
              </p>
              <p className="text-sm font-bold text-slate-800 leading-snug">
                {s.options}
              </p>
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-slate-900 text-white font-black py-6 rounded-[30px] uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 active:scale-95 transition-all"
        >
          Entendido, Coach!
        </button>
      </div>
    </div>
  );
}