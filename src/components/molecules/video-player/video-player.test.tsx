/** @vitest-environment jsdom */

import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clickElement, renderComponent } from "@/test/component-test-utils";

type Entry = { isIntersecting: boolean };

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  readonly callback: (entries: Entry[]) => void;
  observe = vi.fn();
  disconnect = vi.fn();

  constructor(callback: (entries: Entry[]) => void) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting }]);
  }
}

import { TimestampButton, Video } from "./video-player";

describe("Video player components", () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("toggles offscreen state and playing attribute based on observer and events", () => {
    const { container, unmount } = renderComponent(<Video id="lesson-video" src="/a.mp4" />);

    const wrapper = container.firstElementChild as HTMLDivElement | null;
    const video = container.querySelector("video");
    const observer = MockIntersectionObserver.instances[0];

    expect(wrapper).not.toBeNull();
    expect(video).not.toBeNull();
    expect(observer).toBeDefined();
    expect(observer.observe).toHaveBeenCalledWith(wrapper);

    act(() => {
      video?.dispatchEvent(new Event("play", { bubbles: true }));
    });
    expect(video?.hasAttribute("data-playing")).toBe(true);

    act(() => {
      observer.trigger(false);
    });
    expect(wrapper?.hasAttribute("data-offscreen")).toBe(true);

    act(() => {
      video?.dispatchEvent(new Event("pause", { bubbles: true }));
    });
    expect(video?.hasAttribute("data-playing")).toBe(true);

    act(() => {
      observer.trigger(true);
    });
    expect(wrapper?.hasAttribute("data-offscreen")).toBe(false);

    act(() => {
      video?.dispatchEvent(new Event("pause", { bubbles: true }));
    });
    expect(video?.hasAttribute("data-playing")).toBe(false);

    unmount();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });

  it("TimestampButton seeks and plays target video, and handles missing target", () => {
    const targetVideo = document.createElement("video");
    targetVideo.id = "player-1";
    targetVideo.play = vi.fn(async () => undefined);
    document.body.appendChild(targetVideo);

    const { container, unmount } = renderComponent(
      <div>
        <TimestampButton start={3661} videoId="player-1" />
        <TimestampButton start={5} videoId="missing-video" className="small" />
      </div>,
    );

    const buttons = container.querySelectorAll("button");
    expect(buttons[0]?.textContent).toContain("01:01:01");
    expect(buttons[1]?.textContent).toContain("00:05");
    expect(buttons[1]?.className).toContain("small");

    clickElement(buttons[0] ?? null);
    expect(targetVideo.currentTime).toBe(3661);
    expect(targetVideo.play).toHaveBeenCalledTimes(1);

    expect(() => clickElement(buttons[1] ?? null)).not.toThrow();

    unmount();
    document.body.removeChild(targetVideo);
  });
});
