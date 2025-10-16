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
    <div className="rounded-lg border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-white/2.5">
      {/* Header com timer e progresso */}
      <div className="flex items-center justify-between border-b border-zinc-950/10 p-4 dark:border-white/10">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          Questão {currentQuestionIndex + 1} de {totalQuestions}
          <span className="ml-2 text-zinc-400 dark:text-zinc-500">
            ({answeredQuestionsCount} respondidas)
          </span>
        </div>

        <QuizTimer timeRemaining={timeRemaining} />
      </div>

      {/* Barra de progresso */}
      <div className="px-4 pt-4">
        <QuizProgressBar
          current={answeredQuestionsCount}
          total={totalQuestions}
        />
      </div>

      {/* Questão */}
      <div className="p-6">
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
