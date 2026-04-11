import type { User } from "@supabase/supabase-js";
import { vi } from "vitest";

type SupabaseResponse<T = unknown> = {
  data: T | null;
  error: { message: string; code?: string } | null;
};

type SupabaseMockState = {
  user: User | null;
  sessionUser: User | null;
  queryResult: SupabaseResponse;
  rpcResult: SupabaseResponse;
  uploadResult: SupabaseResponse<{ path: string }>;
  removeResult: SupabaseResponse<unknown[]>;
  publicUrl: string;
};

const defaultSupabaseMockState: SupabaseMockState = {
  user: null,
  sessionUser: null,
  queryResult: { data: null, error: null },
  rpcResult: { data: null, error: null },
  uploadResult: { data: { path: "mock/path" }, error: null },
  removeResult: { data: [], error: null },
  publicUrl: "https://example.com/mock-public-url",
};

const state: SupabaseMockState = { ...defaultSupabaseMockState };
const authSubscription = { unsubscribe: vi.fn() };

function createQueryBuilder() {
  let builder: {
    insert: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    upsert: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    select: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    in: ReturnType<typeof vi.fn>;
    order: ReturnType<typeof vi.fn>;
    limit: ReturnType<typeof vi.fn>;
    single: ReturnType<typeof vi.fn>;
    maybeSingle: ReturnType<typeof vi.fn>;
    then: Promise<SupabaseResponse>["then"];
  };

  builder = {
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    upsert: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    in: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    single: vi.fn(async () => state.queryResult),
    maybeSingle: vi.fn(async () => state.queryResult),
    then: (onfulfilled, onrejected) =>
      Promise.resolve(state.queryResult).then(onfulfilled, onrejected),
  };

  return builder;
}

const storageBucketMock = {
  upload: vi.fn(async () => state.uploadResult),
  remove: vi.fn(async () => state.removeResult),
  getPublicUrl: vi.fn(() => ({ data: { publicUrl: state.publicUrl } })),
};

export const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(async () => ({ data: { user: state.user }, error: null })),
    getSession: vi.fn(async () => ({
      data: { session: state.sessionUser ? { user: state.sessionUser } : null },
      error: null,
    })),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: authSubscription },
    })),
    signInWithOtp: vi.fn(async () => ({ data: null, error: null })),
    verifyOtp: vi.fn(async () => ({ data: null, error: null })),
    signOut: vi.fn(async () => ({ error: null })),
  },
  from: vi.fn(() => createQueryBuilder()),
  rpc: vi.fn(async () => state.rpcResult),
  storage: {
    from: vi.fn(() => storageBucketMock),
  },
};

export function getSupabaseClientMock() {
  return mockSupabaseClient;
}

export function setSupabaseMockState(overrides: Partial<SupabaseMockState>) {
  Object.assign(state, overrides);
}

export function resetSupabaseMocks() {
  Object.assign(state, defaultSupabaseMockState);
  authSubscription.unsubscribe.mockClear();
}
