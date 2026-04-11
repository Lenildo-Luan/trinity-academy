import { beforeEach, vi } from "vitest";

import {
  createNextNavigationModuleMock,
  resetNextNavigationMocks,
} from "./mocks/next-navigation";
import { getSupabaseClientMock, resetSupabaseMocks } from "./mocks/supabase";

vi.mock("next/navigation", () => createNextNavigationModuleMock());
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => getSupabaseClientMock()),
}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => getSupabaseClientMock()),
}));

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  resetSupabaseMocks();
  resetNextNavigationMocks();
  vi.clearAllMocks();
});
