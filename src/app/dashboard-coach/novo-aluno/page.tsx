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

    try {
      // O backend agora vai identificar automaticamente quem é o Coach pela sessão
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Novo membro integrado ao time com sucesso!')
        router.push('/dashboard-coach')
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.message || 'Erro ao cadastrar membro.')
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-20">
      <header className="mb-8">
        <button 
          onClick={() => router.back()} 
          className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4 italic flex items-center gap-2"
        >
          ← Voltar ao Painel
        </button>
        <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
          Paulo Adriano Team
        </p>
        <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
          Novo <span className="text-blue-600">Membro</span><br/>do Time
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block italic">
              Nome do Atleta
            </label>
            <input 
              placeholder="Ex: João Silva"
              className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800 border border-transparent focus:border-blue-600 transition-all"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block italic">
              E-mail de Acesso
            </label>
            <input 
              type="email"
              placeholder="aluno@email.com"
              className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800 border border-transparent focus:border-blue-600 transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block italic">
              Senha de Primeiro Acesso
            </label>
            <input 
              type="password"
              placeholder="••••••••"
              className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800 border border-transparent focus:border-blue-600 transition-all"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white font-black py-7 rounded-[35px] uppercase tracking-[0.3em] text-[11px] shadow-2xl active:scale-95 transition-all disabled:opacity-50 italic"
        >
          {loading ? 'Processando Registro...' : 'Finalizar Cadastro de Membro'}
        </button>
      </form>

      <p className="mt-8 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest px-8">
        Ao finalizar, o membro será vinculado automaticamente à sua consultoria individual.
      </p>
    </div>
  )
}