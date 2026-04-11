/** @vitest-environment jsdom */

import { act } from 'react'
import { describe, expect, it } from 'vitest'

import type { Quiz } from '@/data/quizzes'
import { flushMicrotasks, renderHook } from '@/test/hook-test-utils'

import { useQuizState } from './use-quiz-state'

const quizFixture: Quiz = {
  id: 'quiz-1',
  title: 'Quiz',
  description: 'Desc',
  timeLimit: 120,
  questions: [
    {
      id: 'q1',
      question: 'Pergunta 1',
      alternatives: [
        { id: 'a', text: 'A', isCorrect: true },
        { id: 'b', text: 'B', isCorrect: false },
      ],
    },
    {
      id: 'q2',
      question: 'Pergunta 2',
      alternatives: [
        { id: 'c', text: 'C', isCorrect: false },
        { id: 'd', text: 'D', isCorrect: true },
      ],
    },
  ],
}

describe('useQuizState', () => {
  it('handles null quiz safely', async () => {
    const { result } = renderHook((props: { quiz: Quiz | null }) => useQuizState(props.quiz), {
      initialProps: { quiz: null },
    })

    expect(result.current.state).toBe('inactive')
    expect(result.current.currentQuestion).toBeNull()
    expect(result.current.totalQuestions).toBe(0)
    expect(result.current.timeRemaining).toBe(900)

    act(() => {
      result.current.startQuiz()
      result.current.nextQuestion()
      result.current.finishQuiz()
    })
    await flushMicrotasks()

    expect(result.current.state).toBe('inactive')
    expect(result.current.result).toBeNull()
  })

  it('runs full quiz lifecycle and navigation boundaries', () => {
    const { result } = renderHook((props: { quiz: Quiz | null }) => useQuizState(props.quiz), {
      initialProps: { quiz: quizFixture },
    })

    act(() => {
      result.current.startQuiz()
    })
    expect(result.current.state).toBe('active')
    expect(result.current.currentQuestionIndex).toBe(0)
    expect(result.current.currentQuestion?.id).toBe('q1')
    expect(result.current.timeRemaining).toBe(120)
    expect(result.current.answeredQuestionsCount).toBe(0)
    expect(result.current.isCurrentQuestionAnswered).toBe(false)

    act(() => {
      result.current.selectAnswer('q1', 'b')
      result.current.selectAnswer('q1', 'a')
    })
    expect(result.current.getCurrentAnswer('q1')).toBe('a')
    expect(result.current.answeredQuestionsCount).toBe(1)
    expect(result.current.isCurrentQuestionAnswered).toBe(true)

    act(() => {
      result.current.previousQuestion()
    })
    expect(result.current.currentQuestionIndex).toBe(0)

    act(() => {
      result.current.nextQuestion()
    })
    act(() => {
      result.current.nextQuestion()
    })
    expect(result.current.currentQuestionIndex).toBe(1)
    expect(result.current.currentQuestion?.id).toBe('q2')
    expect(result.current.getCurrentAnswer('missing')).toBeNull()

    act(() => {
      result.current.previousQuestion()
    })
    expect(result.current.currentQuestionIndex).toBe(0)
    act(() => {
      result.current.nextQuestion()
    })

    act(() => {
      result.current.selectAnswer('q2', 'c')
    })
    act(() => {
      result.current.setTimeRemaining(90)
    })
    act(() => {
      result.current.finishQuiz()
    })

    expect(result.current.state).toBe('finished')
    expect(result.current.result).toEqual({
      totalQuestions: 2,
      correctAnswers: 1,
      score: 50,
      userAnswers: [
        { questionId: 'q1', selectedAlternativeId: 'a' },
        { questionId: 'q2', selectedAlternativeId: 'c' },
      ],
      timeSpent: 30,
    })

    act(() => {
      result.current.resetQuiz()
    })
    expect(result.current.state).toBe('inactive')
    expect(result.current.currentQuestionIndex).toBe(0)
    expect(result.current.userAnswers).toEqual([])
    expect(result.current.result).toBeNull()
    expect(result.current.timeRemaining).toBe(120)
  })
})
