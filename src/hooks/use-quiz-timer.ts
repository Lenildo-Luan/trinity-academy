'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export type TimerStatus = 'idle' | 'running' | 'paused' | 'expired'

export interface UseQuizTimerOptions {
  initialTime: number // tempo inicial em segundos
  onExpire?: () => void // callback quando tempo expira
}

export function useQuizTimer({ initialTime, onExpire }: UseQuizTimerOptions) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime)
  const [status, setStatus] = useState<TimerStatus>('idle')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasExpiredRef = useRef(false)

  // Limpa o intervalo
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Inicia o timer
  const start = useCallback(() => {
    if (status === 'running') return

    setStatus('running')
    hasExpiredRef.current = false

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [status])

  // Pausa o timer
  const pause = useCallback(() => {
    if (status !== 'running') return

    clearTimer()
    setStatus('paused')
  }, [status, clearTimer])

  // Reseta o timer
  const reset = useCallback(() => {
    clearTimer()
    setTimeRemaining(initialTime)
    setStatus('idle')
    hasExpiredRef.current = false
  }, [clearTimer, initialTime])

  // Monitora quando o tempo expira
  useEffect(() => {
    if (timeRemaining === 0 && status === 'running' && !hasExpiredRef.current) {
      clearTimer()
      setStatus('expired')
      hasExpiredRef.current = true

      // Chama callback de expiração
      if (onExpire) {
        onExpire()
      }
    }
  }, [timeRemaining, status, clearTimer, onExpire])

  // Limpa o intervalo ao desmontar
  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [clearTimer])

  // Formata o tempo em MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Verifica se está nos últimos 2 minutos (alerta visual)
  const isWarning = timeRemaining <= 120 && timeRemaining > 0

  // Verifica se está nos últimos 30 segundos (alerta crítico)
  const isCritical = timeRemaining <= 30 && timeRemaining > 0

  return {
    timeRemaining,
    status,
    formattedTime: formatTime(timeRemaining),
    isWarning,
    isCritical,
    start,
    pause,
    reset,
  }
}
