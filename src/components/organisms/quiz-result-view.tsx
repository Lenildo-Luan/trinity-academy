import type { Quiz } from '@/data/quizzes'
import type { QuizResult } from '@/hooks/use-quiz-state'

type QuizResultViewProps = {
  quiz: Quiz
  result: QuizResult
  onReset: () => void
}

export function QuizResultView({ quiz, result, onReset }: QuizResultViewProps) {
  const timeSpentMinutes = Math.floor(result.timeSpent / 60)
  const timeSpentSeconds = result.timeSpent % 60

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400'
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 70) return 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20'
    if (score >= 50) return 'from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20'
    return 'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 70) {
      return (
        <svg className="h-16 w-16 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    }
    if (score >= 50) {
      return (
        <svg className="h-16 w-16 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    }
    return (
      <svg className="h-16 w-16 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    )
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excelente trabalho!'
    if (score >= 70) return 'Muito bem!'
    if (score >= 50) return 'Bom trabalho!'
    return 'Continue praticando!'
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="animate-slide-up overflow-hidden rounded-2xl border border-gray-950/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/2.5">
      {/* Header com resultado */}
      <div className={`bg-gradient-to-br p-8 text-center ${getScoreGradient(result.score)}`}>
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
          {getScoreIcon(result.score)}
        </div>

        <h2 className="text-3xl font-bold text-gray-950 dark:text-white">
          Quiz Finalizado!
        </h2>

        <div className="mt-8">
          <div className={`text-7xl font-black ${getScoreColor(result.score)}`}>
            {result.score}%
          </div>
          <p className="mt-3 text-xl font-bold text-gray-800 dark:text-gray-200">
            {getScoreMessage(result.score)}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-6">
          <div className="rounded-2xl bg-white/80 px-6 py-4 backdrop-blur-sm dark:bg-gray-900/80">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Acertos
            </div>
            <div className="mt-1 text-2xl font-bold text-gray-950 dark:text-white">
              {result.correctAnswers} / {result.totalQuestions}
            </div>
          </div>
          <div className="rounded-2xl bg-white/80 px-6 py-4 backdrop-blur-sm dark:bg-gray-900/80">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tempo
            </div>
            <div className="mt-1 text-2xl font-bold text-gray-950 dark:text-white">
              {timeSpentMinutes}:{String(timeSpentSeconds).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de questões com resultados */}
      <div className="border-t border-gray-950/10 bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-gray-950/20">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-green-500">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-950 dark:text-white">
            Revisão das Questões
          </h3>
        </div>

        <div className="space-y-4">
          {quiz.questions.map((question, index) => {
            const userAnswer = result.userAnswers.find(
              (a) => a.questionId === question.id,
            )
            const selectedAlternative = question.alternatives.find(
              (alt) => alt.id === userAnswer?.selectedAlternativeId,
            )
            const correctAlternative = question.alternatives.find(
              (alt) => alt.isCorrect,
            )
            const isCorrect = selectedAlternative?.isCorrect || false

            return (
              <div
                key={question.id}
                className={`overflow-hidden rounded-xl border-2 transition-all ${
                  isCorrect
                    ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20'
                    : 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20'
                }`}
              >
                <div className="flex items-start gap-4 p-5">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isCorrect
                        ? 'bg-green-500 text-white dark:bg-green-600'
                        : 'bg-red-500 text-white dark:bg-red-600'
                    }`}
                  >
                    {isCorrect ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        QUESTÃO {index + 1}
                      </span>
                      <p className="mt-1 text-base font-bold text-gray-900 dark:text-white">
                        {question.question}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {!isCorrect && selectedAlternative && (
                        <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900/30">
                          <p className="text-sm font-semibold text-red-900 dark:text-red-300">
                            Sua resposta:
                          </p>
                          <p className="mt-1 text-sm text-red-800 dark:text-red-200">
                            {selectedAlternative.text}
                          </p>
                        </div>
                      )}

                      {correctAlternative && (
                        <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                          <p className="text-sm font-semibold text-green-900 dark:text-green-300">
                            Resposta correta:
                          </p>
                          <p className="mt-1 text-sm text-green-800 dark:text-green-200">
                            {correctAlternative.text}
                          </p>
                        </div>
                      )}

                      {correctAlternative?.explanation && (
                        <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/30">
                          <p className="text-sm font-semibold text-green-900 dark:text-green-300">
                            Explicação:
                          </p>
                          <p className="mt-1 text-sm text-green-800 dark:text-green-200">
                            {correctAlternative.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer com botões de ação */}
      <div className="border-t border-gray-950/10 bg-gray-50 p-6 dark:border-white/10 dark:bg-gray-950/50">
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 focus:outline-2 focus:outline-offset-2 focus:outline-green-500 active:scale-95 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Rolar para o Topo
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 rounded-full bg-gray-950 px-8 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-gray-800 focus:outline-2 focus:outline-offset-2 focus:outline-green-500 active:scale-100 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refazer Quiz
          </button>
        </div>
      </div>
    </div>
  )
}
