import { createClient } from "@/lib/supabase/client";
import {
  createQuizAttempt,
  finishQuizAttempt,
  getBestQuizAttempt,
  getCompletedLessons,
  getQuizAttemptAnswers,
  getQuizStatistics,
  getUserProgress,
  getUserQuizAttemptDetails,
  getUserQuizAttempts,
  isLessonCompleted,
  saveQuizAnswer,
  updateQuizAttempt,
} from "@/lib/quiz-service";
import { mockSupabaseClient, setSupabaseMockState } from "@/test";
import { beforeEach, describe, expect, it, vi } from "vitest";

type QueryResponse<T> = {
  data: T | null;
  error: unknown | null;
};

function createQueryBuilder<T>(response: QueryResponse<T>) {
  const builder = {
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    single: vi.fn(async () => response),
    then: (onfulfilled?: (value: QueryResponse<T>) => unknown) =>
      Promise.resolve(response).then(onfulfilled),
  };

  return builder;
}

const mockUser = {
  id: "user-1",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: "2024-01-01T00:00:00Z",
} as const;

describe("quiz-service", () => {
  beforeEach(() => {
    setSupabaseMockState({ user: mockUser as never });
    vi.mocked(mockSupabaseClient.from).mockReset();
    vi.mocked(mockSupabaseClient.rpc).mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("creates a quiz attempt for authenticated user", async () => {
    const attempt = { id: "attempt-1" };
    const builder = createQueryBuilder({ data: attempt, error: null });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);

    const result = await createQuizAttempt({
      quiz_id: "quiz-1",
      course_id: "course-1",
      status: "in_progress",
    } as never);

    expect(result).toEqual({ data: attempt, error: null });
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("quiz_attempts");
    expect(builder.insert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: "user-1", quiz_id: "quiz-1" }),
    );
  });

  it("returns error when creating attempt without user", async () => {
    setSupabaseMockState({ user: null });

    const result = await createQuizAttempt({} as never);

    expect(result.data).toBeNull();
    expect(result.error?.message).toBe("Usuário não autenticado");
  });

  it("returns unknown error when create attempt throws non-error", async () => {
    vi.mocked(mockSupabaseClient.from).mockImplementationOnce(() => {
      throw "boom";
    });

    const result = await createQuizAttempt({} as never);

    expect(result.data).toBeNull();
    expect(result.error?.message).toBe("Erro desconhecido");
  });

  it("returns insert error when create attempt query fails", async () => {
    const builder = createQueryBuilder({
      data: null,
      error: new Error("insert failed"),
    });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);

    const result = await createQuizAttempt({} as never);

    expect(result.error?.message).toBe("insert failed");
  });

  it("updates an attempt successfully", async () => {
    const attempt = { id: "attempt-1", score: 8 };
    const builder = createQueryBuilder({ data: attempt, error: null });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);

    const result = await updateQuizAttempt("attempt-1", { score: 8 } as never);

    expect(result).toEqual({ data: attempt, error: null });
    expect(builder.eq).toHaveBeenCalledWith("id", "attempt-1");
  });

  it("returns unknown error when update throws non-error", async () => {
    vi.mocked(mockSupabaseClient.from).mockImplementationOnce(() => {
      throw "boom";
    });

    const result = await updateQuizAttempt("attempt-1", {} as never);

    expect(result.data).toBeNull();
    expect(result.error?.message).toBe("Erro desconhecido");
  });

  it("returns query error when update fails", async () => {
    const builder = createQueryBuilder({
      data: null,
      error: new Error("update failed"),
    });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);

    const result = await updateQuizAttempt("attempt-1", {} as never);

    expect(result.error?.message).toBe("update failed");
  });

  it("finishes an attempt with deterministic timestamp", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-02-02T10:00:00.000Z"));

    const attempt = { id: "attempt-1", status: "completed" };
    const builder = createQueryBuilder({ data: attempt, error: null });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);

    await finishQuizAttempt("attempt-1", 9, 120);

    expect(builder.update).toHaveBeenCalledWith({
      finished_at: "2024-02-02T10:00:00.000Z",
      time_spent: 120,
      score: 9,
      status: "completed",
    });

    vi.useRealTimers();
  });

  it("saves quiz answer and handles errors", async () => {
    const answer = { id: "a1" };
    let builder = createQueryBuilder({ data: answer, error: null });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    expect(await saveQuizAnswer({} as never)).toEqual({ data: answer, error: null });

    builder = createQueryBuilder({
      data: null,
      error: new Error("insert failed"),
    });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const failure = await saveQuizAnswer({} as never);
    expect(failure.data).toBeNull();
    expect(failure.error?.message).toBe("insert failed");
  });

  it("gets user quiz attempts with filters and auth checks", async () => {
    const attempts = [{ id: "attempt-1" }];
    let builder = createQueryBuilder({ data: attempts, error: null });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const success = await getUserQuizAttempts("quiz-1", "course-1");
    expect(success).toEqual({ data: attempts, error: null });
    expect(builder.eq).toHaveBeenNthCalledWith(1, "user_id", "user-1");
    expect(builder.eq).toHaveBeenNthCalledWith(2, "quiz_id", "quiz-1");
    expect(builder.eq).toHaveBeenNthCalledWith(3, "course_id", "course-1");

    setSupabaseMockState({ user: null });
    const authFailure = await getUserQuizAttempts("quiz-1", "course-1");
    expect(authFailure.error?.message).toBe("Usuário não autenticado");

    setSupabaseMockState({ user: mockUser as never });
    builder = createQueryBuilder({ data: null, error: new Error("query failed") });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const queryFailure = await getUserQuizAttempts("quiz-1", "course-1");
    expect(queryFailure.error?.message).toBe("query failed");
  });

  it("gets best attempt or null when no attempts", async () => {
    let builder = createQueryBuilder({
      data: [{ id: "attempt-2", score: 10 }],
      error: null,
    });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const best = await getBestQuizAttempt("quiz-1", "course-1");
    expect(best.data?.id).toBe("attempt-2");
    expect(builder.limit).toHaveBeenCalledWith(1);

    builder = createQueryBuilder({ data: [], error: null });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const none = await getBestQuizAttempt("quiz-1", "course-1");
    expect(none).toEqual({ data: null, error: null });

    builder = createQueryBuilder({ data: null, error: new Error("best failed") });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const failure = await getBestQuizAttempt("quiz-1", "course-1");
    expect(failure.error?.message).toBe("best failed");
  });

  it("gets attempt answers and handles query error", async () => {
    let builder = createQueryBuilder({
      data: [{ id: "answer-1" }],
      error: null,
    });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const success = await getQuizAttemptAnswers("attempt-1");
    expect(success.data).toEqual([{ id: "answer-1" }]);

    builder = createQueryBuilder({ data: null, error: new Error("failed") });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const failure = await getQuizAttemptAnswers("attempt-1");
    expect(failure.error?.message).toBe("failed");
  });

  it("returns progress defaults for not found and error for unexpected failure", async () => {
    let builder = createQueryBuilder({
      data: null,
      error: Object.assign(new Error("not found"), { code: "PGRST116" }),
    });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const defaults = await getUserProgress();
    expect(defaults.data).toEqual(
      expect.objectContaining({ user_id: "user-1", lessons_completed: 0 }),
    );

    builder = createQueryBuilder({ data: null, error: new Error("db failed") });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const failure = await getUserProgress();
    expect(failure.error?.message).toBe("db failed");
  });

  it("returns persisted user progress data when available", async () => {
    const progress = {
      user_id: "user-1",
      lessons_completed: 3,
      quizzes_completed: 2,
      average_score_percentage: 80,
      total_correct_answers: 8,
      total_questions_answered: 10,
      last_activity: "2024-01-01T00:00:00Z",
    };
    const builder = createQueryBuilder({ data: progress, error: null });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);

    const result = await getUserProgress();

    expect(result).toEqual({ data: progress, error: null });
  });

  it("gets quiz statistics and handles not-found branch", async () => {
    let builder = createQueryBuilder({
      data: { quiz_id: "quiz-1", user_id: "user-1" },
      error: null,
    });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const success = await getQuizStatistics("quiz-1");
    expect(success.error).toBeNull();

    builder = createQueryBuilder({
      data: null,
      error: Object.assign(new Error("none"), { code: "PGRST116" }),
    });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const notFound = await getQuizStatistics("quiz-1");
    expect(notFound).toEqual({ data: null, error: null });

    builder = createQueryBuilder({ data: null, error: new Error("stats failed") });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const failure = await getQuizStatistics("quiz-1");
    expect(failure.error?.message).toBe("stats failed");
  });

  it("gets completed lessons and attempt details", async () => {
    let builder = createQueryBuilder({ data: [{ lesson_id: "l1" }], error: null });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const completed = await getCompletedLessons();
    expect(completed.data).toEqual([{ lesson_id: "l1" }]);

    builder = createQueryBuilder({ data: [{ id: "details-1" }], error: null });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const details = await getUserQuizAttemptDetails();
    expect(details.data).toEqual([{ id: "details-1" }]);

    builder = createQueryBuilder({ data: null, error: new Error("lessons failed") });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const lessonsFailure = await getCompletedLessons();
    expect(lessonsFailure.error?.message).toBe("lessons failed");

    builder = createQueryBuilder({ data: null, error: new Error("details failed") });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const detailsFailure = await getUserQuizAttemptDetails();
    expect(detailsFailure.error?.message).toBe("details failed");
  });

  it("checks lesson completion branches", async () => {
    let builder = createQueryBuilder({ data: { lesson_id: "lesson-1" }, error: null });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const completed = await isLessonCompleted("lesson-1");
    expect(completed).toEqual({ data: true, error: null });

    builder = createQueryBuilder({
      data: null,
      error: { message: "none", code: "PGRST116" },
    });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const notCompleted = await isLessonCompleted("lesson-1");
    expect(notCompleted).toEqual({ data: false, error: null });

    builder = createQueryBuilder({ data: null, error: new Error("db down") });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);
    const failure = await isLessonCompleted("lesson-1");
    expect(failure.data).toBe(false);
    expect(failure.error?.message).toBe("db down");
  });

  it("handles unauthenticated branches in auth-protected methods", async () => {
    setSupabaseMockState({ user: null });

    const [best, progress, stats, lessons, details, completed] = await Promise.all([
      getBestQuizAttempt("quiz-1", "course-1"),
      getUserProgress(),
      getQuizStatistics("quiz-1"),
      getCompletedLessons(),
      getUserQuizAttemptDetails(),
      isLessonCompleted("lesson-1"),
    ]);

    expect(best.error?.message).toBe("Usuário não autenticado");
    expect(progress.error?.message).toBe("Usuário não autenticado");
    expect(stats.error?.message).toBe("Usuário não autenticado");
    expect(lessons.error?.message).toBe("Usuário não autenticado");
    expect(details.error?.message).toBe("Usuário não autenticado");
    expect(completed).toEqual({
      data: false,
      error: expect.objectContaining({ message: "Usuário não autenticado" }),
    });
  });

  it("propagates non-error throw in read methods as unknown error", async () => {
    vi.mocked(mockSupabaseClient.auth.getUser).mockRejectedValueOnce("boom");

    const result = await getQuizStatistics("quiz-1");

    expect(result.data).toBeNull();
    expect(result.error?.message).toBe("Erro desconhecido");
  });

  it("returns unknown error for non-error query throws in remaining methods", async () => {
    const runs = [
      async () => saveQuizAnswer({} as never),
      async () => getUserQuizAttempts("quiz-1", "course-1"),
      async () => getBestQuizAttempt("quiz-1", "course-1"),
      async () => getQuizAttemptAnswers("attempt-1"),
      async () => getUserProgress(),
      async () => getCompletedLessons(),
      async () => getUserQuizAttemptDetails(),
      async () => isLessonCompleted("lesson-1"),
    ];

    for (const run of runs) {
      vi.mocked(mockSupabaseClient.from).mockImplementationOnce(() => {
        throw "boom";
      });

      const result = await run();
      const errorMessage = result.error?.message;
      expect(errorMessage).toBe("Erro desconhecido");
    }
  });

  it("uses the mocked createClient", async () => {
    const builder = createQueryBuilder({ data: [], error: null });
    vi.mocked(mockSupabaseClient.from).mockReturnValue(builder as never);

    await getCompletedLessons();

    expect(vi.mocked(createClient)).toHaveBeenCalled();
  });
});
