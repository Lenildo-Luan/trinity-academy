'use client'

/**
 * Hook para buscar estatísticas do usuário
 * Carrega progresso, notas, tempo de estudo e streak
 */

import { useState, useEffect, useCallback } from 'react'
import type { UserStatistics } from '@/types/database'
import { getUserStatistics } from '@/lib/stats-service'

export function useUserStats() {
  const [stats, setStats] = useState<UserStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Carrega as estatísticas do usuário
   */
  const loadStats = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await getUserStatistics()

    if (fetchError) {
      setError(fetchError)
      setStats(null)
    } else {
      setStats(data)
    }

    setLoading(false)
  }, [])

  /**
   * Recarrega as estatísticas
   */
  const refreshStats = useCallback(() => {
    loadStats()
  }, [loadStats])

  /**
   * Carrega estatísticas na montagem
   */
  useEffect(() => {
    loadStats()
  }, [loadStats])

  return {
    stats,
    loading,
    error,
    refreshStats,
  }
}
