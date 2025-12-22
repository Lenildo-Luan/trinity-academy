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
      <div className="flex items-center justify-between border-t border-gray-950/10 bg-gray-50 p-4 sm:p-6 dark:border-white/10 dark:bg-gray-950/50">
        <button
          onClick={handleFinishClick}
          className="group flex items-center gap-2 rounded-full border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 focus:outline-2 focus:outline-offset-2 focus:outline-green-500 active:scale-95 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700"
        >
          <svg
            className="h-4 w-4 transition-transform group-hover:rotate-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Encerrar Prova
        </button>

        <button
          onClick={onNext}
          disabled={!isCurrentQuestionAnswered}
          className="group flex items-center gap-2 rounded-full bg-gray-950 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-gray-800 focus:outline-2 focus:outline-offset-2 focus:outline-green-500 active:scale-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-gray-950 dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:hover:bg-gray-700"
        >
          {isLastQuestion ? 'Finalizar Quiz' : 'Próxima Questão'}
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1 group-disabled:translate-x-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>

      {/* Modal de confirmação */}
      <Dialog
        open={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md animate-slide-up overflow-hidden rounded-2xl border border-gray-950/10 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-900">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 dark:from-orange-950/20 dark:to-red-950/20">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                <svg
                  className="h-6 w-6 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <DialogTitle className="text-center text-xl font-bold text-gray-950 dark:text-white">
                Encerrar Prova
              </DialogTitle>
            </div>

            <div className="p-6">
              <p className="text-center text-base text-gray-700 dark:text-gray-300">
                Tem certeza que deseja encerrar a prova agora? Suas respostas
                serão salvas e você verá o resultado.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setShowFinishModal(false)}
                  className="flex-1 rounded-full border-2 border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-2 focus:outline-offset-2 focus:outline-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmFinish}
                  className="flex-1 rounded-full bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-700 focus:outline-2 focus:outline-offset-2 focus:outline-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
                >
                  Tenho certeza
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
