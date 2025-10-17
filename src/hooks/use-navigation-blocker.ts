'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export interface UseNavigationBlockerOptions {
  isActive: boolean
  onNavigationAttempt: (destination?: string) => void
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
  const [pendingDestination, setPendingDestination] = useState<string | null>(null)

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

      // Armazena que foi uma navegação back
      setPendingDestination('__back__')

      // Notifica o componente para exibir modal
      onNavigationAttempt('__back__')
    },
    [isActive, onNavigationAttempt],
  )

  // Handler para cliques em links
  const handleLinkClick = useCallback(
    (e: MouseEvent) => {
      if (!isActive || isBlockingRef.current) return

      // Encontra o link clicado (pode ser o próprio elemento ou um ancestral)
      let target = e.target as HTMLElement
      let link: HTMLAnchorElement | null = null

      // Percorre até 5 níveis para encontrar um link
      for (let i = 0; i < 5 && target; i++) {
        if (target.tagName === 'A') {
          link = target as HTMLAnchorElement
          break
        }
        target = target.parentElement as HTMLElement
      }

      // Se não é um link, ignora
      if (!link) return

      // Ignora links para a mesma página (âncoras)
      const href = link.getAttribute('href')
      if (!href || href.startsWith('#')) return

      // Ignora links externos (target="_blank", download, etc)
      if (
        link.getAttribute('target') === '_blank' ||
        link.hasAttribute('download') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
      ) {
        return
      }

      // Ignora se é um link externo (diferente origem)
      try {
        const linkUrl = new URL(href, window.location.origin)
        if (linkUrl.origin !== window.location.origin) {
          return
        }
      } catch {
        // Se falhar ao parsear URL, assume que é relativa e continua
      }

      // Armazena o destino da navegação
      setPendingDestination(href)

      // Previne a navegação e exibe modal
      e.preventDefault()
      e.stopPropagation()
      onNavigationAttempt(href)
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
    // Captura cliques em links durante a fase de captura para interceptar antes do Next.js
    document.addEventListener('click', handleLinkClick, true)

    // Adiciona entrada no histórico para capturar back/forward
    window.history.pushState(null, '', pathname)

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
      document.removeEventListener('click', handleLinkClick, true)
      isBlockingRef.current = false
    }
  }, [isActive, handleBeforeUnload, handlePopState, handleLinkClick, pathname])

  // Função para confirmar navegação (desabilita bloqueio e navega)
  const confirmNavigation = useCallback(() => {
    isBlockingRef.current = false

    // Se há um destino pendente, navega para ele
    if (pendingDestination) {
      if (pendingDestination === '__back__') {
        // Navegação back/forward
        setTimeout(() => {
          window.history.back()
        }, 0)
      } else {
        // Navegação para link específico
        setTimeout(() => {
          router.push(pendingDestination)
        }, 0)
      }
      setPendingDestination(null)
    }
  }, [pendingDestination, router])

  // Função para cancelar navegação
  const cancelNavigation = useCallback(() => {
    setPendingDestination(null)
  }, [])

  return {
    confirmNavigation,
    cancelNavigation,
    isBlocking: isActive,
    pendingDestination,
  }
}
