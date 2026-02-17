import { sql } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import Link from 'next/link';

export default async function ShoppingList() {
  const session = await getServerSession();
  
  // 1. Busca o ID do aluno
  const userData = await sql`SELECT id FROM profiles WHERE email = ${session?.user?.email} LIMIT 1`;
  const studentId = userData[0]?.id;

  // 2. Busca todos os itens de todas as refeições do aluno
  const items = await sql`
    SELECT mi.name, mi.amount 
    FROM meal_items mi
    JOIN meals m ON mi.meal_id = m.id
    WHERE m.student_id = ${studentId}
  `;

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-28">
      <header className="py-8">
        <Link href="/dashboard-aluno" className="text-blue-600 font-bold text-xs uppercase italic">← Voltar</Link>
        <h1 className="text-3xl font-black text-slate-900 uppercase italic mt-4 tracking-tighter">Lista de<br/>Compras</h1>
        <p className="text-slate-500 font-medium text-sm">Baseada no seu plano atual</p>
      </header>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        {items.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {items.map((item, index) => (
              <div key={index} className="p-5 flex items-center gap-4">
                <input type="checkbox" className="w-6 h-6 rounded-full border-2 border-slate-200 checked:bg-blue-600 transition-all" />
                <div>
                  <p className="font-bold text-slate-800 uppercase text-sm">{item.name}</p>
                  <p className="text-xs text-slate-400 font-bold">{item.amount}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-slate-400 font-bold text-sm">
            Nenhum item encontrado no plano.
          </div>
        )}
      </div>
      
      <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase text-center px-4">
        ⚠️ Esta lista é gerada automaticamente com base nas quantidades diárias.
      </p>
    </div>
  );
}