type QuizErrorViewProps = {
  error: string
  details?: string
}

export function QuizErrorView({ error, details }: QuizErrorViewProps) {
  return (
    <div className="animate-fade-in rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-8 shadow-sm dark:border-red-900/50 dark:from-red-950/20 dark:to-orange-950/20">
      <div className="flex flex-col items-center text-center">
        {/* Ícone de erro */}
        <div className="mb-4 rounded-full bg-red-100 p-4 dark:bg-red-900/30">
          <svg
            className="h-12 w-12 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        {/* Título do erro */}
        <h3 className="mb-2 text-xl font-semibold text-red-900 dark:text-red-100">
          Erro ao Carregar Quiz
        </h3>

        {/* Mensagem principal */}
        <p className="mb-4 text-base text-red-700 dark:text-red-300">
          {error}
        </p>

        {/* Detalhes técnicos (opcional) */}
        {details && (
          <details className="mt-4 w-full rounded-lg border border-red-200 bg-white/50 p-4 text-left dark:border-red-800/50 dark:bg-black/20">
            <summary className="cursor-pointer text-sm font-medium text-red-800 hover:text-red-900 dark:text-red-300 dark:hover:text-red-200">
              Detalhes técnicos
            </summary>
            <div className="mt-2 space-y-1 text-xs text-red-700 dark:text-red-400">
              <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono">
                {details}
              </pre>
            </div>
          </details>
        )}

        {/* Sugestões de ação */}
        <div className="mt-6 rounded-lg border border-red-200/50 bg-white/30 p-4 dark:border-red-800/30 dark:bg-black/10">
          <p className="text-sm text-red-800 dark:text-red-300">
            <strong>O que fazer:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-left text-sm text-red-700 dark:text-red-400">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-red-500">•</span>
              <span>Tente recarregar a página</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-red-500">•</span>
              <span>Verifique se você está conectado à internet</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-red-500">•</span>
              <span>
                Se o problema persistir, entre em contato com o suporte
              </span>
            </li>
          </ul>
        </div>

        {/* Botão para recarregar */}
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg active:scale-95 dark:bg-red-700 dark:hover:bg-red-600"
        >
          Recarregar Página
        </button>
      </div>
    </div>
  )
}
