import { describe, expect, it } from "vitest";

import {
  getCourseStats,
  getLesson,
  getLessonContent,
  getModules,
} from "./lessons";

describe("lessons data helpers", () => {
  it("loads modules for a course", () => {
    const modules = getModules("logic-test-course");

    expect(modules).toHaveLength(2);
    expect(modules[0]?.id).toBe("module-1");
  });

  it("computes course stats with video durations", () => {
    const stats = getCourseStats("logic-test-course");

    expect(stats).toEqual({
      moduleCount: 2,
      lessonCount: 3,
      duration: 150,
    });
  });

  it("returns null stats for a missing course", () => {
    expect(getCourseStats("unknown-course")).toBeNull();
  });

  it("returns lesson details with next lesson", async () => {
    const lesson = await getLesson("logic-test-course", "lesson-1");

    expect(lesson?.id).toBe("lesson-1");
    expect(lesson?.module.id).toBe("module-1");
    expect(lesson?.next?.id).toBe("lesson-2");
  });

  it("returns last lesson with null next", async () => {
    const lesson = await getLesson("logic-test-course", "lesson-2");

    expect(lesson?.id).toBe("lesson-2");
    expect(lesson?.next).toBeNull();
  });

  it("returns null when lesson does not exist", async () => {
    await expect(
      getLesson("logic-test-course", "missing-lesson"),
    ).resolves.toBeNull();
  });

  it("loads lesson mdx content module", async () => {
    const content = await getLessonContent("mock-content");

    expect(content).toBeTypeOf("function");
  });
});
