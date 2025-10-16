type QuizProgressBarProps = {
  current: number // Questões respondidas
  total: number // Total de questões
}

export function QuizProgressBar({ current, total }: QuizProgressBarProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
        <span>
          {current} de {total} questões respondidas
        </span>
        <span className="font-semibold">{percentage}%</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-cyan-500 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${current} de ${total} questões respondidas`}
        />
      </div>
    </div>
  )
}
