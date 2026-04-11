/** @vitest-environment jsdom */

import { act } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { getRouterMock, setPathnameMock } from '@/test'
import { renderHook } from '@/test/hook-test-utils'

import { useNavigationBlocker } from './use-navigation-blocker'

describe('useNavigationBlocker', () => {
  it('intercepts beforeunload, popstate and internal links', () => {
    vi.useFakeTimers()
    const router = getRouterMock()
    const onNavigationAttempt = vi.fn()
    const historyPushSpy = vi.spyOn(window.history, 'pushState')
    const historyBackSpy = vi.spyOn(window.history, 'back')
    setPathnameMock('/quiz')

    const { result, unmount } = renderHook(
      (props: { isActive: boolean }) =>
        useNavigationBlocker({
          isActive: props.isActive,
          onNavigationAttempt,
          message: 'leave?',
        }),
      { initialProps: { isActive: true } },
    )

    const beforeUnloadEvent = new Event('beforeunload', { cancelable: true })
    act(() => {
      window.dispatchEvent(beforeUnloadEvent)
    })
    expect(beforeUnloadEvent.defaultPrevented).toBe(true)

    const popstateEvent = new PopStateEvent('popstate', { state: null })
    act(() => {
      window.dispatchEvent(popstateEvent)
    })
    expect(onNavigationAttempt).not.toHaveBeenCalled()

    act(() => {
      result.current.confirmNavigation()
    })
    const popstateAfterConfirm = new PopStateEvent('popstate', { state: null })
    act(() => {
      window.dispatchEvent(popstateAfterConfirm)
    })
    expect(historyPushSpy).toHaveBeenCalledWith(null, '', '/quiz')
    expect(onNavigationAttempt).toHaveBeenCalledWith('__back__')
    expect(result.current.pendingDestination).toBe('__back__')

    act(() => {
      result.current.confirmNavigation()
      vi.runAllTimers()
    })
    expect(historyBackSpy).toHaveBeenCalled()

    const internalLink = document.createElement('a')
    internalLink.setAttribute('href', '/next')
    document.body.appendChild(internalLink)
    const linkEvent = new MouseEvent('click', { bubbles: true, cancelable: true })

    act(() => {
      internalLink.dispatchEvent(linkEvent)
    })
    expect(linkEvent.defaultPrevented).toBe(true)
    expect(onNavigationAttempt).toHaveBeenCalledWith('/next')
    expect(result.current.pendingDestination).toBe('/next')

    act(() => {
      result.current.confirmNavigation()
      vi.runAllTimers()
    })
    expect(router.push).toHaveBeenCalledWith('/next')
    expect(result.current.pendingDestination).toBeNull()

    unmount()

    act(() => {
      internalLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    document.body.removeChild(internalLink)
  })

  it('ignores non-blocking and non-interceptable links and allows cancellation', () => {
    const onNavigationAttempt = vi.fn()
    const { result, rerender, unmount } = renderHook(
      (props: { isActive: boolean }) =>
        useNavigationBlocker({
          isActive: props.isActive,
          onNavigationAttempt,
        }),
      { initialProps: { isActive: false } },
    )

    const makeLink = (href: string | null, attrs: Record<string, string> = {}) => {
      const link = document.createElement('a')
      if (href !== null) {
        link.setAttribute('href', href)
      }
      Object.entries(attrs).forEach(([key, value]) => link.setAttribute(key, value))
      document.body.appendChild(link)
      return link
    }

    rerender({ isActive: true })
    act(() => {
      result.current.confirmNavigation()
    })

    const links = [
      makeLink('#section'),
      makeLink('mailto:test@example.com'),
      makeLink('tel:+5511999999999'),
      makeLink('/download', { download: '' }),
      makeLink('/blank', { target: '_blank' }),
      makeLink('https://external.example.com/page'),
      makeLink(null),
    ]

    for (const link of links) {
      act(() => {
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      })
    }
    expect(onNavigationAttempt).not.toHaveBeenCalled()

    const malformedUrlLink = makeLink('%')
    act(() => {
      malformedUrlLink.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })
    expect(onNavigationAttempt).toHaveBeenCalledWith('%')
    act(() => {
      result.current.cancelNavigation()
    })

    const parent = document.createElement('a')
    parent.setAttribute('href', '/nested')
    const child = document.createElement('span')
    parent.appendChild(child)
    document.body.appendChild(parent)

    act(() => {
      child.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    expect(onNavigationAttempt).toHaveBeenCalledWith('/nested')
    expect(result.current.pendingDestination).toBe('/nested')

    act(() => {
      result.current.cancelNavigation()
    })
    expect(result.current.pendingDestination).toBeNull()

    links.forEach((link) => document.body.removeChild(link))
    document.body.removeChild(malformedUrlLink)
    document.body.removeChild(parent)
    unmount()
  })
})
