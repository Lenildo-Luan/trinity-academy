type QuizProgressBarProps = {
  current: number // Questões respondidas
  total: number // Total de questões
}

export function QuizProgressBar({ current, total }: QuizProgressBarProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300">
        <span>
          <span className="hidden sm:inline">
            {current} de {total} questões respondidas
          </span>
          <span className="sm:hidden">
            {current}/{total} respondidas
          </span>
        </span>
        <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
          {percentage}%
        </span>
      </div>

      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${current} de ${total} questões respondidas`}
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/20" />
      </div>
    </div>
  )
}
