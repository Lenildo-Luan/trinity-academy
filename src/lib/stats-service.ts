/**
 * Serviço para buscar estatísticas do usuário no Supabase
 * Funções para obter progresso, notas, tempo de estudo e streak
 */

import { createClient } from '@/lib/supabase/client'
import type { UserStatistics } from '@/types/database'

/**
 * Busca todas as estatísticas do usuário
 */
export async function getUserStatistics(): Promise<{
  data: UserStatistics | null
  error: Error | null
}> {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error('Erro de autenticação:', authError)
      throw new Error(`Erro de autenticação: ${authError.message}`)
    }

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    console.log('Buscando estatísticas para usuário:', user.id)

    // Chamar a função SQL que retorna todas as estatísticas
    const { data, error } = await supabase.rpc('get_user_statistics', {
      p_user_id: user.id,
    })

    if (error) {
      console.error('Erro ao buscar estatísticas:', error)
      throw new Error(
        `Erro ao buscar estatísticas: ${error.message}. Verifique se as funções SQL foram criadas no Supabase.`,
      )
    }

    // A função retorna um array com um único objeto
    const stats = Array.isArray(data) && data.length > 0 ? data[0] : null

    if (!stats) {
      // Retornar estatísticas vazias se não houver dados
      return {
        data: {
          total_lessons: 14,
          completed_lessons: 0,
          completion_percentage: 0,
          average_score: 0,
          total_study_time_seconds: 0,
          current_streak: 0,
        },
        error: null,
      }
    }

    console.log('Estatísticas encontradas:', stats)

    return { data: stats as UserStatistics, error: null }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    const errorMessage =
      error instanceof Error
        ? error.message
        : JSON.stringify(error) || 'Erro desconhecido ao buscar estatísticas'
    return {
      data: null,
      error: new Error(errorMessage),
    }
  }
}

/**
 * Formata tempo em segundos para string legível
 * @param seconds - Tempo em segundos
 * @returns String formatada (ex: "2h 30min" ou "45min")
 */
export function formatStudyTime(seconds: number): string {
  if (seconds === 0) return '0min'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours === 0) {
    return `${minutes}min`
  }

  if (minutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${minutes}min`
}

/**
 * Retorna a cor apropriada para o progresso baseado na porcentagem
 */
export function getProgressColor(
  percentage: number,
): 'green' | 'yellow' | 'gray' {
  if (percentage >= 70) return 'green'
  if (percentage >= 40) return 'yellow'
  return 'gray'
}

/**
 * Retorna a cor apropriada para a nota baseado no valor
 */
export function getScoreColor(score: number): 'green' | 'yellow' | 'red' {
  if (score >= 7.0) return 'green'
  if (score >= 5.0) return 'yellow'
  return 'red'
}
