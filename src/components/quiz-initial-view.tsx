import type { Quiz } from '@/data/quizzes'
import { QuizBestAttempt } from './quiz-best-attempt'

type QuizInitialViewProps = {
  quiz: Quiz
  courseId: string
  onStart: () => void
}

export function QuizInitialView({ quiz, courseId, onStart }: QuizInitialViewProps) {
  const timeInMinutes = Math.floor(quiz.timeLimit / 60)

  return (
    <div className="animate-slide-up overflow-hidden rounded-2xl border border-gray-950/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/2.5">
      <div className="bg-gradient-to-br from-green-50 to-sky-50 p-8 text-center dark:from-green-950/20 dark:to-sky-950/20">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 dark:bg-green-500/20">
          <svg
            className="h-8 w-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl dark:text-white">
          {quiz.title}
        </h2>

        {quiz.description && (
          <p className="mt-3 text-base text-gray-700 dark:text-gray-300">
            {quiz.description}
          </p>
        )}
      </div>

      <div className="border-t border-gray-950/10 bg-white p-6 dark:border-white/10 dark:bg-gray-950/50">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg
              className="h-5 w-5 text-gray-500 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="font-medium">
              {quiz.questions.length} questões
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg
              className="h-5 w-5 text-gray-500 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">{timeInMinutes} minutos</span>
          </div>
        </div>

        {/* Melhor tentativa anterior */}
        <QuizBestAttempt quizId={quiz.id} courseId={courseId} />

        <div className="mt-6 flex justify-center">
          <button
            onClick={onStart}
            className="group relative overflow-hidden rounded-full bg-gray-950 px-8 py-3 text-base font-semibold text-white transition-all hover:scale-105 hover:bg-gray-800 focus:outline-2 focus:outline-offset-2 focus:outline-sky-500 active:scale-100 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <span className="relative z-10">Iniciar Quiz</span>
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-green-500 to-sky-500 opacity-0 transition-opacity group-hover:opacity-20" />
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-500">
          Você pode rolar a página durante o quiz para revisar o conteúdo da
          lição
        </p>
      </div>
    </div>
  )
}
