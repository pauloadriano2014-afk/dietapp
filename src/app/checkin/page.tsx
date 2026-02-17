'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import CheckinButtonGroup from '@/components/CheckinButtonGroup'

function CheckinContent() {
  const searchParams = useSearchParams()
  const mealId = searchParams.get('mealId')
  const router = useRouter()
  
  const [status, setStatus] = useState<'success' | 'adapted' | 'failed' | null>(null)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!status || !mealId) return

    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()

    const { error } = await supabase.from('checkins').upsert({
      student_id: session?.user.id,
      meal_id: mealId,
      status,
      description: status === 'adapted' ? description : null,
      created_at: new Date().toISOString().split('T')[0] // Apenas a data YYYY-MM-DD
    })

    if (error) {
      alert('Erro ao salvar check-in: ' + error.message)
    } else {
      router.push('/dashboard-aluno')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 pt-12">
      <div className="max-w-md mx-auto bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
        <button 
          onClick={() => router.back()}
          className="text-slate-400 text-sm font-bold mb-6 flex items-center gap-2"
        >
          ← Voltar
        </button>

        <h1 className="text-2xl font-black text-slate-900 mb-2">Check-in da Refeição</h1>
        <p className="text-slate-500 text-sm mb-8 font-medium">Como foi sua adesão a esta refeição agora?</p>

        <div className="space-y-8">
          <CheckinButtonGroup currentStatus={status || ''} onSelect={setStatus} />

          {status === 'adapted' && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">O que você alterou?</label>
              <textarea
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none text-sm h-32"
                placeholder="Ex: Troquei o arroz por batata doce na mesma proporção..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!status || loading}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl disabled:opacity-30 transition-all shadow-lg shadow-slate-200"
          >
            {loading ? 'Salvando...' : 'Confirmar Registro'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CheckinPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold">Carregando...</div>}>
      <CheckinContent />
    </Suspense>
  )
}