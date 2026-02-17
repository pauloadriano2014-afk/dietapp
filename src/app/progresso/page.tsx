'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProgressPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    weight: '',
    waist: '',
    abs: '',
    hips: '',
    photo_url: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/dashboard-aluno')
        router.refresh()
      } else {
        alert('Erro ao salvar progresso')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-24">
      <div className="max-w-md mx-auto">
        <header className="py-8">
          <button onClick={() => router.back()} className="text-blue-600 font-bold text-xs mb-4 italic">
            ← VOLTAR
          </button>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic leading-none">Minha<br/>Evolução</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Upload de Foto (Simulado para URL por enquanto) */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Foto do Shape (URL)</label>
            <input 
              type="text"
              placeholder="Link da imagem (Ex: Imgur/Drive)"
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-xs font-bold"
              value={formData.photo_url}
              onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
            />
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Peso Atual (kg)</label>
            <input 
              type="number" 
              step="0.1"
              required
              className="w-full text-center text-6xl font-black text-slate-900 bg-transparent outline-none"
              placeholder="00.0"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {['waist', 'abs', 'hips'].map((field) => (
              <div key={field} className="bg-white p-6 rounded-3xl flex justify-between items-center border border-slate-100 shadow-sm">
                <span className="font-black text-slate-700 uppercase text-xs tracking-widest">
                  {field === 'waist' ? 'Cintura' : field === 'abs' ? 'Abdômen' : 'Quadril'} (cm)
                </span>
                <input 
                  type="number"
                  required
                  className="w-20 text-right font-black text-blue-600 text-xl bg-transparent outline-none"
                  value={formData[field as keyof typeof formData]}
                  onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-black py-6 rounded-[32px] shadow-xl uppercase tracking-widest mt-4 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Atualizar Dados'}
          </button>
        </form>
      </div>
    </div>
  )
}