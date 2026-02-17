'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PostarDicaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'mentalidade'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Dica publicada com sucesso no mural!')
        router.push('/dashboard-coach')
        router.refresh()
      } else {
        alert('Erro ao publicar a dica. Verifique a conexão.')
      }
    } catch (error) {
      console.error('Erro ao postar:', error)
      alert('Erro interno no servidor.')
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
          Mural de<br/><span className="text-blue-600">Conhecimento</span>
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 space-y-6">
          
          {/* Seleção de Categoria */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">
              Tipo de Orientação
            </label>
            <div className="relative">
              <select 
                className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800 appearance-none border border-transparent focus:border-blue-600 transition-all"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="mentalidade">🧠 Mentalidade de Campeão</option>
                <option value="tecnica">💪 Técnica e Execução</option>
                <option value="motivacao">🔥 Motivação Diária</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">
              Título da Dica
            </label>
            <input 
              placeholder="Ex: O segredo da constância"
              className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-slate-800 border border-transparent focus:border-blue-600 transition-all"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          {/* Conteúdo */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">
              Conteúdo (Apenas Texto)
            </label>
            <textarea 
              placeholder="Escreva aqui sua mentoria para o time..."
              className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-medium text-slate-800 min-h-[250px] border border-transparent focus:border-blue-600 transition-all"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white font-black py-6 rounded-[32px] uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
        >
          {loading ? 'Publicando...' : 'Publicar no SHAPE NATURAL DE ELITE'}
        </button>
      </form>

      <p className="mt-8 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest px-4">
        As dicas ficam disponíveis instantaneamente para todos os alunos do Team.
      </p>
    </div>
  )
}