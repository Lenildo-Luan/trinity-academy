/**
 * Serviço para gerenciar quizzes no Supabase
 * Funções para criar, atualizar e buscar tentativas de quiz
 */

import { createClient } from '@/lib/supabase/client'
import type {
  QuizAttempt,
  QuizAttemptInsert,
  QuizAttemptUpdate,
  QuizAnswer,
  QuizAnswerInsert,
  UserProgress,
  QuizStatistics,
  CompletedLesson,
  QuizAttemptDetail,
} from '@/types/database'

/**
 * Cria uma nova tentativa de quiz
 */
export async function createQuizAttempt(
  data: QuizAttemptInsert,
): Promise<{ data: QuizAttempt | null; error: Error | null }> {
  try {
    const supabase = createClient()

    // Verificar se usuário está autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data: attempt, error } = await supabase
      .from('quiz_attempts')
      .insert({
        ...data,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error

    return { data: attempt, error: null }
  } catch (error) {
    console.error('Erro ao criar tentativa de quiz:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Erro desconhecido'),
    }
  }
}

/**
 * Atualiza uma tentativa de quiz existente
 */
export async function updateQuizAttempt(
  attemptId: string,
  data: QuizAttemptUpdate,
): Promise<{ data: QuizAttempt | null; error: Error | null }> {
  try {
    const supabase = createClient()

    const { data: attempt, error } = await supabase
      .from('quiz_attempts')
      .update(data)
      .eq('id', attemptId)
      .select()
      .single()

    if (error) throw error

    return { data: attempt, error: null }
  } catch (error) {
    console.error('Erro ao atualizar tentativa de quiz:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Erro desconhecido'),
    }
  }
}

/**
 * Finaliza uma tentativa de quiz
 */
export async function finishQuizAttempt(
  attemptId: string,
  score: number,
  timeSpent: number,
): Promise<{ data: QuizAttempt | null; error: Error | null }> {
  return updateQuizAttempt(attemptId, {
    finished_at: new Date().toISOString(),
    time_spent: timeSpent,
    score,
    status: 'completed',
  })
}

/**
 * Salva uma resposta do usuário
 */
export async function saveQuizAnswer(
  data: QuizAnswerInsert,
): Promise<{ data: QuizAnswer | null; error: Error | null }> {
  try {
    const supabase = createClient()

    const { data: answer, error } = await supabase
      .from('quiz_answers')
      .insert(data)
      .select()
      .single()

    if (error) throw error

    return { data: answer, error: null }
  } catch (error) {
    console.error('Erro ao salvar resposta:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Erro desconhecido'),
    }
  }
}

/**
 * Busca todas as tentativas de um usuário para um quiz específico
 */
export async function getUserQuizAttempts(
  quizId: string,
): Promise<{ data: QuizAttempt[] | null; error: Error | null }> {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data: attempts, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', user.id)
      .eq('quiz_id', quizId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { data: attempts, error: null }
  } catch (error) {
    console.error('Erro ao buscar tentativas:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Erro desconhecido'),
    }
  }
}

/**
 * Busca a melhor tentativa do usuário em um quiz
 */
export async function getBestQuizAttempt(
  quizId: string,
): Promise<{ data: QuizAttempt | null; error: Error | null }> {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data: attempts, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', user.id)
      .eq('quiz_id', quizId)
      .eq('status', 'completed')
      .order('score', { ascending: false })
      .order('finished_at', { ascending: false })
      .limit(1)

    if (error) throw error

    const bestAttempt = attempts && attempts.length > 0 ? attempts[0] : null

    return { data: bestAttempt, error: null }
  } catch (error) {
    console.error('Erro ao buscar melhor tentativa:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Erro desconhecido'),
    }
  }
}

/**
 * Busca as respostas de uma tentativa específica
 */
export async function getQuizAttemptAnswers(
  attemptId: string,
): Promise<{ data: QuizAnswer[] | null; error: Error | null }> {
  try {
    const supabase = createClient()

    const { data: answers, error } = await supabase
      .from('quiz_answers')
      .select('*')
      .eq('attempt_id', attemptId)
      .order('answered_at', { ascending: true })

    if (error) throw error

    return { data: answers, error: null }
  } catch (error) {
    console.error('Erro ao buscar respostas:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Erro desconhecido'),
    }
  }
}

/**
 * Busca o progresso geral do usuário
 */
export async function getUserProgress(): Promise<{
  data: UserProgress | null
  error: Error | null
}> {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      // Se não houver dados, retornar progresso vazio ao invés de erro
      if (error.code === 'PGRST116') {
        return {
          data: {
            user_id: user.id,
            lessons_completed: 0,
            quizzes_completed: 0,
            average_score_percentage: 0,
            total_correct_answers: 0,
            total_questions_answered: 0,
            last_activity: new Date().toISOString(),
          },
          error: null,
        }
      }
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('Erro ao buscar progresso do usuário:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Erro desconhecido'),
    }
  }
}

/**
 * Busca estatísticas de um quiz específico
 */
export async function getQuizStatistics(
  quizId: string,
): Promise<{ data: QuizStatistics | null; error: Error | null }> {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('quiz_statistics')
      .select('*')
      .eq('user_id', user.id)
      .eq('quiz_id', quizId)
      .single()

    if (error) {
      // Se não houver dados, retornar null sem erro
      if (error.code === 'PGRST116') {
        return { data: null, error: null }
      }
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('Erro ao buscar estatísticas do quiz:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Erro desconhecido'),
    }
  }
}

/**
 * Busca todas as lições completadas pelo usuário
 */
export async function getCompletedLessons(): Promise<{
  data: CompletedLesson[] | null
  error: Error | null
}> {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('completed_lessons')
      .select('*')
      .eq('user_id', user.id)
      .order('completion_date', { ascending: false })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Erro ao buscar lições completadas:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Erro desconhecido'),
    }
  }
}

/**
 * Busca detalhes de todas as tentativas do usuário
 */
export async function getUserQuizAttemptDetails(): Promise<{
  data: QuizAttemptDetail[] | null
  error: Error | null
}> {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('quiz_attempt_details')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Erro ao buscar detalhes das tentativas:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Erro desconhecido'),
    }
  }
}

/**
 * Verifica se uma lição foi completada (nota >= 70%)
 */
export async function isLessonCompleted(
  lessonId: string,
): Promise<{ data: boolean; error: Error | null }> {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('completed_lessons')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single()

    if (error) {
      // Se não encontrou, a lição não está completada
      if (error.code === 'PGRST116') {
        return { data: false, error: null }
      }
      throw error
    }

    return { data: !!data, error: null }
  } catch (error) {
    console.error('Erro ao verificar lição completada:', error)
    return {
      data: false,
      error: error instanceof Error ? error : new Error('Erro desconhecido'),
    }
  }
}
