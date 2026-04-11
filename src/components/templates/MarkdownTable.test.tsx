/** @vitest-environment jsdom */

import { afterEach, describe, expect, it, vi } from "vitest";
import { renderComponent } from "@/test/component-test-utils";
import { MarkdownTable } from "./MarkdownTable";

describe("MarkdownTable", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("renders markdown segments and row count labels", () => {
    const { container, unmount } = renderComponent(
      <MarkdownTable
        headers={["Nome **forte**", "*Tipo*", "`Código`"]}
        rows={[
          ["Alice", "*Admin*", "`A1`"],
          ["Bob", "**Editor**", "Texto"],
        ]}
        className="my-table"
        showRowCount
      />,
    );

    expect(container.querySelector("strong")?.textContent).toBe("forte");
    expect(container.querySelector("em")?.textContent).toBe("Tipo");
    expect(container.querySelector("code")?.textContent).toBe("Código");
    expect(container.querySelector(".my-table")).not.toBeNull();
    expect(container.textContent).toContain("Total: 2 registros");

    unmount();
  });

  it("renders singular row count label", () => {
    const { container, unmount } = renderComponent(
      <MarkdownTable headers={["H1"]} rows={[["A"]]} showRowCount />,
    );

    expect(container.textContent).toContain("Total: 1 registro");

    unmount();
  });

  it("returns null and logs error when headers or rows are invalid", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { container, unmount } = renderComponent(
      <MarkdownTable
        headers={"invalid" as unknown as string[]}
        rows={"invalid" as unknown as string[][]}
      />,
    );

    expect(container.innerHTML).toBe("");
    expect(spy).toHaveBeenCalledWith(
      "MarkdownTable: headers e rows devem ser arrays",
    );

    unmount();
  });
});
