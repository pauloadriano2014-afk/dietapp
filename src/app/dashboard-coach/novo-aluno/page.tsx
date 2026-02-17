'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NovoAlunoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const response = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      alert('Aluno cadastrado com sucesso no Team!')
      router.push('/dashboard-coach')
      router.refresh()
    } else {
      const error = await response.json()
      alert(error.message || 'Erro ao cadastrar aluno.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="mb-8">
        <button onClick={() => router.back()} className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-4 italic">
          ← Voltar ao Painel
        </button>
        <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
          Novo <span className="text-blue-600">Membro</span>
        </h1>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
          Paulo Adriano Team
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Nome Completo</label>
            <input 
              placeholder="Ex: João Silva"
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">E-mail de Acesso</label>
            <input 
              type="email"
              placeholder="aluno@email.com"
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Senha Provisória</label>
            <input 
              type="password"
              placeholder="••••••••"
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white font-black py-6 rounded-[32px] uppercase tracking-[0.2em] text-xs shadow-xl active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
        </button>
      </form>
    </div>
  )
}