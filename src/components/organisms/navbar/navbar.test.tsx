/** @vitest-environment jsdom */

import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clickElement, renderComponent } from "@/test/component-test-utils";
import { getRouterMock } from "@/test";

const useAuthMock = vi.hoisted(() => vi.fn());

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: Record<string, any>) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/contexts/auth-context", () => ({
  useAuth: useAuthMock,
}));

vi.mock("@/components/molecules/dropdown", () => ({
  Dropdown: ({ children }: Record<string, any>) => <div data-testid="dropdown">{children}</div>,
  DropdownButton: ({ children, ...props }: Record<string, any>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
  DropdownMenu: ({ children, ...props }: Record<string, any>) => <div {...props}>{children}</div>,
  DropdownItem: ({ href, onClick, children }: Record<string, any>) =>
    href ? (
      <a href={href}>{children}</a>
    ) : (
      <button type="button" onClick={onClick}>
        {children}
      </button>
    ),
}));

vi.mock("@headlessui/react", () => ({
  Button: ({ children, ...props }: Record<string, any>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
  Dialog: ({ open, children }: Record<string, any>) => (open ? <div>{children}</div> : null),
  DialogBackdrop: (props: Record<string, any>) => <div {...props} />,
  DialogPanel: ({ children, ...props }: Record<string, any>) => <div {...props}>{children}</div>,
  CloseButton: ({ as: Component = "button", children, ...props }: Record<string, any>) => (
    <Component {...props}>{children}</Component>
  ),
}));

import { Navbar } from "./navbar";

describe("Navbar", () => {
  const router = getRouterMock();

  beforeEach(() => {
    router.push.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("renders loading states for desktop and mobile navigation", () => {
    useAuthMock.mockReturnValue({
      loading: true,
      user: null,
      signOut: vi.fn(async () => undefined),
    });

    const { container, unmount } = renderComponent(
      <Navbar>
        <span>Logo</span>
      </Navbar>,
    );

    expect(container.textContent).toContain("Logo");
    expect(container.textContent).toContain("Baixando...");

    const buttons = container.querySelectorAll("button");
    clickElement(buttons[0] ?? null);
    expect(container.textContent).toContain("Baixar...");

    unmount();
  });

  it("renders guest login link and allows mobile menu close", () => {
    useAuthMock.mockReturnValue({
      loading: false,
      user: null,
      signOut: vi.fn(async () => undefined),
    });

    const { container, unmount } = renderComponent(<Navbar />);

    expect(container.querySelector('a[href="/login"]')?.textContent).toBe("Entrar");

    const buttons = container.querySelectorAll("button");
    clickElement(buttons[0] ?? null);
    expect(container.textContent).toContain("Curso");
    expect(container.textContent).toContain("Entrar");

    clickElement(container.querySelector(".flex.justify-end button"));
    expect(container.textContent).not.toContain("Curso");

    unmount();
  });

  it("handles desktop sign out success and failure", async () => {
    const successSignOut = vi.fn(async () => undefined);
    useAuthMock.mockReturnValue({
      loading: false,
      user: { email: "user@example.com" },
      signOut: successSignOut,
    });

    const firstRender = renderComponent(<Navbar />);
    clickElement(Array.from(firstRender.container.querySelectorAll("button")).find((el) => el.textContent === "Sair") ?? null);
    await act(async () => {
      await Promise.resolve();
    });
    expect(successSignOut).toHaveBeenCalledTimes(1);
    expect(router.push).toHaveBeenCalledWith("/login");
    firstRender.unmount();

    const error = new Error("boom");
    const failingSignOut = vi.fn(async () => {
      throw error;
    });
    useAuthMock.mockReturnValue({
      loading: false,
      user: { email: undefined },
      signOut: failingSignOut,
    });

    const secondRender = renderComponent(<Navbar />);
    expect(secondRender.container.textContent).toContain("Account");

    clickElement(Array.from(secondRender.container.querySelectorAll("button")).find((el) => el.textContent === "Sair") ?? null);
    await act(async () => {
      await Promise.resolve();
    });
    expect(console.error).toHaveBeenCalledWith("Failed to sign out:", error);
    secondRender.unmount();
  });

  it("handles mobile sign out success and failure", async () => {
    const successSignOut = vi.fn(async () => undefined);
    useAuthMock.mockReturnValue({
      loading: false,
      user: { email: "mobile@example.com" },
      signOut: successSignOut,
    });

    const firstRender = renderComponent(<Navbar />);
    clickElement(firstRender.container.querySelector("button"));
    clickElement(Array.from(firstRender.container.querySelectorAll("button")).find((el) => el.textContent === "Sair") ?? null);
    await act(async () => {
      await Promise.resolve();
    });
    expect(successSignOut).toHaveBeenCalledTimes(1);
    expect(router.push).toHaveBeenCalledWith("/login");
    firstRender.unmount();

    const error = new Error("mobile fail");
    const failingSignOut = vi.fn(async () => {
      throw error;
    });
    useAuthMock.mockReturnValue({
      loading: false,
      user: { email: undefined },
      signOut: failingSignOut,
    });

    const secondRender = renderComponent(<Navbar />);
    clickElement(secondRender.container.querySelector("button"));
    expect(secondRender.container.textContent).toContain("Account");
    clickElement(Array.from(secondRender.container.querySelectorAll("button")).find((el) => el.textContent === "Sair") ?? null);
    await act(async () => {
      await Promise.resolve();
    });
    expect(console.error).toHaveBeenCalledWith("Failed to sign out:", error);
    secondRender.unmount();
  });
});
