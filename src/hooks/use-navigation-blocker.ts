'use client'

import { useEffect, useCallback, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export interface UseNavigationBlockerOptions {
  isActive: boolean
  onNavigationAttempt: () => void
  message?: string
}

/**
 * Hook para bloquear navegação durante o quiz ativo
 *
 * Intercepta:
 * - Mudanças de rota no Next.js
 * - Navegação back/forward do browser
 * - Tentativas de fechar/recarregar a página
 *
 * Quando uma tentativa de navegação é detectada, chama onNavigationAttempt()
 * para que o componente possa exibir um modal de confirmação.
 */
export function useNavigationBlocker({
  isActive,
  onNavigationAttempt,
  message = 'Ao sair desta página, o quiz será finalizado. Deseja continuar?',
}: UseNavigationBlockerOptions) {
  const pathname = usePathname()
  const router = useRouter()
  const isBlockingRef = useRef(false)
  const currentPathnameRef = useRef(pathname)

  // Atualiza pathname atual
  useEffect(() => {
    currentPathnameRef.current = pathname
  }, [pathname])

  // Handler para beforeunload (fechar aba, recarregar página, etc)
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (!isActive) return

      // Padrão moderno - define returnValue
      e.preventDefault()
      e.returnValue = message

      // Alguns browsers ainda usam o valor de retorno
      return message
    },
    [isActive, message],
  )

  // Handler para popstate (navegação back/forward)
  const handlePopState = useCallback(
    (e: PopStateEvent) => {
      if (!isActive || isBlockingRef.current) return

      // Previne a navegação voltando para a página atual
      e.preventDefault()
      window.history.pushState(null, '', currentPathnameRef.current)

      // Notifica o componente para exibir modal
      onNavigationAttempt()
    },
    [isActive, onNavigationAttempt],
  )

  // Configuração dos event listeners
  useEffect(() => {
    if (!isActive) {
      isBlockingRef.current = false
      return
    }

    isBlockingRef.current = true

    // Adiciona listeners
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)

    // Adiciona entrada no histórico para capturar back/forward
    window.history.pushState(null, '', pathname)

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
      isBlockingRef.current = false
    }
  }, [isActive, handleBeforeUnload, handlePopState, pathname])

  // Função para confirmar navegação (desabilita bloqueio temporariamente)
  const confirmNavigation = useCallback(() => {
    isBlockingRef.current = false
  }, [])

  return {
    confirmNavigation,
    isBlocking: isActive,
  }
}
