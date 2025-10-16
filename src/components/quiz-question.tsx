import type { Question } from '@/data/quizzes'

type QuizQuestionProps = {
  question: Question
  questionNumber: number
  selectedAlternativeId: string | null
  onSelectAlternative: (alternativeId: string) => void
}

export function QuizQuestion({
  question,
  questionNumber,
  selectedAlternativeId,
  onSelectAlternative,
}: QuizQuestionProps) {
  return (
    <div>
      <div className="mb-6">
        <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
          Questão {questionNumber}
        </span>
        <h3 className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">
          {question.question}
        </h3>
      </div>

      {/* Alternativas */}
      <div className="space-y-3">
        {question.alternatives.map((alternative) => {
          const isSelected = selectedAlternativeId === alternative.id

          return (
            <label
              key={alternative.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                isSelected
                  ? 'border-cyan-500 bg-cyan-50 dark:border-cyan-500 dark:bg-cyan-950/20'
                  : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={isSelected}
                onChange={() => onSelectAlternative(alternative.id)}
                className="mt-1 h-4 w-4 text-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
              />
              <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">
                {alternative.text}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
