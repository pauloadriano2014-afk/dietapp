'use client'

import { useState } from 'react';
import CheckinModal from './CheckinModal';

export default function MealCheckinController({ mealId }: { mealId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl text-center block text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200 active:scale-95 transition-all"
      >
        Confirmar Refeição
      </button>

      {isModalOpen && (
        <CheckinModal 
          mealId={mealId} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}