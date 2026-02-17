'use client'
import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function AiPlanGenerator({ studentData, onPlanGenerated }: any) {
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const res = await fetch('/api/ai/generate-plan', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
    const data = await res.json();
    onPlanGenerated(data); // Essa função vai preencher os estados do seu formulário principal
    setLoading(false);
  };

  return (
    <button 
      type="button"
      onClick={generate}
      disabled={loading}
      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-4 rounded-3xl uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg mb-6 hover:brightness-110 transition-all"
    >
      <Sparkles size={16} />
      {loading ? 'A Inteligência Artificial está montando o plano...' : 'Gerar Estratégia com IA do Paulo'}
    </button>
  );
}