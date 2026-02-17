'use client'

import { useEffect } from 'react'

export default function MarkAsRead({ latestDate }: { latestDate: string | null }) {
  useEffect(() => {
    if (latestDate) {
      // Salva a data da dica mais recente como "vista" no navegador
      localStorage.setItem('pa_team_last_tip_viewed', latestDate)
    }
  }, [latestDate])

  return null // Componente invisível
}