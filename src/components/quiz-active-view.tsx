import type { Question } from '@/data/quizzes'
import { QuizTimer } from './quiz-timer'
import { QuizProgressBar } from './quiz-progress-bar'
import { QuizQuestion } from './quiz-question'
import { QuizNavigation } from './quiz-navigation'

type QuizActiveViewProps = {
  currentQuestion: Question
  currentQuestionIndex: number
  totalQuestions: number
  answeredQuestionsCount: number
  selectedAlternativeId: string | null
  timeRemaining: number
  isCurrentQuestionAnswered: boolean
  onSelectAlternative: (alternativeId: string) => void
  onNext: () => void
  onFinish: () => void
}

export function QuizActiveView({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  answeredQuestionsCount,
  selectedAlternativeId,
  timeRemaining,
  isCurrentQuestionAnswered,
  onSelectAlternative,
  onNext,
  onFinish,
}: QuizActiveViewProps) {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1

  return (
    <div className="animate-slide-up overflow-hidden rounded-2xl border border-gray-950/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/2.5">
      {/* Header com timer e progresso */}
      <div className="border-b border-gray-950/10 bg-gradient-to-r from-gray-50 to-white p-4 dark:border-white/10 dark:from-gray-950/50 dark:to-gray-950/30">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between sm:justify-start">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Questão {currentQuestionIndex + 1} de {totalQuestions}
            </div>
            <QuizTimer timeRemaining={timeRemaining} />
          </div>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="border-b border-gray-950/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-gray-950/30">
        <QuizProgressBar
          current={answeredQuestionsCount}
          total={totalQuestions}
        />
      </div>

      {/* Questão */}
      <div className="bg-white p-6 sm:p-8 dark:bg-gray-950/20">
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          selectedAlternativeId={selectedAlternativeId}
          onSelectAlternative={onSelectAlternative}
        />
      </div>

      {/* Footer com navegação */}
      <QuizNavigation
        isLastQuestion={isLastQuestion}
        isCurrentQuestionAnswered={isCurrentQuestionAnswered}
        onNext={onNext}
        onFinish={onFinish}
      />
    </div>
  )
}
