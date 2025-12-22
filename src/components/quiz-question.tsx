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
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">
          <svg
            className="h-3.5 w-3.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          Questão {questionNumber}
        </div>
        <h3 className="text-xl font-bold leading-tight text-gray-950 sm:text-2xl dark:text-white">
          {question.question}
        </h3>
      </div>

      {/* Alternativas */}
      <div className="space-y-3">
        {question.alternatives.map((alternative, index) => {
          const isSelected = selectedAlternativeId === alternative.id
          const letters = ['A', 'B', 'C', 'D', 'E', 'F']

          return (
            <label
              key={alternative.id}
              className={`group flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all hover:shadow-md ${
                isSelected
                  ? 'border-green-500 bg-green-50 shadow-md dark:border-green-500 dark:bg-green-950/30'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={isSelected}
                  onChange={() => onSelectAlternative(alternative.id)}
                  className="mt-0.5 h-5 w-5 cursor-pointer border-gray-300 text-green-600 transition focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-offset-gray-900"
                />
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-green-600 text-white dark:bg-green-500'
                      : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-gray-600'
                  }`}
                >
                  {letters[index]}
                </div>
              </div>
              <span
                className={`flex-1 text-base leading-relaxed transition-colors ${
                  isSelected
                    ? 'font-medium text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {alternative.text}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
