import { sql } from '@/lib/db';
import Link from 'next/link';

export default async function CoachDashboard() {
  // 1. Busca todos os alunos cadastrados no Neon
  const students = await sql`
    SELECT id, full_name, email 
    FROM profiles 
    WHERE role = 'aluno' 
    ORDER BY full_name ASC
  `;

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-32">
      <header className="py-10">
        <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
          PAULO ADRIANO TEAM
        </p>
        <h1 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">
          Painel do<br/>Coach
        </h1>
      </header>

      {/* Atalho para Postar Dicas no Mural */}
      <section className="mb-10">
        <Link 
          href="/dashboard-coach/postar-dica" 
          className="w-full bg-blue-600 text-white font-black py-6 rounded-[32px] flex items-center justify-center gap-3 shadow-xl shadow-blue-100 uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95"
        >
          <span>✍️</span> Postar Dica no Mural
        </Link>
      </section>

      <div className="grid gap-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Seus Alunos</h2>
          <span className="text-[10px] font-bold text-slate-300">{students.length} Total</span>
        </div>
        
        {students.length > 0 ? (
          students.map((student) => (
            <div key={student.id} className="bg-white p-6 rounded-[35px] shadow-sm border border-slate-100 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-slate-800 text-lg leading-tight">{student.full_name}</h3>
                  <p className="text-slate-400 text-xs font-medium">{student.email}</p>
                </div>
                <div className="bg-slate-100 h-10 w-10 rounded-xl flex items-center justify-center font-black text-slate-400">
                  {student.full_name[0]}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link 
                  href={`/detalhes-aluno?studentId=${student.id}`}
                  className="bg-slate-900 text-white text-center py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                >
                  Ver Evolução
                </Link>
                <Link 
                  href={`/gerenciar-planos?studentId=${student.id}`}
                  className="bg-blue-50 text-blue-600 text-center py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                >
                  Plano
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-16 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
            Nenhum aluno no time ainda.
          </div>
        )}
      </div>

      {/* Botão Flutuante para Registro de Novo Aluno (Futuro) */}
      <div className="fixed bottom-10 right-8">
        <button className="bg-slate-900 text-white w-16 h-16 rounded-[24px] shadow-2xl flex items-center justify-center text-3xl font-bold active:scale-90 transition-all">
          +
        </button>
      </div>
    </div>
  );
}