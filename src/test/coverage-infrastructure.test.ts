import { createClient } from "@/lib/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { describe, expect, it } from "vitest";

import { createAuthContextValue, setPathnameMock, setSupabaseMockState } from ".";

describe("coverage infrastructure", () => {
  it("provides deterministic next/navigation mocks", () => {
    setPathnameMock("/quiz");
    const router = useRouter();

    expect(usePathname()).toBe("/quiz");
    router.push("/next");
    expect(router.push).toHaveBeenCalledWith("/next");
  });

  it("provides deterministic supabase client mocks", async () => {
    setSupabaseMockState({
      user: {
        id: "user-id",
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: "2024-01-01T00:00:00Z",
      },
    });

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    expect(user?.id).toBe("user-id");
  });

  it("provides auth context defaults for tests", () => {
    const value = createAuthContextValue();

    expect(value.user).toBeNull();
    expect(value.loading).toBe(false);
  });
});
