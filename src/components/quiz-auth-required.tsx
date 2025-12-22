'use client'

import Link from 'next/link'
import { LockClosedIcon } from '@heroicons/react/24/outline'

export function QuizAuthRequired() {
  return (
    <div className="rounded-2xl border border-gray-950/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-gray-950">
      <div className="flex flex-col items-center text-center">
        {/* Ícone de cadeado */}
        <div className="mb-6 rounded-full bg-green-500/10 p-4 dark:bg-green-400/10">
          <LockClosedIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>

        {/* Título */}
        <h3 className="mb-2 text-2xl font-semibold text-gray-950 dark:text-white">
          Login necessário
        </h3>

        {/* Descrição */}
        <p className="mb-8 max-w-md text-gray-700 dark:text-gray-300">
          Para realizar os quizzes e acompanhar seu progresso, você precisa estar logado na plataforma.
        </p>

        {/* Botão de login */}
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-full bg-green-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-offset-gray-950"
        >
          Fazer login
        </Link>

        {/* Texto adicional */}
        <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          Ainda não tem uma conta?{' '}
          <Link
            href="/login"
            className="font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            Cadastre-se gratuitamente
          </Link>
        </p>
      </div>
    </div>
  )
}
