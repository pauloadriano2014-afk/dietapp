'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckinModal({ mealId, onClose }: { mealId: string, onClose: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState('')

  const handleCheckin = async (status: 'success' | 'adapted' | 'failed') => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealId, status, description }),
      })

      if (response.ok) {
        onClose()
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[110] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[45px] p-8 animate-in slide-in-from-bottom duration-300">
        <h2 className="text-2xl font-black text-slate-900 uppercase italic mb-2">Relatório de Refeição</h2>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">Como foi sua adesão agora?</p>

        <div className="space-y-3 mb-6">
          <button 
            disabled={loading}
            onClick={() => handleCheckin('success')}
            className="w-full bg-green-50 text-green-600 p-5 rounded-3xl flex items-center justify-between border border-green-100 group active:scale-95 transition-all"
          >
            <span className="font-black text-xs uppercase tracking-widest">Segui à risca</span>
            <span className="text-xl">✅</span>
          </button>

          <button 
            disabled={loading}
            onClick={() => handleCheckin('adapted')}
            className="w-full bg-amber-50 text-amber-600 p-5 rounded-3xl flex items-center justify-between border border-amber-100 group active:scale-95 transition-all"
          >
            <span className="font-black text-xs uppercase tracking-widest">Fiz Adaptações</span>
            <span className="text-xl">🔄</span>
          </button>

          <button 
            disabled={loading}
            onClick={() => handleCheckin('failed')}
            className="w-full bg-red-50 text-red-600 p-5 rounded-3xl flex items-center justify-between border border-red-100 group active:scale-95 transition-all"
          >
            <span className="font-black text-xs uppercase tracking-widest">Não segui</span>
            <span className="text-xl">❌</span>
          </button>
        </div>

        <textarea 
          placeholder="Alguma observação? (Opcional)"
          className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-xs font-bold mb-6 resize-none"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={onClose} className="w-full text-slate-400 font-black text-[10px] uppercase tracking-widest p-2">
          Cancelar
        </button>
      </div>
    </div>
  )
}