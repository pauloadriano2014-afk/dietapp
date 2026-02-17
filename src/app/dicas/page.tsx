import { sql } from '@/lib/db';
import Link from 'next/link';
import MarkAsRead from '@/components/MarkAsRead'; // Componente auxiliar para gerenciar o localStorage

export default async function CoachTipsPage() {
  const tips = await sql`
    SELECT * FROM coach_tips 
    ORDER BY created_at DESC
  `;

  // Pegamos a data da dica mais recente para marcar como lida
  const latestTipDate = tips.length > 0 ? tips[0].created_at.toISOString() : null;

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Componente Client para marcar como lido ao carregar a página */}
      <MarkAsRead latestDate={latestTipDate} />

      <header className="bg-white p-8 pt-16 rounded-b-[50px] shadow-sm border-b border-slate-100">
        <Link href="/dashboard-aluno" className="text-blue-600 font-black text-[10px] uppercase italic tracking-widest">
          ← Painel Principal
        </Link>
        <h1 className="text-3xl font-black text-slate-900 uppercase italic mt-4 tracking-tighter leading-none">
          Mural do<br/><span className="text-blue-600">Coach</span>
        </h1>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">
          Paulo Adriano Team
        </p>
      </header>

      <main className="p-5 space-y-6">
        {tips.length > 0 ? (
          tips.map((tip) => (
            <div key={tip.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform font-bold text-4xl">
                📝
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                  {tip.category}
                </span>
                <span className="text-[9px] font-bold text-slate-300 uppercase italic">
                  {new Date(tip.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <h2 className="text-xl font-black text-slate-900 uppercase italic leading-tight mb-4 pr-10">
                {tip.title}
              </h2>
              
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {tip.content}
              </p>
            </div>
          ))
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-12 text-center">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Aguardando orientações do mestre...
            </p>
          </div>
        )}
      </main>
    </div>
  );
}