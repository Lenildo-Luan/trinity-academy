import Link from 'next/link'

export default function SubscriptionExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Período de Teste Expirado
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Seu período de teste gratuito de 7 dias chegou ao fim.
            Para continuar aprendendo, assine nosso plano mensal.
          </p>

          <Link
            href="/subscribe"
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Ver Planos de Assinatura
          </Link>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Apenas R$ 19,99/mês • Cancele quando quiser
          </p>
        </div>
      </div>
    </div>
  )
}
