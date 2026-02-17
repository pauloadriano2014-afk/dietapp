"use client";

interface CheckinProps {
  currentStatus: string;
  onSelect: (status: 'success' | 'adapted' | 'failed') => void;
}

export default function CheckinButtonGroup({ currentStatus, onSelect }: CheckinProps) {
  const baseClass = "flex-1 py-5 px-2 rounded-2xl text-[11px] font-black uppercase tracking-tight transition-all flex flex-col items-center justify-center gap-2 border-2";
  
  return (
    <div className="flex gap-3 w-full">
      <button 
        onClick={() => onSelect('success')}
        className={`${baseClass} ${currentStatus === 'success' ? 'bg-green-500 border-green-600 text-white shadow-md' : 'bg-white border-slate-100 text-green-600'}`}
      >
        <span className="text-2xl">✅</span>
        Segui
      </button>

      <button 
        onClick={() => onSelect('adapted')}
        className={`${baseClass} ${currentStatus === 'adapted' ? 'bg-amber-400 border-amber-500 text-white shadow-md' : 'bg-white border-slate-100 text-amber-600'}`}
      >
        <span className="text-2xl">⚠️</span>
        Adaptei
      </button>

      <button 
        onClick={() => onSelect('failed')}
        className={`${baseClass} ${currentStatus === 'failed' ? 'bg-red-500 border-red-600 text-white shadow-md' : 'bg-white border-slate-100 text-red-600'}`}
      >
        <span className="text-2xl">❌</span>
        Não Segui
      </button>
    </div>
  );
}