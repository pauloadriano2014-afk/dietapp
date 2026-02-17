import { sql } from "../../../../lib/db";
import { ChevronLeft, Apple, Sparkles, BrainCircuit, History } from "lucide-react";
import Link from "next/link";

export default async function DetalhesAluno({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Busca os dados - suporte flexível para nomes de colunas do Neon
  const studentData = await sql`
    SELECT * FROM profiles WHERE id = ${id}::uuid LIMIT 1
  `;
  const student = studentData[0];

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-slate-900 font-black uppercase italic mb-4 text-xl">Atleta não localizado</h1>
        <Link href="/dashboard-coach" className="bg-blue-600 text-white font-black py-4 px-8 rounded-2xl uppercase text-[10px] italic shadow-lg">
          Voltar ao Painel
        </Link>
      </div>
    );
  }

  // Fallback para o nome (lida com transform do postgres-js)
  const fullName = student.full_name || student.fullName || "Atleta Elite";

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24 font-sans">
      <header className="mb-8">
        <Link href="/dashboard-coach" className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4 italic flex items-center gap-2">
          <ChevronLeft size={14} /> Voltar ao Painel
        </Link>
        <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
          Perfil do <span className="text-blue-600">Atleta</span>
        </h1>
      </header>

      {/* Card Principal de Identificação */}
      <div className="bg-white p-7 rounded-[40px] shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-2xl font-black italic border-b-4 border-blue-600 shadow-xl">
            {fullName[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase italic leading-none mb-2">
              {fullName}
            </h2>
            <span className="text-blue-600 font-black text-[9px] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">
              {student.goal || 'Performance'}
            </span>
          </div>
        </div>
      </div>

      {/* SEÇÃO DE DIETA E IA - FOCO TOTAL */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic">Ferramentas de Elite</h3>
        
        {/* Botão de Prescrição com IA */}
        <Link href={`/dashboard-coach/aluno/${id}/gerar-dieta-ia`} className="block">
          <div className="bg-slate-900 p-6 rounded-[35px] border-b-4 border-blue-600 flex items-center gap-5 active:scale-95 transition-all group">
            <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
              <BrainCircuit size={28} className="animate-pulse" />
            </div>
            <div>
              <span className="block font-black text-white uppercase italic text-sm tracking-tight">Gerar Dieta com IA</span>
              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">Algoritmo de definição máxima</span>
            </div>
          </div>
        </Link>

        {/* Ver Dieta Atual */}
        <Link href={`/dashboard-coach/aluno/${id}/dieta-atual`} className="block">
          <div className="bg-white p-6 rounded-[35px] border border-slate-100 flex items-center gap-5 active:scale-95 transition-all group">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
              <Apple size={24} />
            </div>
            <div>
              <span className="block font-black text-slate-900 uppercase italic text-xs">Plano Alimentar Ativo</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Acompanhar macros e calorias</span>
            </div>
          </div>
        </Link>

        {/* Histórico e Evolução */}
        <div className="bg-white p-6 rounded-[35px] border border-slate-100 flex items-center gap-5 opacity-60">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
            <History size={24} />
          </div>
          <div>
            <span className="block font-black text-slate-900 uppercase italic text-xs">Histórico de Pesagem</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Em breve</span>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center opacity-30">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] italic">
          IA Engine v2.0 • Paulo Adriano Team
        </p>
      </footer>
    </div>
  );
}