import { sql } from '@/lib/db';
import ProgressChart from '@/components/ProgressChart';
import Link from 'next/link';
import { Camera, Droplets } from 'lucide-react';

export default async function StudentDetails({ searchParams }: { searchParams: { studentId: string } }) {
  const studentId = searchParams.studentId;

  const studentData = await sql`SELECT * FROM profiles WHERE id = ${studentId} LIMIT 1`;
  const student = studentData[0];
  
  const progress = await sql`
    SELECT weight, photo_url, created_at as date 
    FROM progress_logs 
    WHERE student_id = ${studentId} 
    ORDER BY created_at ASC
  `;

  const checkins = await sql`
    SELECT c.*, m.name as meal_name 
    FROM checkins c
    JOIN meals m ON c.meal_id = m.id
    WHERE c.student_id = ${studentId} AND c.created_at = CURRENT_DATE
    ORDER BY m.time ASC
  `;

  const stats = await sql`
    SELECT status, count(*) as total FROM checkins WHERE student_id = ${studentId} GROUP BY status
  `;

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <p className="text-blue-600 font-black text-[9px] uppercase tracking-[0.3em] mb-1">Evolução do Aluno</p>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic leading-tight tracking-tighter">
            {student[0]?.full_name || "Membro"}
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.1em]">SHAPE NATURAL DE ELITE</p>
        </div>
        <Link href="/dashboard-coach" className="bg-white text-slate-900 px-5 py-3 rounded-2xl text-[10px] font-black uppercase shadow-sm">Sair</Link>
      </header>

      <div className="space-y-6">
        {/* Auditoria de Refeições Diárias (Fotos) */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic ml-2">Check-in de Nutrição (Hoje)</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {checkins.length > 0 ? (
              checkins.map((c, i) => (
                <div key={i} className="min-w-[160px] bg-white rounded-[30px] overflow-hidden border border-slate-100 shadow-sm">
                  <div className="h-32 bg-slate-100 relative">
                    {c.meal_photo_url ? (
                      <img src={c.meal_photo_url} className="w-full h-full object-cover" alt="Prato" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-300"><Camera size={20}/></div>
                    )}
                    <div className={`absolute top-2 right-2 p-1 rounded-full ${c.status === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                      <div className="w-2 h-2"></div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[9px] font-black text-slate-900 uppercase truncate">{c.meal_name}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase italic">
                      {c.status === 'success' ? 'Seguiu' : 'Não seguiu'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full bg-white p-8 rounded-[30px] border-2 border-dashed border-slate-200 text-center text-[10px] font-bold text-slate-400 uppercase">Aguardando refeições de hoje</div>
            )}
          </div>
        </div>

        {/* Ajuste de Meta de Água */}
        <div className="bg-blue-600 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-80">Configurar Estratégia</h3>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                defaultValue={student?.water_goal || 3500}
                className="bg-white/20 border border-white/30 rounded-2xl px-5 py-3 w-32 font-black text-xl outline-none"
                onBlur={async (e) => {
                  await fetch('/api/students/update-goal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ studentId, waterGoal: e.target.value })
                  });
                }}
              />
              <span className="font-black italic uppercase">ML/Dia</span>
            </div>
          </div>
          <Droplets className="absolute -right-4 -bottom-4 text-white opacity-10" size={120} />
        </div>

        {/* Gráfico de Evolução de Peso */}
        <div className="bg-white p-2 rounded-[32px] shadow-sm border border-slate-100">
          <div className="p-4 border-b border-slate-50 mb-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">Histórico de Peso (kg)</h3>
          </div>
          <ProgressChart data={progress} />
        </div>

        {/* Evolução Visual do Shape */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic ml-2">Análise Visual do Shape</h3>
          <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
            {progress.filter(p => p.photo_url).map((p, idx) => (
              <div key={idx} className="min-w-[200px] h-[280px] bg-slate-200 rounded-[35px] overflow-hidden relative border border-slate-100 shadow-md">
                <img src={p.photo_url} className="w-full h-full object-cover" alt="Shape" />
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/95 backdrop-blur-md rounded-2xl text-[10px] font-black text-center uppercase">
                  {new Date(p.date).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link href={`/gerenciar-planos?studentId=${studentId}`} className="w-full bg-slate-900 text-white text-center py-6 rounded-[35px] font-black text-[11px] uppercase tracking-[0.3em] block shadow-2xl active:scale-95 transition-all italic">Ajustar Plano Alimentar</Link>
      </div>
    </div>
  );
}