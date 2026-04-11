/** @vitest-environment jsdom */

import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderComponent } from "@/test/component-test-utils";

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: Record<string, any>) => <img alt={alt ?? ""} {...props} />,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: Record<string, any>) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  ),
}));

import { VideoCard } from "./video-card";

describe("VideoCard", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders video preview branch and resets currentTime on pointer leave", () => {
    const { container, unmount } = renderComponent(
      <VideoCard
        url="/video/1"
        target="_blank"
        thumbnailUrl="/thumb.jpg"
        videoUrl="/preview.mp4"
        duration={3661}
        title="Título"
        subtitle="Legenda"
      />,
    );

    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe("/video/1");
    expect(link?.getAttribute("target")).toBe("_blank");

    const wrapper = container.querySelector(".group.relative");
    const image = container.querySelector("img");
    const video = container.querySelector("video") as HTMLVideoElement | null;
    expect(video).not.toBeNull();
    if (video) {
      video.currentTime = 12;
    }

    act(() => {
      image?.dispatchEvent(new PointerEvent("pointerout", { bubbles: true }));
    });
    expect(video?.currentTime).toBe(0);
    expect(container.textContent).toContain("1:01:01");
    expect(container.textContent).toContain("Título");
    expect(container.textContent).toContain("Legenda");

    unmount();
  });

  it("renders image-only branch when videoUrl is not provided", () => {
    const { container, unmount } = renderComponent(
      <VideoCard
        url="/video/2"
        thumbnailUrl="/thumb2.jpg"
        duration={59}
        title="Sem preview"
        subtitle="Descrição"
      />,
    );

    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelectorAll("img").length).toBe(1);
    expect(container.textContent).toContain("0:00:59");

    unmount();
  });
});
