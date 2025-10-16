import type { Quiz } from '@/data/quizzes'

type QuizInitialViewProps = {
  quiz: Quiz
  onStart: () => void
}

export function QuizInitialView({ quiz, onStart }: QuizInitialViewProps) {
  const timeInMinutes = Math.floor(quiz.timeLimit / 60)

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-950/10 bg-white p-8 text-center dark:border-white/10 dark:bg-white/2.5">
      <h2 className="text-2xl font-semibold text-zinc-950 dark:text-white">
        {quiz.title}
      </h2>

      {quiz.description && (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {quiz.description}
        </p>
      )}

      <div className="mt-6 flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span>{quiz.questions.length} questões</span>
        </div>

        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5"
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
          <span>{timeInMinutes} minutos</span>
        </div>
      </div>

      <button
        onClick={onStart}
        className="mt-8 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-cyan-600"
      >
        Iniciar Quiz
      </button>
    </div>
  )
}
