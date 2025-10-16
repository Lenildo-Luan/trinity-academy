'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from '@headlessui/react'

type QuizNavigationProps = {
  isLastQuestion: boolean
  isCurrentQuestionAnswered: boolean
  onNext: () => void
  onFinish: () => void
}

export function QuizNavigation({
  isLastQuestion,
  isCurrentQuestionAnswered,
  onNext,
  onFinish,
}: QuizNavigationProps) {
  const [showFinishModal, setShowFinishModal] = useState(false)

  const handleFinishClick = () => {
    setShowFinishModal(true)
  }

  const handleConfirmFinish = () => {
    setShowFinishModal(false)
    onFinish()
  }

  return (
    <>
      <div className="flex items-center justify-between border-t border-zinc-950/10 p-4 dark:border-white/10">
        <button
          onClick={handleFinishClick}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Encerrar Prova
        </button>

        <button
          onClick={onNext}
          disabled={!isCurrentQuestionAnswered}
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-cyan-500"
        >
          {isLastQuestion ? 'Finalizar' : 'Próxima Questão'}
        </button>
      </div>

      {/* Modal de confirmação */}
      <Dialog
        open={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-lg border border-zinc-950/10 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-zinc-900">
            <DialogTitle className="text-lg font-semibold text-zinc-950 dark:text-white">
              Encerrar Prova
            </DialogTitle>

            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Tem certeza que deseja encerrar a prova agora? Suas respostas
              serão salvas e você verá o resultado.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowFinishModal(false)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmFinish}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
              >
                Encerrar Prova
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
