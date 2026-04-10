'use client'

import { useEffect, useState } from 'react'
import type { Quiz } from '@/data/quizzes'
import { useQuizState } from '@/hooks/use-quiz-state'
import { useNavigationBlocker } from '@/hooks/use-navigation-blocker'
import { useQuizPersistence } from '@/hooks/use-quiz-persistence'
import { useAuth } from '@/contexts/auth-context'
import { QuizInitialView } from '../quiz-initial-view'
import { QuizActiveView } from '../quiz-active-view'
import { QuizResultView } from '../quiz-result-view'
import { QuizNavigationBlockerModal } from '../quiz-navigation-blocker-modal'
import { QuizAuthRequired } from '../quiz-auth-required'

type QuizSectionProps = {
  quiz: Quiz
  lessonId: string
  courseId: string
}

export function QuizSection({ quiz, lessonId, courseId }: QuizSectionProps) {
  const [showNavigationBlocker, setShowNavigationBlocker] = useState(false)
  const { user, loading } = useAuth()

  const quizState = useQuizState(quiz)

  // Hook de persistência - salva automaticamente no Supabase
  useQuizPersistence({
    quiz,
    lessonId,
    courseId,
    state: quizState.state,
    userAnswers: quizState.userAnswers,
    result: quizState.result,
  })

  // Hook de bloqueio de navegação
  const { confirmNavigation, cancelNavigation } = useNavigationBlocker({
    isActive: quizState.state === 'active',
    onNavigationAttempt: () => {
      setShowNavigationBlocker(true)
    },
  })

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
    // Usuário cancelou a navegação
    setShowNavigationBlocker(false)
    cancelNavigation()
  }

  const handleNavigationConfirm = () => {
    // Usuário confirmou que quer sair
    setShowNavigationBlocker(false)

    // Finaliza o quiz
    quizState.finishQuiz()

    // Permite a navegação e navega para o destino
    confirmNavigation()
  }

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="mt-16 border-t border-gray-950/10 pt-16 dark:border-white/10">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-green-600 dark:border-gray-700 dark:border-t-green-400" />
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, mostra aviso
  if (!user) {
    return (
      <div className="mt-16 border-t border-gray-950/10 pt-16 dark:border-white/10">
        <QuizAuthRequired />
      </div>
    )
  }

  return (
    <>
      {/* Seção do Quiz com separação visual clara */}
      <div className="mt-16 border-t border-gray-950/10 pt-16 dark:border-white/10">
        <div className="animate-fade-in">
          {quizState.state === 'inactive' && (
            <QuizInitialView quiz={quiz} courseId={courseId} onStart={quizState.startQuiz} />
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
