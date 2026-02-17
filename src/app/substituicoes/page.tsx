import { sql } from '@/lib/db';
import Link from 'next/link';

export default async function SubstituicoesPage() {
  const items = await sql`SELECT * FROM food_equivalents ORDER BY category, food_name`;

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24 text-slate-900">
      <header className="mb-8">
        <Link href="/dashboard-aluno" className="text-blue-600 font-black text-[10px] uppercase italic tracking-widest">← Voltar</Link>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter mt-4">Tabela de <span className="text-blue-600">Trocas</span></h1>
        <p className="text-slate-400 font-bold text-[10px] uppercase mt-1 italic">Equivalência de Macros Paulo Adriano Team</p>
      </header>

      <div className="space-y-4">
        {['Carboidrato', 'Proteína', 'Gordura'].map(cat => (
          <div key={cat} className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">{cat}s</h2>
            <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
              {items.filter(i => i.category === cat).map(item => (
                <div key={item.id} className="p-5 border-b border-slate-50 flex justify-between items-center last:border-0">
                  <span className="font-bold text-sm text-slate-800">{item.food_name}</span>
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-500">{item.base_grams}g</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}