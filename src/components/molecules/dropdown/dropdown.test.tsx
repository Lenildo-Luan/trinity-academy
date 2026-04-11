/** @vitest-environment jsdom */

import { describe, expect, it, vi } from "vitest";
import { clickElement, renderComponent } from "@/test/component-test-utils";

vi.mock("@headlessui/react", () => ({
  Menu: ({ children, ...props }: Record<string, any>) => (
    <div data-testid="menu-root" {...props}>
      {children}
    </div>
  ),
  MenuButton: ({ children, ...props }: Record<string, any>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
  MenuItems: ({ children, ...props }: Record<string, any>) => <div {...props}>{children}</div>,
  MenuItem: ({ children }: Record<string, any>) => <div>{children}</div>,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: Record<string, any>) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  ),
}));

import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from "./dropdown";

describe("dropdown components", () => {
  it("renders dropdown wrappers and default menu anchor", () => {
    const { container, unmount } = renderComponent(
      <Dropdown data-role="root">
        <DropdownButton data-role="trigger">Abrir</DropdownButton>
        <DropdownMenu data-role="menu">Conteúdo</DropdownMenu>
      </Dropdown>,
    );

    const root = container.querySelector('[data-role="root"]');
    const trigger = container.querySelector('[data-role="trigger"]');
    const menu = container.querySelector('[data-role="menu"]');

    expect(root).not.toBeNull();
    expect(trigger?.textContent).toBe("Abrir");
    expect(menu?.getAttribute("anchor")).toBe("bottom start");
    expect(menu?.className).toContain("min-w-38");
    expect(menu?.textContent).toBe("Conteúdo");

    unmount();
  });

  it("supports custom anchor and href item branch", () => {
    const { container, unmount } = renderComponent(
      <DropdownMenu anchor="bottom end">
        <DropdownItem href="/perfil">Perfil</DropdownItem>
      </DropdownMenu>,
    );

    expect(container.querySelector('[anchor="bottom end"]')).not.toBeNull();
    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe("/perfil");
    expect(link?.textContent).toBe("Perfil");

    unmount();
  });

  it("renders button item branch and handles click", () => {
    const onClick = vi.fn();
    const { container, unmount } = renderComponent(
      <DropdownItem onClick={onClick}>Sair</DropdownItem>,
    );

    const button = container.querySelector("button");
    expect(button?.textContent).toBe("Sair");
    clickElement(button);
    expect(onClick).toHaveBeenCalledTimes(1);

    unmount();
  });
});
