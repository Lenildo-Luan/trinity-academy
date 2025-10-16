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

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excelente!'
    if (score >= 70) return 'Muito bom!'
    if (score >= 50) return 'Bom trabalho!'
    return 'Continue estudando!'
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="rounded-lg border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-white/2.5">
      {/* Header com resultado */}
      <div className="border-b border-zinc-950/10 p-6 text-center dark:border-white/10">
        <h2 className="text-2xl font-semibold text-zinc-950 dark:text-white">
          Quiz Finalizado!
        </h2>

        <div className="mt-6">
          <div className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
            {result.score}%
          </div>
          <p className="mt-2 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            {getScoreMessage(result.score)}
          </p>
        </div>

        <div className="mt-6 flex justify-center gap-8 text-sm text-zinc-600 dark:text-zinc-400">
          <div>
            <span className="font-semibold text-zinc-900 dark:text-white">
              {result.correctAnswers}
            </span>{' '}
            / {result.totalQuestions} acertos
          </div>
          <div>
            Tempo:{' '}
            <span className="font-semibold text-zinc-900 dark:text-white">
              {timeSpentMinutes}:{String(timeSpentSeconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Lista de questões com resultados */}
      <div className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-zinc-950 dark:text-white">
          Revisão das Questões
        </h3>

        <div className="space-y-6">
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
                className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      isCorrect
                        ? 'bg-green-100 text-green-600 dark:bg-green-950/20 dark:text-green-400'
                        : 'bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                    }`}
                  >
                    {isCorrect ? (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Questão {index + 1}: {question.question}
                    </p>

                    <div className="mt-2 space-y-2 text-sm">
                      {!isCorrect && selectedAlternative && (
                        <p className="text-red-600 dark:text-red-400">
                          Sua resposta: {selectedAlternative.text}
                        </p>
                      )}

                      {correctAlternative && (
                        <p className="text-green-600 dark:text-green-400">
                          Resposta correta: {correctAlternative.text}
                        </p>
                      )}

                      {correctAlternative?.explanation && (
                        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                          {correctAlternative.explanation}
                        </p>
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
      <div className="border-t border-zinc-950/10 p-6 dark:border-white/10">
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={scrollToTop}
            className="rounded-lg border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Rolar para o Topo
          </button>
          <button
            onClick={onReset}
            className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-cyan-600"
          >
            Refazer Quiz
          </button>
        </div>
      </div>
    </div>
  )
}
