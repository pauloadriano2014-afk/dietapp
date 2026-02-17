'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useSession } from "next-auth/react" // Importação necessária para Client Components

export default function NovoAlunoPage() {
  const router = useRouter()
  const { data: session } = useSession() // Captura a sessão no lado do cliente
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    goal: 'Emagrecimento'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
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
          <ChevronLeft size={14} /> Voltar ao Painel
        </button>
        <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-1 italic">
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
              Nome Completo do Atleta
            </label>
            <input 
              placeholder="Ex: João Silva"
              className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800 border border-transparent focus:border-blue-600 transition-all shadow-inner"
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
              className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800 border border-transparent focus:border-blue-600 transition-all shadow-inner"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block italic">
              Objetivo Inicial
            </label>
            <select 
              className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800 border border-transparent focus:border-blue-600 transition-all shadow-inner appearance-none"
              value={formData.goal}
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
            >
              <option value="Emagrecimento">Emagrecimento</option>
              <option value="Hipertrofia">Hipertrofia</option>
              <option value="Definição">Definição Corporal</option>
              <option value="Performance">Performance Natural</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block italic">
              Senha Temporária
            </label>
            <input 
              type="password"
              placeholder="••••••••"
              className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800 border border-transparent focus:border-blue-600 transition-all shadow-inner"
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

      <p className="mt-8 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest px-8 leading-relaxed">
        O membro será vinculado automaticamente à consultoria de {session?.user?.name || 'Paulo Adriano'}.
      </p>
    </div>
  )
}