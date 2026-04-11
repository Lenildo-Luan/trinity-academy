/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Quiz } from '@/data/quizzes'
import { flushMicrotasks, renderHook } from '@/test/hook-test-utils'

import { useQuizPersistence } from './use-quiz-persistence'

const {
  createQuizAttemptMock,
  saveQuizAnswerMock,
  finishQuizAttemptMock,
  getBestQuizAttemptMock,
} = vi.hoisted(() => ({
  createQuizAttemptMock: vi.fn(),
  saveQuizAnswerMock: vi.fn(),
  finishQuizAttemptMock: vi.fn(),
  getBestQuizAttemptMock: vi.fn(),
}))

vi.mock('@/lib/quiz-service', () => ({
  createQuizAttempt: createQuizAttemptMock,
  saveQuizAnswer: saveQuizAnswerMock,
  finishQuizAttempt: finishQuizAttemptMock,
  getBestQuizAttempt: getBestQuizAttemptMock,
}))

const quizFixture: Quiz = {
  id: 'quiz-1',
  title: 'Quiz',
  description: 'Desc',
  timeLimit: 90,
  questions: [
    {
      id: 'q1',
      question: 'Pergunta 1',
      alternatives: [
        { id: 'a', text: 'A', isCorrect: true },
        { id: 'b', text: 'B', isCorrect: false },
      ],
    },
  ],
}

type PersistenceProps = Parameters<typeof useQuizPersistence>[0]

function buildProps(overrides: Partial<PersistenceProps> = {}): PersistenceProps {
  return {
    quiz: quizFixture,
    lessonId: 'lesson-1',
    courseId: 'course-1',
    state: 'inactive',
    userAnswers: [],
    result: null,
    ...overrides,
  }
}

describe('useQuizPersistence', () => {
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

  beforeEach(() => {
    createQuizAttemptMock.mockReset()
    saveQuizAnswerMock.mockReset()
    finishQuizAttemptMock.mockReset()
    getBestQuizAttemptMock.mockReset()
    consoleErrorSpy.mockClear()
    consoleLogSpy.mockClear()
  })

  it('creates attempts, persists answers once, and finishes attempts', async () => {
    createQuizAttemptMock.mockResolvedValueOnce({
      data: { id: 'attempt-1' },
      error: null,
    })
    saveQuizAnswerMock.mockResolvedValue({ data: { question_id: 'q1' }, error: null })
    finishQuizAttemptMock.mockResolvedValue({ data: { id: 'attempt-1' }, error: null })

    const { result, rerender } = renderHook(
      (props: PersistenceProps) => useQuizPersistence(props),
      { initialProps: buildProps({ state: 'active' }) },
    )

    await flushMicrotasks()
    rerender(buildProps({ state: 'active' }))
    expect(createQuizAttemptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        quiz_id: 'quiz-1',
        lesson_id: 'lesson-1',
        course_id: 'course-1',
        total_questions: 1,
        status: 'in_progress',
      }),
    )
    expect(result.current.attemptId).toBe('attempt-1')

    rerender(
      buildProps({
        state: 'active',
        userAnswers: [
          { questionId: 'q1', selectedAlternativeId: 'a' },
          { questionId: 'missing-question', selectedAlternativeId: 'a' },
          { questionId: 'q1', selectedAlternativeId: 'missing-alternative' },
        ],
      }),
    )
    await flushMicrotasks()

    expect(saveQuizAnswerMock).toHaveBeenCalledTimes(1)
    expect(saveQuizAnswerMock).toHaveBeenCalledWith({
      attempt_id: 'attempt-1',
      question_id: 'q1',
      selected_alternative_id: 'a',
      is_correct: true,
    })

    rerender(
      buildProps({
        state: 'active',
        userAnswers: [{ questionId: 'q1', selectedAlternativeId: 'a' }],
      }),
    )
    await flushMicrotasks()
    expect(saveQuizAnswerMock).toHaveBeenCalledTimes(1)

    rerender(
      buildProps({
        state: 'finished',
        result: {
          totalQuestions: 1,
          correctAnswers: 1,
          score: 100,
          userAnswers: [{ questionId: 'q1', selectedAlternativeId: 'a' }],
          timeSpent: 15,
        },
      }),
    )
    await flushMicrotasks()

    expect(finishQuizAttemptMock).toHaveBeenCalledWith('attempt-1', 1, 15)
    expect(consoleLogSpy).toHaveBeenCalled()
  })

  it('handles service errors, promise rejections and reset cleanup', async () => {
    createQuizAttemptMock
      .mockResolvedValueOnce({ data: null, error: new Error('create error') })
      .mockRejectedValueOnce(new Error('create throw'))
      .mockResolvedValueOnce({ data: { id: 'attempt-2' }, error: null })
    saveQuizAnswerMock
      .mockResolvedValueOnce({ data: null, error: new Error('save error') })
      .mockRejectedValueOnce(new Error('save throw'))
    finishQuizAttemptMock
      .mockResolvedValueOnce({ data: null, error: new Error('finish error') })
      .mockRejectedValueOnce(new Error('finish throw'))

    const { rerender } = renderHook((props: PersistenceProps) => useQuizPersistence(props), {
      initialProps: buildProps({ state: 'active' }),
    })

    await flushMicrotasks()
    rerender(buildProps({ state: 'inactive' }))
    rerender(buildProps({ state: 'active' }))
    await flushMicrotasks()
    rerender(buildProps({ state: 'inactive' }))
    rerender(buildProps({ state: 'active' }))
    await flushMicrotasks()
    rerender(buildProps({ state: 'active' }))
    await flushMicrotasks()

    rerender(
      buildProps({
        state: 'active',
        userAnswers: [{ questionId: 'q1', selectedAlternativeId: 'a' }],
      }),
    )
    await flushMicrotasks()
    rerender(
      buildProps({
        state: 'active',
        userAnswers: [{ questionId: 'q1', selectedAlternativeId: 'a' }],
      }),
    )
    await flushMicrotasks()
    rerender(
      buildProps({
        state: 'finished',
        result: {
          totalQuestions: 1,
          correctAnswers: 1,
          score: 100,
          userAnswers: [{ questionId: 'q1', selectedAlternativeId: 'a' }],
          timeSpent: 30,
        },
      }),
    )
    await flushMicrotasks()

    rerender(
      buildProps({
        state: 'finished',
        result: {
          totalQuestions: 1,
          correctAnswers: 1,
          score: 100,
          userAnswers: [{ questionId: 'q1', selectedAlternativeId: 'a' }],
          timeSpent: 20,
        },
      }),
    )
    await flushMicrotasks()

    expect(createQuizAttemptMock).toHaveBeenCalledTimes(3)
    expect(saveQuizAnswerMock).toHaveBeenCalledTimes(2)
    expect(finishQuizAttemptMock).toHaveBeenCalledTimes(2)
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('loads best attempt and handles empty quiz', async () => {
    getBestQuizAttemptMock
      .mockResolvedValueOnce({ data: null, error: new Error('best attempt error') })
      .mockResolvedValueOnce({ data: { id: 'attempt-best' }, error: null })

    const { result, rerender } = renderHook(
      (props: PersistenceProps) => useQuizPersistence(props),
      { initialProps: buildProps({ quiz: null }) },
    )

    await expect(result.current.loadBestAttempt()).resolves.toBeNull()

    rerender(buildProps())
    await expect(result.current.loadBestAttempt()).resolves.toBeNull()
    await expect(result.current.loadBestAttempt()).resolves.toEqual({ id: 'attempt-best' })
    expect(getBestQuizAttemptMock).toHaveBeenCalledWith('quiz-1', 'course-1')
  })

  it('does not persist when preconditions are not met', async () => {
    createQuizAttemptMock.mockResolvedValue({ data: null, error: null })

    renderHook((props: PersistenceProps) => useQuizPersistence(props), {
      initialProps: buildProps({
        state: 'active',
        quiz: null,
        userAnswers: [{ questionId: 'q1', selectedAlternativeId: 'a' }],
      }),
    })
    await flushMicrotasks()

    expect(createQuizAttemptMock).not.toHaveBeenCalled()
    expect(saveQuizAnswerMock).not.toHaveBeenCalled()
    expect(finishQuizAttemptMock).not.toHaveBeenCalled()
  })
})
