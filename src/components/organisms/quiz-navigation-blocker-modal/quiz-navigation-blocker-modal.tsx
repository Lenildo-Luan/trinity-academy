'use client'

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from '@headlessui/react'

type QuizNavigationBlockerModalProps = {
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function QuizNavigationBlockerModal({
  isOpen,
  onCancel,
  onConfirm,
}: QuizNavigationBlockerModalProps) {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg border border-zinc-950/10 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-zinc-900">
          <DialogTitle className="text-lg font-semibold text-zinc-950 dark:text-white">
            Sair da Página?
          </DialogTitle>

          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Ao sair desta página, o quiz será finalizado e suas respostas serão
            salvas. Deseja continuar?
          </p>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
            >
              Continuar no Quiz
            </button>
            <button
              onClick={onConfirm}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Sair e Finalizar
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
