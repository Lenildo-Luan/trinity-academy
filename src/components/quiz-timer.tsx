type QuizTimerProps = {
  timeRemaining: number // em segundos
  onTimeExpired?: () => void
}

export function QuizTimer({ timeRemaining, onTimeExpired }: QuizTimerProps) {
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  // Alerta visual nos últimos 2 minutos
  const isLowTime = timeRemaining < 120
  const isCriticalTime = timeRemaining < 60

  // Efeito de piscar quando crítico (< 1 minuto)
  const shouldBlink = isCriticalTime && Math.floor(timeRemaining % 2) === 0

  return (
    <div className="flex items-center gap-2">
      <svg
        className={`h-4 w-4 sm:h-5 sm:w-5 ${
          isLowTime
            ? 'text-red-600 dark:text-red-400'
            : 'text-gray-600 dark:text-gray-400'
        }`}
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

      <div
        className={`font-mono text-sm font-bold transition-all sm:text-base ${
          isCriticalTime
            ? 'text-red-600 dark:text-red-400'
            : isLowTime
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-gray-900 dark:text-white'
        } ${shouldBlink ? 'opacity-50' : 'opacity-100'}`}
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      {isLowTime && (
        <span className="hidden text-xs font-medium text-red-600 sm:inline dark:text-red-400">
          {isCriticalTime ? '!' : 'Tempo baixo'}
        </span>
      )}
    </div>
  )
}
