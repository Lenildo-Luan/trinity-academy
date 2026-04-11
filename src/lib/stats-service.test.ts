import {
  formatStudyTime,
  getProgressColor,
  getScoreColor,
  getUserStatistics,
} from "@/lib/stats-service";
import { mockSupabaseClient, setSupabaseMockState } from "@/test";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUser = {
  id: "user-1",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: "2024-01-01T00:00:00Z",
} as const;

describe("stats-service", () => {
  beforeEach(() => {
    setSupabaseMockState({
      user: mockUser as never,
      rpcResult: { data: null, error: null },
    });
    vi.mocked(mockSupabaseClient.auth.getUser).mockReset();
    vi.mocked(mockSupabaseClient.auth.getUser).mockImplementation(async () => ({
      data: { user: mockUser as never },
      error: null,
    }));
    vi.mocked(mockSupabaseClient.rpc).mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("returns stats from rpc result array", async () => {
    const stats = {
      total_lessons: 14,
      completed_lessons: 4,
      completion_percentage: 28.5,
      average_score: 7.8,
      total_study_time_seconds: 3600,
      current_streak: 2,
    };
    vi.mocked(mockSupabaseClient.rpc).mockResolvedValueOnce({
      data: [stats],
      error: null,
    });

    const result = await getUserStatistics();

    expect(result).toEqual({ data: stats, error: null });
    expect(mockSupabaseClient.rpc).toHaveBeenCalledWith("get_user_statistics", {
      p_user_id: "user-1",
    });
  });

  it("returns default stats when rpc returns no entries", async () => {
    vi.mocked(mockSupabaseClient.rpc).mockResolvedValueOnce({
      data: [],
      error: null,
    });

    const result = await getUserStatistics();

    expect(result).toEqual({
      data: {
        total_lessons: 14,
        completed_lessons: 0,
        completion_percentage: 0,
        average_score: 0,
        total_study_time_seconds: 0,
        current_streak: 0,
      },
      error: null,
    });
  });

  it("returns auth error when auth call fails", async () => {
    vi.mocked(mockSupabaseClient.auth.getUser).mockResolvedValueOnce({
      data: { user: null },
      error: { message: "token invalid" },
    } as never);

    const result = await getUserStatistics();

    expect(result.data).toBeNull();
    expect(result.error?.message).toContain("Erro de autenticação: token invalid");
  });

  it("returns unauthenticated error when user is missing", async () => {
    vi.mocked(mockSupabaseClient.auth.getUser).mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });

    const result = await getUserStatistics();

    expect(result.data).toBeNull();
    expect(result.error?.message).toBe("Usuário não autenticado");
  });

  it("returns rpc branch error with contextual message", async () => {
    vi.mocked(mockSupabaseClient.rpc).mockResolvedValueOnce({
      data: null,
      error: { message: "function missing" },
    });

    const result = await getUserStatistics();

    expect(result.data).toBeNull();
    expect(result.error?.message).toContain("Erro ao buscar estatísticas: function missing");
    expect(result.error?.message).toContain("Verifique se as funções SQL foram criadas");
  });

  it("handles non-error throws in catch block", async () => {
    vi.mocked(mockSupabaseClient.rpc).mockRejectedValueOnce("boom");

    const result = await getUserStatistics();

    expect(result.data).toBeNull();
    expect(result.error?.message).toBe('"boom"');
  });

  it("uses fallback unknown message when thrown value is undefined", async () => {
    vi.mocked(mockSupabaseClient.rpc).mockRejectedValueOnce(undefined);

    const result = await getUserStatistics();

    expect(result.data).toBeNull();
    expect(result.error?.message).toBe("Erro desconhecido ao buscar estatísticas");
  });

  it("formats study time across all branches", () => {
    expect(formatStudyTime(0)).toBe("0min");
    expect(formatStudyTime(59)).toBe("0min");
    expect(formatStudyTime(1800)).toBe("30min");
    expect(formatStudyTime(3600)).toBe("1h");
    expect(formatStudyTime(7260)).toBe("2h 1min");
  });

  it("maps progress and score colors with thresholds", () => {
    expect(getProgressColor(70)).toBe("green");
    expect(getProgressColor(40)).toBe("yellow");
    expect(getProgressColor(39.9)).toBe("gray");

    expect(getScoreColor(7)).toBe("green");
    expect(getScoreColor(5)).toBe("yellow");
    expect(getScoreColor(4.9)).toBe("red");
  });
});
