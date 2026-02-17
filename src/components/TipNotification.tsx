'use client'

import { useEffect, useState } from 'react'

export default function TipNotification({ lastTipDate }: { lastTipDate: string | null }) {
  const [hasNew, setHasNew] = useState(false)

  useEffect(() => {
    if (!lastTipDate) return

    const viewedDate = localStorage.getItem('pa_team_last_tip_viewed')
    
    // Se nunca viu ou se a data do banco é mais recente que a salva, mostra o ponto
    if (!viewedDate || new Date(lastTipDate) > new Date(viewedDate)) {
      setHasNew(true)
    }
  }, [lastTipDate])

  if (!hasNew) return null

  return (
    <span className="absolute -top-1 -right-1 flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 border border-white"></span>
    </span>
  )
}