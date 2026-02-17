'use client'

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ManagePlans() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  
  const [loading, setLoading] = useState(false);
  const [meal, setMeal] = useState({
    title: '',
    time: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  const [items, setItems] = useState([{ name: '', amount: '', substitutions: '' }]);

  const addItem = () => setItems([...items, { name: '', amount: '', substitutions: '' }]);

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch('/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...meal, items, studentId }),
    });

    if (response.ok) {
      alert('Refeição e itens salvos com sucesso!');
      router.refresh();
      setMeal({ title: '', time: '', calories: '', protein: '', carbs: '', fats: '' });
      setItems([{ name: '', amount: '', substitutions: '' }]);
    } else {
      alert('Erro ao salvar plano alimentar');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-20">
      <button onClick={() => router.back()} className="text-slate-400 font-bold text-[10px] mb-6 uppercase tracking-widest italic">
        ← Voltar ao Painel
      </button>

      <h1 className="text-3xl font-black text-slate-900 uppercase italic mb-8 tracking-tighter leading-none">
        Montar<br/><span className="text-blue-600">Estratégia</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cabeçalho da Refeição */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 space-y-4">
          <input 
            placeholder="Título (Ex: Almoço Anabólico)" 
            className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800"
            value={meal.title}
            onChange={(e) => setMeal({...meal, title: e.target.value})}
            required
          />
          <input 
            type="time" 
            className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800"
            value={meal.time}
            onChange={(e) => setMeal({...meal, time: e.target.value})}
            required
          />
        </div>

        {/* Macros */}
        <div className="grid grid-cols-2 gap-3">
          {['calories', 'protein', 'carbs', 'fats'].map((macro) => (
            <div key={macro} className="bg-white p-4 rounded-2xl border border-slate-100">
              <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">{macro}</label>
              <input 
                type="number"
                className="w-full bg-transparent outline-none font-black text-slate-900"
                placeholder="0"
                value={(meal as any)[macro]}
                onChange={(e) => setMeal({...meal, [macro]: e.target.value})}
              />
            </div>
          ))}
        </div>

        {/* Itens / Alimentos */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Alimentos</h2>
            <button type="button" onClick={addItem} className="text-blue-600 font-bold text-[10px] uppercase">+ Adicionar</button>
          </div>
          
          {items.map((item, index) => (
            <div key={index} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <input 
                placeholder="Nome do Alimento" 
                className="w-full text-sm font-bold text-slate-800 outline-none"
                value={item.name}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
              />
              <div className="flex gap-2">
                <input 
                  placeholder="Qtd (ex: 150g)" 
                  className="flex-1 text-xs bg-slate-50 p-3 rounded-xl outline-none"
                  value={item.amount}
                  onChange={(e) => updateItem(index, 'amount', e.target.value)}
                />
                <input 
                  placeholder="Substitutos" 
                  className="flex-1 text-xs bg-slate-50 p-3 rounded-xl outline-none"
                  value={item.substitutions}
                  onChange={(e) => updateItem(index, 'substitutions', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-slate-900 text-white font-black py-6 rounded-[32px] uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 disabled:opacity-50"
        >
          {loading ? 'Processando...' : 'Salvar Refeição'}
        </button>
      </form>
    </div>
  );
}