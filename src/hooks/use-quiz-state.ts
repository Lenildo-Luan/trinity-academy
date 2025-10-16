'use client'

import { useState, useCallback } from 'react'
import type { Quiz, Question } from '@/data/quizzes'

export type QuizState = 'inactive' | 'active' | 'finished'

export type UserAnswer = {
  questionId: string
  selectedAlternativeId: string
}

export type QuizResult = {
  totalQuestions: number
  correctAnswers: number
  score: number // porcentagem
  userAnswers: UserAnswer[]
  timeSpent: number // em segundos
}

export function useQuizState(quiz: Quiz | null) {
  const [state, setState] = useState<QuizState>('inactive')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [result, setResult] = useState<QuizResult | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(quiz?.timeLimit || 900)

  const startQuiz = useCallback(() => {
    if (!quiz) return
    setState('active')
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setResult(null)
    setTimeRemaining(quiz.timeLimit)
  }, [quiz])

  const selectAnswer = useCallback((questionId: string, alternativeId: string) => {
    setUserAnswers((prev) => {
      // Remove resposta anterior para esta questão (se existir)
      const filtered = prev.filter((a) => a.questionId !== questionId)
      // Adiciona nova resposta
      return [...filtered, { questionId, selectedAlternativeId: alternativeId }]
    })
  }, [])

  const getCurrentAnswer = useCallback(
    (questionId: string): string | null => {
      const answer = userAnswers.find((a) => a.questionId === questionId)
      return answer?.selectedAlternativeId || null
    },
    [userAnswers],
  )

  const nextQuestion = useCallback(() => {
    if (!quiz) return
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }, [quiz, currentQuestionIndex])

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }, [currentQuestionIndex])

  const calculateResult = useCallback(
    (timeSpent: number): QuizResult => {
      if (!quiz) {
        return {
          totalQuestions: 0,
          correctAnswers: 0,
          score: 0,
          userAnswers: [],
          timeSpent: 0,
        }
      }

      let correctCount = 0

      quiz.questions.forEach((question) => {
        const userAnswer = userAnswers.find((a) => a.questionId === question.id)
        if (!userAnswer) return

        const selectedAlternative = question.alternatives.find(
          (alt) => alt.id === userAnswer.selectedAlternativeId,
        )

        if (selectedAlternative?.isCorrect) {
          correctCount++
        }
      })

      const score = (correctCount / quiz.questions.length) * 100

      return {
        totalQuestions: quiz.questions.length,
        correctAnswers: correctCount,
        score: Math.round(score),
        userAnswers,
        timeSpent,
      }
    },
    [quiz, userAnswers],
  )

  const finishQuiz = useCallback(() => {
    if (!quiz) return

    const timeSpent = quiz.timeLimit - timeRemaining
    const quizResult = calculateResult(timeSpent)

    setResult(quizResult)
    setState('finished')
  }, [quiz, timeRemaining, calculateResult])

  const resetQuiz = useCallback(() => {
    setState('inactive')
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setResult(null)
    setTimeRemaining(quiz?.timeLimit || 900)
  }, [quiz])

  const currentQuestion: Question | null = quiz?.questions[currentQuestionIndex] || null

  const answeredQuestionsCount = userAnswers.length

  const isCurrentQuestionAnswered = currentQuestion
    ? getCurrentAnswer(currentQuestion.id) !== null
    : false

  return {
    state,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: quiz?.questions.length || 0,
    userAnswers,
    result,
    timeRemaining,
    answeredQuestionsCount,
    isCurrentQuestionAnswered,
    startQuiz,
    selectAnswer,
    getCurrentAnswer,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    resetQuiz,
    setTimeRemaining,
  }
}
