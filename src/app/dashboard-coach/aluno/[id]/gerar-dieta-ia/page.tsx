'use client'

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, BrainCircuit, Target, Zap } from 'lucide-react';

export default function GerarDietaIAPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState({
    weight: '',
    height: '',
    age: '',
    goal: 'Cutting',
    gender: 'Masculino',
    training_level: 'Intermediário'
  });

  const handleGenerate = async () => {
    if (!details.weight || !details.height || !details.age) {
      alert("Preencha todos os dados físicos do atleta!");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });

      if (res.ok) {
        const plan = await res.json();
        console.log("Dieta Gerada:", plan);
        alert("Estratégia de Elite gerada com sucesso!");
        router.push(`/dashboard-coach/aluno/${id}`);
      }
    } catch (err) {
      alert("Erro ao acionar a IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-20 font-sans">
      <header className="mb-8">
        <button onClick={() => router.back()} className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4 italic flex items-center gap-2">
          <ChevronLeft size={14} /> Cancelar Operação
        </button>
        <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
          IA <span className="text-blue-600">Engine</span>
        </h1>
      </header>

      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
        {/* Dados Físicos */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block italic">Peso (kg)</label>
            <input type="number" placeholder="00" className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-center" value={details.weight} onChange={e => setDetails({...details, weight: e.target.value})} />
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block italic">Alt (cm)</label>
            <input type="number" placeholder="000" className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-center" value={details.height} onChange={e => setDetails({...details, height: e.target.value})} />
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block italic">Idade</label>
            <input type="number" placeholder="00" className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-center" value={details.age} onChange={e => setDetails({...details, age: e.target.value})} />
          </div>
        </div>

        {/* Seleção de Estratégia */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block italic">Objetivo do Aluno</label>
            <select className="w-full p-5 bg-slate-50 rounded-2xl font-bold text-slate-800 appearance-none border-b-2 border-blue-600" value={details.goal} onChange={e => setDetails({...details, goal: e.target.value})}>
              <option value="Cutting">Cutting (Definição Extrema)</option>
              <option value="Bulking">Bulking (Ganho de Massa)</option>
              <option value="Maintenance">Manutenção</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block italic">Nível de Treino</label>
            <select className="w-full p-5 bg-slate-50 rounded-2xl font-bold text-slate-800 appearance-none border-b-2 border-blue-600" value={details.training_level} onChange={e => setDetails({...details, training_level: e.target.value})}>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado / Atleta</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-slate-900 text-white font-black py-7 rounded-[35px] uppercase tracking-[0.2em] text-[11px] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 italic"
        >
          {loading ? 'Calculando Estratégia...' : <><BrainCircuit size={22} className="text-blue-400" /> Ativar Inteligência Paulo Adriano</>}
        </button>
      </div>
    </div>
  );
}