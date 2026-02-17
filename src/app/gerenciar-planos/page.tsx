'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Trash2, ChevronLeft, Copy, X } from 'lucide-react';
import AiPlanGenerator from '@/components/AiPlanGenerator';

export default function ManagePlans() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  
  const [loading, setLoading] = useState(false);
  const [availableFoods, setAvailableFoods] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [studentData, setStudentData] = useState<any>(null); // Dados para IA
  const [showFoodList, setShowFoodList] = useState<number | null>(null);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [sourceId, setSourceId] = useState('');

  const [meal, setMeal] = useState({
    title: '',
    time: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  const [items, setItems] = useState([{ name: '', amount: '', substitutions: '' }]);

  // 1. Carrega alimentos, lista de alunos e dados do aluno atual
  useEffect(() => {
    async function fetchData() {
      if (!studentId) return;

      const [foodsRes, studentsRes, currentStudentRes] = await Promise.all([
        fetch('/api/foods'),
        fetch('/api/students'),
        fetch(`/api/students/${studentId}`) // Nova rota para pegar dados específicos
      ]);

      const foodsData = await foodsRes.json();
      const studentsData = await studentsRes.json();
      const currentStudent = await currentStudentRes.json();

      setAvailableFoods(foodsData);
      setStudents(studentsData);
      setStudentData(currentStudent);
    }
    fetchData();
  }, [studentId]);

  const addItem = () => setItems([...items, { name: '', amount: '', substitutions: '' }]);

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const selectFood = (index: number, foodName: string) => {
    updateItem(index, 'name', foodName);
    setShowFoodList(null);
  };

  // Função chamada quando a IA gera uma refeição
  const handleAiPlan = (aiMeal: any) => {
    setMeal({
      title: aiMeal.title,
      time: aiMeal.time,
      calories: aiMeal.macros.calories,
      protein: aiMeal.macros.protein,
      carbs: aiMeal.macros.carbs,
      fats: aiMeal.macros.fats
    });
    setItems(aiMeal.items);
  };

  const handleClone = async () => {
    if (!sourceId) return alert('Selecione um aluno de origem');
    setLoading(true);
    const res = await fetch('/api/meals/clone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceStudentId: sourceId, targetStudentId: studentId })
    });
    
    if (res.ok) {
      alert('Estratégia clonada com sucesso!');
      router.refresh();
      setShowCloneModal(false);
    } else {
      alert('Erro ao clonar plano.');
    }
    setLoading(false);
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
      alert('Refeição salva no SHAPE NATURAL DE ELITE!');
      router.refresh();
      setMeal({ title: '', time: '', calories: '', protein: '', carbs: '', fats: '' });
      setItems([{ name: '', amount: '', substitutions: '' }]);
    } else {
      alert('Erro ao salvar plano alimentar');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-32 text-slate-900">
      <header className="mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest italic">
          <ChevronLeft size={14} /> Voltar ao Painel
        </button>
        <h1 className="text-3xl font-black uppercase italic mt-4 tracking-tighter leading-none">
          Montar<br/><span className="text-blue-600">Estratégia</span>
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 italic">Paulo Adriano Team • Nutrição de Elite</p>
      </header>

      {/* Botões de Ação Rápida (IA e Clone) */}
      <div className="space-y-4 mb-8">
        {studentData && (
          <AiPlanGenerator studentData={studentData} onPlanGenerated={handleAiPlan} />
        )}

        <button 
          onClick={() => setShowCloneModal(true)}
          className="w-full bg-white text-blue-600 font-black py-4 rounded-[25px] flex items-center justify-center gap-2 border border-blue-100 uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-sm"
        >
          <Copy size={14} /> Clonar Plano de outro Aluno
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cabeçalho da Refeição */}
        <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 space-y-4">
          <input 
            placeholder="Título (Ex: Almoço de Campeão)" 
            className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800"
            value={meal.title}
            onChange={(e) => setMeal({...meal, title: e.target.value})}
            required
          />
          <input 
            type="time" 
            className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800"
            value={meal.time}
            onChange={(e) => setMeal({...meal, time: e.target.value})}
            required
          />
        </div>

        {/* Macros */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'calories', label: 'Calorias', unit: 'kcal' },
            { id: 'protein', label: 'Proteína', unit: 'g' },
            { id: 'carbs', label: 'Carbo', unit: 'g' },
            { id: 'fats', label: 'Gordura', unit: 'g' }
          ].map((macro) => (
            <div key={macro.id} className="bg-white p-5 rounded-3xl border border-slate-100">
              <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block italic">{macro.label}</label>
              <div className="flex items-center gap-1">
                <input 
                  type="number"
                  className="w-full bg-transparent outline-none font-black text-xl text-slate-900"
                  placeholder="0"
                  value={(meal as any)[macro.id]}
                  onChange={(e) => setMeal({...meal, [macro.id]: e.target.value})}
                />
                <span className="text-[10px] font-black text-slate-200">{macro.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Itens com Busca Inteligente */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest italic">Composição</h2>
            <button type="button" onClick={addItem} className="bg-blue-600 text-white px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest">+ Adicionar</button>
          </div>
          
          {items.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm space-y-4 relative">
              {items.length > 1 && (
                <button onClick={() => removeItem(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              )}

              <div className="relative">
                <input 
                  placeholder="Buscar na TACO ou Suplementos..." 
                  className="w-full text-sm font-black text-slate-800 outline-none bg-slate-50 p-4 rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all"
                  value={item.name}
                  onFocus={() => setShowFoodList(index)}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                />
                {showFoodList === index && (
                  <div className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-3xl shadow-2xl max-h-60 overflow-y-auto p-2">
                    {availableFoods
                      .filter(f => f.food_name.toLowerCase().includes(item.name.toLowerCase()))
                      .map((f, i) => (
                        <button
                          key={i}
                          type="button"
                          className="w-full text-left p-4 hover:bg-blue-50 rounded-2xl flex justify-between items-center group transition-colors"
                          onClick={() => selectFood(index, f.food_name)}
                        >
                          <span className="text-[10px] font-black uppercase text-slate-700 group-hover:text-blue-700">{f.food_name}</span>
                          <span className="text-[9px] font-bold text-slate-300 uppercase italic">{f.category}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <div className="flex-[2] bg-slate-50 p-4 rounded-2xl">
                  <label className="text-[8px] font-black text-slate-300 uppercase mb-1 block">Qtd</label>
                  <input 
                    placeholder="150g / 1 scoop" 
                    className="bg-transparent text-xs font-bold outline-none text-slate-800 w-full"
                    value={item.amount}
                    onChange={(e) => updateItem(index, 'amount', e.target.value)}
                  />
                </div>
                <div className="flex-[3] bg-slate-50 p-4 rounded-2xl">
                  <label className="text-[8px] font-black text-slate-300 uppercase mb-1 block">Trocas</label>
                  <input 
                    placeholder="Substitutos..." 
                    className="bg-transparent text-xs font-bold outline-none text-slate-800 w-full"
                    value={item.substitutions}
                    onChange={(e) => updateItem(index, 'substitutions', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-slate-900 text-white font-black py-7 rounded-[35px] uppercase tracking-[0.3em] text-[10px] shadow-2xl active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Confirmar Refeição'}
        </button>
      </form>

      {/* Modal de Clonagem */}
      {showCloneModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[45px] p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-900 uppercase italic">Clonar Dieta</h3>
              <button onClick={() => setShowCloneModal(false)} className="text-slate-400"><X size={20}/></button>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-6 tracking-widest">Selecione o aluno de origem:</p>
            <select 
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full p-5 bg-slate-50 rounded-2xl mb-8 font-black text-xs text-slate-800 outline-none border border-transparent focus:border-blue-200"
            >
              <option value="">Buscar Aluno...</option>
              {students.filter(s => s.id !== studentId).map(s => (
                <option key={s.id} value={s.id}>{s.full_name}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button 
                onClick={handleClone} 
                disabled={loading}
                className="flex-[2] bg-blue-600 text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100"
              >
                {loading ? 'Clonando...' : 'Confirmar'}
              </button>
              <button onClick={() => setShowCloneModal(false)} className="flex-[1] bg-slate-100 text-slate-400 font-black py-5 rounded-2xl text-[10px] uppercase">Sair</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}