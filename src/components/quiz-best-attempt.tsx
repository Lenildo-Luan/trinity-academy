'use client'

import { useEffect, useState } from 'react'
import { getBestQuizAttempt } from '@/lib/quiz-service'
import type { QuizAttempt } from '@/types/database'

type QuizBestAttemptProps = {
  quizId: string
}

export function QuizBestAttempt({ quizId }: QuizBestAttemptProps) {
  const [bestAttempt, setBestAttempt] = useState<QuizAttempt | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBestQuizAttempt(quizId)
      .then(({ data, error }) => {
        if (error) {
          console.error('Erro ao buscar melhor tentativa:', error)
          return
        }
        setBestAttempt(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [quizId])

  if (loading) {
    return (
      <div className="mt-4 animate-pulse rounded-lg border border-gray-950/10 bg-gray-50 p-4 dark:border-white/10 dark:bg-gray-900/50">
        <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mt-2 h-3 w-48 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    )
  }

  if (!bestAttempt) {
    return null
  }

  const percentage = Math.round((bestAttempt.score / bestAttempt.total_questions) * 100)
  const isPassed = percentage >= 70

  const formatTime = (seconds: number | null) => {
    if (!seconds) return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}min ${remainingSeconds}s`
  }

  return (
    <div className="mt-4 rounded-lg border border-gray-950/10 bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 dark:border-white/10 dark:from-gray-900/50 dark:to-gray-800/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              isPassed
                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isPassed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-950 dark:text-white">
              Melhor pontuação anterior
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {bestAttempt.score} de {bestAttempt.total_questions} corretas
            </p>
          </div>
        </div>
        <div className="text-right">
          <p
            className={`text-2xl font-bold ${
              isPassed
                ? 'text-green-600 dark:text-green-400'
                : 'text-yellow-600 dark:text-yellow-400'
            }`}
          >
            {percentage}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {formatTime(bestAttempt.time_spent)}
          </p>
        </div>
      </div>

      {isPassed && (
        <div className="mt-3 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-medium">Lição completada</span>
        </div>
      )}
    </div>
  )
}
