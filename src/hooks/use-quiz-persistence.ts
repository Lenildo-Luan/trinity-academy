'use client'

/**
 * Hook para persistir estado do quiz no Supabase
 * Sincroniza automaticamente tentativas e respostas com o banco de dados
 */

import { useEffect, useRef, useCallback } from 'react'
import type { Quiz } from '@/data/quizzes'
import type { QuizState, UserAnswer, QuizResult } from './use-quiz-state'
import {
  createQuizAttempt,
  saveQuizAnswer,
  finishQuizAttempt,
  getBestQuizAttempt,
} from '@/lib/quiz-service'

type UseQuizPersistenceProps = {
  quiz: Quiz | null
  lessonId: string
  courseId: string
  state: QuizState
  userAnswers: UserAnswer[]
  result: QuizResult | null
}

export function useQuizPersistence({
  quiz,
  lessonId,
  courseId,
  state,
  userAnswers,
  result,
}: UseQuizPersistenceProps) {
  const attemptIdRef = useRef<string | null>(null)
  const savedAnswersRef = useRef<Set<string>>(new Set())
  const startTimeRef = useRef<Date | null>(null)

  /**
   * Quando o quiz inicia, cria uma nova tentativa no banco
   */
  useEffect(() => {
    if (state === 'active' && quiz && !attemptIdRef.current) {
      startTimeRef.current = new Date()

      // Criar tentativa no banco
      createQuizAttempt({
        quiz_id: quiz.id,
        lesson_id: lessonId,
        course_id: courseId,
        total_questions: quiz.questions.length,
        status: 'in_progress',
        user_id: '', // Será preenchido pela função
      })
        .then(({ data, error }) => {
          if (error) {
            console.error('Erro ao criar tentativa:', error)
            return
          }

          if (data) {
            attemptIdRef.current = data.id
            console.log('Tentativa criada:', data.id)
          }
        })
        .catch((err) => {
          console.error('Erro ao criar tentativa:', err)
        })
    }

    // Reset quando o quiz volta ao estado inactive
    if (state === 'inactive') {
      attemptIdRef.current = null
      savedAnswersRef.current.clear()
      startTimeRef.current = null
    }
  }, [state, quiz, lessonId, courseId])

  /**
   * Quando o usuário responde uma questão, salva no banco
   */
  useEffect(() => {
    if (!attemptIdRef.current || !quiz || state !== 'active') return

    // Processar apenas respostas que ainda não foram salvas
    const newAnswers = userAnswers.filter(
      (answer) => !savedAnswersRef.current.has(answer.questionId),
    )

    if (newAnswers.length === 0) return

    // Salvar cada nova resposta
    newAnswers.forEach((answer) => {
      // Encontrar a questão para verificar se está correta
      const question = quiz.questions.find((q) => q.id === answer.questionId)
      if (!question) return

      const alternative = question.alternatives.find(
        (alt) => alt.id === answer.selectedAlternativeId,
      )
      if (!alternative) return

      saveQuizAnswer({
        attempt_id: attemptIdRef.current!,
        question_id: answer.questionId,
        selected_alternative_id: answer.selectedAlternativeId,
        is_correct: alternative.isCorrect,
      })
        .then(({ data, error }) => {
          if (error) {
            console.error('Erro ao salvar resposta:', error)
            return
          }

          if (data) {
            savedAnswersRef.current.add(answer.questionId)
            console.log('Resposta salva:', data.question_id)
          }
        })
        .catch((err) => {
          console.error('Erro ao salvar resposta:', err)
        })
    })
  }, [userAnswers, quiz, state])

  /**
   * Quando o quiz finaliza, atualiza a tentativa no banco
   */
  useEffect(() => {
    if (state === 'finished' && attemptIdRef.current && result) {
      finishQuizAttempt(
        attemptIdRef.current,
        result.correctAnswers,
        result.timeSpent,
      )
        .then(({ data, error }) => {
          if (error) {
            console.error('Erro ao finalizar tentativa:', error)
            return
          }

          if (data) {
            console.log('Tentativa finalizada:', data.id)
            console.log('Pontuação:', `${data.score}/${data.total_questions}`)
            console.log('Tempo gasto:', `${data.time_spent}s`)
          }
        })
        .catch((err) => {
          console.error('Erro ao finalizar tentativa:', err)
        })
    }
  }, [state, result])

  /**
   * Busca a melhor tentativa anterior do usuário
   */
  const loadBestAttempt = useCallback(async () => {
    if (!quiz) return null

    const { data, error } = await getBestQuizAttempt(quiz.id, courseId)

    if (error) {
      console.error('Erro ao buscar melhor tentativa:', error)
      return null
    }

    return data
  }, [quiz, courseId])

  return {
    attemptId: attemptIdRef.current,
    loadBestAttempt,
  }
}
