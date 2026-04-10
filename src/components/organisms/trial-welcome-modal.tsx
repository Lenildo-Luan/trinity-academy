'use client'

import { Dialog } from '@headlessui/react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type TrialWelcomeModalProps = {
  isOpen: boolean
  onClose: () => void
  trialEndDate: Date
}

export function TrialWelcomeModal({ isOpen, onClose, trialEndDate }: TrialWelcomeModalProps) {
  const formattedDate = format(trialEndDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
          <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Bem-vindo à Plataforma!
          </Dialog.Title>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Seu período de <strong>teste gratuito de 7 dias</strong> foi iniciado com sucesso!
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Acesso gratuito até:
              </p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                {formattedDate}
              </p>
            </div>

            <p className="text-sm">
              Durante este período, você terá acesso completo a todos os recursos da plataforma.
              Após o término do período gratuito, será necessário assinar o plano mensal de{' '}
              <strong>R$ 19,99</strong> para continuar aprendendo.
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
          >
            Começar a Aprender
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
