import { AuthContext, type AuthContextType } from "@/contexts/auth-context";
import type { ReactNode } from "react";
import { vi } from "vitest";

export function createAuthContextValue(
  overrides: Partial<AuthContextType> = {},
): AuthContextType {
  return {
    user: null,
    loading: false,
    signOut: vi.fn(async () => undefined),
    ...overrides,
  };
}

export function TestAuthProvider({
  children,
  value,
}: {
  children: ReactNode;
  value?: Partial<AuthContextType>;
}) {
  return (
    <AuthContext.Provider value={createAuthContextValue(value)}>
      {children}
    </AuthContext.Provider>
  );
}
