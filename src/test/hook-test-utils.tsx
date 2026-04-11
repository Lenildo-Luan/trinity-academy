import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'

type RenderHookResult<T, P> = {
  result: { current: T }
  rerender: (nextProps?: P) => void
  unmount: () => void
}

export function renderHook<T, P = undefined>(
  hook: (props: P) => T,
  options?: { initialProps: P },
): RenderHookResult<T, P> {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root: Root = createRoot(container)
  const result = { current: undefined as T }
  let props = options?.initialProps as P

  function TestComponent() {
    result.current = hook(props)
    return null
  }

  const render = (nextProps = props) => {
    props = nextProps
    act(() => {
      root.render(<TestComponent />)
    })
  }

  render(props)

  return {
    result,
    rerender: render,
    unmount: () => {
      act(() => {
        root.unmount()
      })
      container.remove()
    },
  }
}

export async function flushMicrotasks() {
  await act(async () => {
    await Promise.resolve()
  })
}
