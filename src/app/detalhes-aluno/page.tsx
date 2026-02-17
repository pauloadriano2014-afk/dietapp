import { sql } from '@/lib/db';
import ProgressChart from '@/components/ProgressChart';
import Link from 'next/link';

export default async function StudentDetails({ searchParams }: { searchParams: { studentId: string } }) {
  const studentId = searchParams.studentId;

  // 1. Busca dados do perfil do aluno
  const student = await sql`SELECT * FROM profiles WHERE id = ${studentId} LIMIT 1`;
  
  // 2. Busca histórico completo de progresso (peso e fotos)
  const progress = await sql`
    SELECT weight, photo_url, created_at as date 
    FROM progress_logs 
    WHERE student_id = ${studentId} 
    ORDER BY created_at ASC
  `;

  // 3. Calcula estatísticas de adesão (Seguiu, Adaptou, Errou)
  const checkins = await sql`
    SELECT status, count(*) as total 
    FROM checkins 
    WHERE student_id = ${studentId} 
    GROUP BY status
  `;

  const studentName = student[0]?.full_name || "Membro do Team";

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <p className="text-blue-600 font-black text-[9px] uppercase tracking-[0.3em] mb-1">Evolução do Aluno</p>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic leading-tight tracking-tighter">
            {studentName}
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.1em]">
            Paulo Adriano Team • SHAPE NATURAL DE ELITE
          </p>
        </div>
        <Link 
          href="/dashboard-coach"
          className="bg-white text-slate-900 px-5 py-3 rounded-2xl text-[10px] font-black uppercase shadow-sm border border-slate-100"
        >
          Sair
        </Link>
      </header>

      <div className="space-y-6">
        {/* Gráfico de Evolução de Peso */}
        <div className="bg-white p-2 rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-50 mb-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Histórico de Peso (kg)</h3>
          </div>
          <ProgressChart data={progress} />
        </div>

        {/* Resumo de Adesão à Dieta */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center italic">
            Consistência na Estratégia
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {['success', 'adapted', 'failed'].map((s) => {
              const count = checkins.find(c => c.status === s)?.total || 0;
              const labels = { success: 'Seguiu', adapted: 'Adaptou', failed: 'Errou' };
              const colors = { success: 'text-green-600', adapted: 'text-amber-500', failed: 'text-red-500' };
              const bgColors = { success: 'bg-green-50', adapted: 'bg-amber-50', failed: 'bg-red-50' };
              
              return (
                <div key={s} className={`${bgColors[s as keyof typeof bgColors]} p-4 rounded-3xl text-center border border-white`}>
                  <p className={`text-2xl font-black ${colors[s as keyof typeof colors]}`}>{count}</p>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{labels[s as keyof typeof labels]}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Evolução Visual (Fotos do Shape) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Análise Visual</h3>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Arraste para o lado →</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-6 snap-x no-scrollbar">
            {progress.filter(p => p.photo_url).length > 0 ? (
              progress.filter(p => p.photo_url).map((p, idx) => (
                <div key={idx} className="min-w-[200px] h-[280px] bg-slate-200 rounded-[35px] overflow-hidden relative border border-slate-100 snap-center shadow-lg">
                  <img 
                    src={p.photo_url} 
                    alt={`Registro ${idx}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/95 backdrop-blur-md rounded-2xl text-slate-900 text-[10px] font-black text-center uppercase shadow-sm">
                    {new Date(p.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-14 text-center">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Nenhum registro visual</p>
              </div>
            )}
          </div>
        </div>

        {/* Ação Estratégica do Coach */}
        <div className="pt-2">
          <Link 
            href={`/gerenciar-planos?studentId=${studentId}`}
            className="w-full bg-slate-900 text-white text-center py-6 rounded-[35px] font-black text-[10px] uppercase tracking-[0.3em] block shadow-2xl active:scale-95 transition-all italic"
          >
            Ajustar Plano Alimentar
          </Link>
        </div>
      </div>
    </div>
  );
}