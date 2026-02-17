import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import MealCard from '@/components/MealCard';
import { Meal, MealItem } from '@/types/database';

export default async function StudentDashboard() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // 1. Buscar perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session?.user.id)
    .single();

  // 2. Buscar refeições do aluno (com os itens)
  const { data: meals } = await supabase
    .from('meals')
    .select(`
      *,
      items:meal_items(*)
    `)
    .eq('student_id', session?.user.id)
    .order('time', { ascending: true });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Fixo Mobile */}
      <header className="bg-white p-6 pt-12 rounded-b-[40px] shadow-sm border-b border-slate-100">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-sm font-medium">Olá, {profile?.full_name?.split(' ')[0]}</p>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Seu Plano Hoje</h1>
          </div>
          <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold">
            {profile?.full_name?.[0]}
          </div>
        </div>
      </header>

      <main className="p-4 mt-4">
        {/* Resumo de Macros Diários */}
        <div className="bg-slate-900 rounded-[32px] p-6 mb-8 text-white flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Diário</p>
            <h2 className="text-3xl font-black">2.450 <span className="text-sm font-normal text-slate-400">kcal</span></h2>
          </div>
          <div className="flex gap-3">
             {/* Aqui poderiam entrar círculos de progresso futuramente */}
          </div>
        </div>

        {/* Lista de Refeições */}
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Refeições</h2>
        
        {meals && meals.length > 0 ? (
          meals.map((meal: any) => (
            <MealCard key={meal.id} meal={meal} items={meal.items}>
              <Link 
                href={`/checkin?mealId=${meal.id}`}
                className="w-full bg-slate-100 text-slate-600 font-bold py-3 rounded-2xl text-center block hover:bg-slate-200 transition-all text-sm"
              >
                Registrar Adesão
              </Link>
            </MealCard>
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">Nenhum plano alimentar ativo.</p>
          </div>
        )}
      </main>

      {/* Menu Inferior Fixo (Mobile First) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-6 py-4 flex justify-between items-center z-50">
        <Link href="/dashboard-aluno" className="flex flex-col items-center text-slate-900">
          <span className="text-xs font-bold">Início</span>
        </Link>
        <Link href="/plano-alimentar" className="flex flex-col items-center text-slate-400">
          <span className="text-xs font-bold">Plano</span>
        </Link>
        <Link href="/progresso" className="flex flex-col items-center text-slate-400">
          <span className="text-xs font-bold">Progresso</span>
        </Link>
      </nav>
    </div>
  );
}