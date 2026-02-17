import { sql } from "../../lib/db"; 
import { getServerSession } from "next-auth/next";
import Link from 'next/link';
import { Plus, Users, Search, ChevronRight } from 'lucide-react';

export default async function CoachDashboard() {
  const session = await getServerSession();
  
  // 1. Busca o ID do Coach logado com segurança
  const coachData = await sql`
    SELECT id, full_name FROM profiles WHERE email = ${session?.user?.email} LIMIT 1
  `;
  
  const coach = coachData[0];

  // 2. Busca os alunos vinculados (Ajustado para garantir que o nome e objetivo apareçam)
  const students = coach?.id ? await sql`
    SELECT id, full_name, goal, created_at 
    FROM profiles 
    WHERE role = 'aluno' AND coach_id = ${coach.id}
    ORDER BY created_at DESC
  ` : [];

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
          <div className="bg-slate-900 text-white p-4 rounded-2xl font-black text-[10px] uppercase italic shadow-xl border-b-4 border-blue-600">
            {coach?.full_name?.split(' ')[0] || 'Coach'}
          </div>
        </div>
      </header>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white p-7 rounded-[40px] shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute -right-2 -top-2 bg-blue-50 w-16 h-16 rounded-full group-hover:scale-110 transition-transform" />
          <Users className="text-blue-600 mb-2 relative z-10" size={24} />
          <p className="text-[28px] font-black text-slate-900 leading-none relative z-10">{students.length}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 relative z-10">Atletas Ativos</p>
        </div>
        
        <Link 
          href="/dashboard-coach/novo-aluno"
          className="bg-blue-600 p-7 rounded-[40px] shadow-lg shadow-blue-200 flex flex-col justify-center items-center text-center group active:scale-95 transition-all border-b-4 border-blue-800"
        >
          <Plus className="text-white mb-1 group-hover:rotate-90 transition-transform" size={28} />
          <p className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">Novo<br/>Membro</p>
        </Link>
      </div>

      {/* Lista de Alunos - Layout de Elite */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] italic">Meus Atletas</h2>
          <Search size={16} className="text-slate-300" />
        </div>

        <div className="space-y-3">
          {students.length > 0 ? (
            students.map((student: any) => (
              <Link 
                key={student.id} 
                href={`/dashboard-coach/aluno/${student.id}`}
                className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white text-xl italic shadow-lg group-hover:bg-blue-600 transition-colors">
                    {student.full_name ? student.full_name[0].toUpperCase() : '?'}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase text-sm italic tracking-tight leading-none mb-2">
                      {student.full_name}
                    </h3>
                    <div className="inline-flex items-center bg-blue-50 px-3 py-1 rounded-full">
                       <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">
                        Objetivo: {student.goal || 'Performance'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-blue-50 transition-colors">
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600" />
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white border-4 border-dashed border-slate-100 rounded-[45px] p-16 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-slate-200" />
              </div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] max-w-[150px] mx-auto leading-relaxed">
                Sua lista de elite está vazia
              </p>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-16 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic opacity-50">
          Shape Natural de Elite • v1.3
        </p>
      </footer>
    </div>
  );
}