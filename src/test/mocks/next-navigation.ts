import { vi } from "vitest";

const routerMock = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(async () => undefined),
};

let pathname = "/";
let searchParams = new URLSearchParams();

const navigationModuleMock = {
  useRouter: vi.fn(() => routerMock),
  usePathname: vi.fn(() => pathname),
  useSearchParams: vi.fn(() => searchParams),
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
  permanentRedirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
};

export function createNextNavigationModuleMock() {
  return navigationModuleMock;
}

export function getRouterMock() {
  return routerMock;
}

export function setPathnameMock(nextPathname: string) {
  pathname = nextPathname;
}

export function setSearchParamsMock(
  nextSearchParams: string | URLSearchParams,
) {
  searchParams =
    typeof nextSearchParams === "string"
      ? new URLSearchParams(nextSearchParams)
      : nextSearchParams;
}

export function resetNextNavigationMocks() {
  pathname = "/";
  searchParams = new URLSearchParams();
}
