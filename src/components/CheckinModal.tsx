'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, X, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'

export default function CheckinModal({ mealId, onClose }: { mealId: string, onClose: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const [description, setDescription] = useState('')

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPhoto(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleCheckin = async (status: 'success' | 'adapted' | 'failed') => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealId, status, description, mealPhoto: photo }),
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
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[120] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[45px] p-8 animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 uppercase italic">Registro Real</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
        </div>

        {/* Upload de Foto do Prato */}
        <div className="mb-6">
          <label className="w-full h-48 border-2 border-dashed border-slate-200 rounded-[35px] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-slate-50 hover:bg-slate-100 transition-all group">
            {photo ? (
              <img src={photo} className="w-full h-full object-cover" alt="Prato" />
            ) : (
              <>
                <div className="p-4 bg-white rounded-2xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
                  <Camera className="text-blue-600" size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Anexar foto do prato</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>

        <div className="space-y-3 mb-6">
          <button 
            disabled={loading}
            onClick={() => handleCheckin('success')}
            className="w-full bg-green-50 text-green-700 p-5 rounded-3xl flex items-center justify-between border border-green-100 active:scale-95 transition-all"
          >
            <span className="font-black text-xs uppercase tracking-widest">Segui à risca</span>
            <CheckCircle2 size={20} />
          </button>

          <button 
            disabled={loading}
            onClick={() => handleCheckin('failed')}
            className="w-full bg-red-50 text-red-700 p-5 rounded-3xl flex items-center justify-between border border-red-100 active:scale-95 transition-all"
          >
            <span className="font-black text-xs uppercase tracking-widest">Não segui</span>
            <XCircle size={20} />
          </button>
        </div>

        <textarea 
          placeholder="Alguma observação sobre os alimentos?"
          className="w-full bg-slate-50 p-5 rounded-[25px] outline-none text-xs font-bold mb-6 resize-none border border-transparent focus:border-blue-100"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </div>
  )
}