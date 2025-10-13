import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-950 dark:text-white mb-4">
          404 - Página não encontrada
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          A página que você está procurando não existe.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  )
}
