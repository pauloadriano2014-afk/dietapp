import { sql } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import Link from 'next/link';
import MealCard from '@/components/MealCard';
import ProgressChart from '@/components/ProgressChart';
import EatingOutButton from '@/components/EatingOutButton';
import MealCheckinController from '@/components/MealCheckinController';

export default async function StudentDashboard() {
  const session = await getServerSession();
  
  // 1. Busca dados do perfil e progresso no Neon
  const userData = await sql`
    SELECT id, full_name FROM profiles WHERE email = ${session?.user?.email} LIMIT 1
  `;
  
  const student = userData[0];

  const progressData = await sql`
    SELECT weight, created_at as date 
    FROM progress_logs 
    WHERE student_id = ${student.id} 
    ORDER BY created_at ASC 
    LIMIT 7
  `;

  // 2. Busca as refeições com seus respectivos itens vinculados via JSON Aggregation (Neon/Postgres)
  const meals = await sql`
    SELECT 
      m.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', mi.id,
            'name', mi.name,
            'amount', mi.amount,
            'substitutions', mi.substitutions
          )
        ) FILTER (WHERE mi.id IS NOT NULL),
        '[]'
      ) as items
    FROM meals m
    LEFT JOIN meal_items mi ON m.id = mi.meal_id
    WHERE m.student_id = ${student.id}
    GROUP BY m.id
    ORDER BY m.time ASC
  `;

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header Premium - PAULO ADRIANO TEAM */}
      <header className="bg-white p-8 pt-16 rounded-b-[50px] shadow-sm border-b border-slate-100">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
              PAULO ADRIANO TEAM
            </p>
            <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter leading-none">
              Olá, {student?.full_name?.split(' ')[0]}
            </h1>
          </div>
          <div className="h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl shadow-slate-200">
            {student?.full_name?.[0]}
          </div>
        </div>
      </header>

      <main className="p-5 space-y-6 -mt-8">
        {/* Banner de Identidade do App */}
        <div className="px-2">
          <div className="bg-slate-900 rounded-3xl p-4 flex items-center justify-between border border-slate-800 shadow-lg">
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">App Oficial</span>
               <span className="text-sm font-black text-white italic tracking-tighter">SHAPE NATURAL DE ELITE</span>
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase">v1.0</span>
          </div>
        </div>

        {/* Gráfico de Evolução Corporal */}
        <div className="bg-white p-2 rounded-[40px] shadow-sm border border-slate-100">
          <ProgressChart data={progressData} />
        </div>

        {/* Atalhos Rápidos */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/lista-compras" className="bg-blue-600 p-5 rounded-[32px] text-white shadow-lg shadow-blue-100 flex flex-col justify-between h-32 hover:bg-blue-700 transition-colors">
            <span className="text-2xl">🛒</span>
            <span className="font-black text-xs uppercase tracking-widest leading-tight">Lista de<br/>Compras</span>
          </Link>
          <EatingOutButton />
        </div>

        {/* Seção de Dieta */}
        <div className="flex justify-between items-center px-2 pt-2">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Estratégia Diária</h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Fisiculturismo Natural</span>
        </div>

        {/* Lista Dinâmica de Refeições */}
        <div className="space-y-4">
          {meals.length > 0 ? (
            meals.map((meal: any) => (
              <MealCard key={meal.id} meal={meal} items={meal.items}>
                {/* Controlador Client-side que abre o Modal de Check-in */}
                <MealCheckinController mealId={meal.id} />
              </MealCard>
            ))
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-12 text-center">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Sua estratégia está sendo montada...</p>
            </div>
          )}
        </div>
      </main>

      {/* Menu de Navegação Inferior (Mobile-first) */}
      <nav className="fixed bottom-8 left-8 right-8 bg-white/90 backdrop-blur-xl shadow-2xl shadow-slate-400 rounded-[35px] p-5 flex justify-around items-center border border-white/20 z-50">
        <Link href="/dashboard-aluno" className="flex flex-col items-center gap-1">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mb-1"></div>
          <span className="font-black text-[9px] uppercase tracking-tighter text-blue-600">Início</span>
        </Link>
        <Link href="/progresso" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
          <span className="font-black text-[9px] uppercase tracking-tighter text-slate-900">Evolução</span>
        </Link>
        <Link href="/perfil" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
          <span className="font-black text-[9px] uppercase tracking-tighter text-slate-900">Perfil</span>
        </Link>
      </nav>
    </div>
  );
}