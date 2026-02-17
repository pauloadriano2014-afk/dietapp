'use client'
import { useState } from 'react'

export function NutritionTools({ waterInitial = 0, waterGoal = 3500 }) {
  const [water, setWater] = useState(waterInitial)
  const [cheatLoading, setCheatLoading] = useState(false)

  const addWater = async (ml: number) => {
    const newAmount = water + ml
    setWater(newAmount)
    await fetch('/api/nutrition/water', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: newAmount }),
    })
  }

  const registerCheatMeal = async () => {
    if (!confirm("Confirmar registro de refeição livre da semana?")) return
    setCheatLoading(true)
    await fetch('/api/nutrition/cheat-meal', { method: 'POST' })
    alert("Refeição livre registrada. Mantenha o foco no restante do dia!")
    setCheatLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* 1. CONTADOR DE ÁGUA */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">💧 Hidratação</h3>
          <span className="text-xl font-black text-slate-900">{water}ml <span className="text-slate-300 text-[10px]">/ {waterGoal}ml</span></span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-700 shadow-[0_0_10px_rgba(59,130,246,0.3)]" 
            style={{ width: `${Math.min((water/waterGoal)*100, 100)}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[250, 500, 1000].map(ml => (
            <button key={ml} onClick={() => addWater(ml)} className="py-3 bg-slate-50 rounded-2xl text-[10px] font-black uppercase hover:bg-blue-50 transition-all active:scale-95">+{ml}ml</button>
          ))}
        </div>
      </div>

      {/* 2. TABELA DE SUBSTITUIÇÃO (LINK) */}
      <Link href="/substituicoes" className="block bg-slate-900 p-6 rounded-[32px] text-white shadow-xl active:scale-95 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 italic">Flexibilidade</h3>
            <p className="text-lg font-black uppercase italic tracking-tighter">Tabela de Equivalência</p>
          </div>
          <span className="text-2xl">🔄</span>
        </div>
      </Link>

      {/* 3. REFEIÇÃO LIVRE */}
      <button 
        onClick={registerCheatMeal}
        disabled={cheatLoading}
        className="w-full bg-white border-2 border-dashed border-red-200 p-6 rounded-[32px] text-red-500 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all"
      >
        <span>🍔</span> {cheatLoading ? 'Registrando...' : 'Registrar Refeição Livre'}
      </button>
    </div>
  )
}