import { sql } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import Link from 'next/link';
import { Plus, Users, Search, ChevronRight } from 'lucide-react';

export default async function CoachDashboard() {
  const session = await getServerSession();
  
  // 1. Busca o ID do Coach logado (Paulo ou Vane)
  const coachData = await sql`
    SELECT id, full_name FROM profiles WHERE email = ${session?.user?.email} LIMIT 1
  `;
  const coach = coachData[0];

  // 2. Busca APENAS os alunos vinculados a este Coach ID
  const students = await sql`
    SELECT id, full_name, goal, created_at 
    FROM profiles 
    WHERE role = 'aluno' AND coach_id = ${coach.id}
    ORDER BY created_at DESC
  `;

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-20">
      <header className="mb-8 pt-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-1 italic">
              Coach Dashboard
            </p>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              Painel de<br/><span className="text-blue-600">Gestão</span>
            </h1>
          </div>
          <div className="bg-slate-900 text-white p-4 rounded-2xl font-black text-[10px] uppercase italic shadow-xl">
            {coach?.full_name?.split(' ')[0]}
          </div>
        </div>
      </header>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-[35px] shadow-sm border border-slate-100">
          <Users className="text-blue-600 mb-2" size={20} />
          <p className="text-[24px] font-black text-slate-900 leading-none">{students.length}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Atletas Ativos</p>
        </div>
        <Link 
          href="/dashboard-coach/novo-aluno"
          className="bg-blue-600 p-6 rounded-[35px] shadow-lg shadow-blue-100 flex flex-col justify-center items-center text-center group active:scale-95 transition-all"
        >
          <Plus className="text-white mb-1 group-hover:rotate-90 transition-transform" size={24} />
          <p className="text-[9px] font-black text-white uppercase tracking-widest leading-tight">Novo<br/>Membro</p>
        </Link>
      </div>

      {/* Lista de Alunos Filtrada */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest italic">Meus Atletas</h2>
          <Search size={14} className="text-slate-300" />
        </div>

        <div className="space-y-3">
          {students.length > 0 ? (
            students.map((student: any) => (
              <Link 
                key={student.id} 
                href={`/dashboard-coach/aluno/${student.id}`}
                className="bg-white p-5 rounded-[30px] border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {student.full_name[0]}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 uppercase text-xs italic tracking-tight">
                      {student.full_name}
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                      Objetivo: {student.goal || 'Definição'}
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
              </Link>
            ))
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-100 rounded-[35px] p-10 text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                Nenhum atleta vinculado à sua conta
              </p>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-12 text-center">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Shape Natural de Elite • v1.3
        </p>
      </footer>
    </div>
  );
}