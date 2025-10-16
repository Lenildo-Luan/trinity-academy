'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { Quiz } from '@/data/quizzes'
import { getQuiz } from '@/data/quizzes'
import { useQuizState } from '@/hooks/use-quiz-state'
import { QuizInitialView } from './quiz-initial-view'
import { QuizActiveView } from './quiz-active-view'
import { QuizResultView } from './quiz-result-view'
import { QuizNavigationBlockerModal } from './quiz-navigation-blocker-modal'

type QuizSectionProps = {
  quizId: string
}

export function QuizSection({ quizId }: QuizSectionProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showNavigationBlocker, setShowNavigationBlocker] = useState(false)

  // Carregar quiz
  useEffect(() => {
    async function loadQuiz() {
      try {
        setLoading(true)
        const loadedQuiz = await getQuiz(quizId)

        if (!loadedQuiz) {
          setError('Quiz não encontrado')
          return
        }

        setQuiz(loadedQuiz)
      } catch (err) {
        console.error('Erro ao carregar quiz:', err)
        setError('Erro ao carregar quiz')
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [quizId])

  const quizState = useQuizState(quiz)

  // Timer
  useEffect(() => {
    if (quizState.state !== 'active') return

    const interval = setInterval(() => {
      quizState.setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Tempo esgotado
          quizState.finishQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [quizState])

  // Bloqueio de navegação durante quiz ativo
  useEffect(() => {
    if (quizState.state !== 'active') return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [quizState.state])

  // Handlers
  const handleSelectAlternative = (alternativeId: string) => {
    if (!quizState.currentQuestion) return
    quizState.selectAnswer(quizState.currentQuestion.id, alternativeId)
  }

  const handleNext = () => {
    if (quizState.currentQuestionIndex === quizState.totalQuestions - 1) {
      // Última questão, finalizar
      quizState.finishQuiz()
    } else {
      quizState.nextQuestion()
    }
  }

  const handleNavigationBlock = () => {
    setShowNavigationBlocker(false)
  }

  const handleNavigationConfirm = () => {
    setShowNavigationBlocker(false)
    quizState.finishQuiz()
    // Aqui será implementada a navegação real quando integrado com use-navigation-blocker
  }

  // Loading state
  if (loading) {
    return (
      <div className="mt-16 rounded-lg border border-zinc-950/10 bg-white p-8 text-center dark:border-white/10 dark:bg-white/2.5">
        <div className="flex items-center justify-center gap-2 text-zinc-600 dark:text-zinc-400">
          <svg
            className="h-5 w-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Carregando quiz...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !quiz) {
    return (
      <div className="mt-16 rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/20">
        <p className="text-red-600 dark:text-red-400">
          {error || 'Quiz não encontrado'}
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Seção do Quiz com separação visual clara */}
      <div className="mt-16 border-t border-gray-950/10 pt-16 dark:border-white/10">
        <div className="animate-fade-in">
          {quizState.state === 'inactive' && (
            <QuizInitialView quiz={quiz} onStart={quizState.startQuiz} />
          )}

          {quizState.state === 'active' && quizState.currentQuestion && (
            <QuizActiveView
              currentQuestion={quizState.currentQuestion}
              currentQuestionIndex={quizState.currentQuestionIndex}
              totalQuestions={quizState.totalQuestions}
              answeredQuestionsCount={quizState.answeredQuestionsCount}
              selectedAlternativeId={quizState.getCurrentAnswer(
                quizState.currentQuestion.id,
              )}
              timeRemaining={quizState.timeRemaining}
              isCurrentQuestionAnswered={quizState.isCurrentQuestionAnswered}
              onSelectAlternative={handleSelectAlternative}
              onNext={handleNext}
              onFinish={quizState.finishQuiz}
            />
          )}

          {quizState.state === 'finished' && quizState.result && (
            <QuizResultView
              quiz={quiz}
              result={quizState.result}
              onReset={quizState.resetQuiz}
            />
          )}
        </div>
      </div>

      {/* Modal de bloqueio de navegação */}
      <QuizNavigationBlockerModal
        isOpen={showNavigationBlocker}
        onCancel={handleNavigationBlock}
        onConfirm={handleNavigationConfirm}
      />
    </>
  )
}
