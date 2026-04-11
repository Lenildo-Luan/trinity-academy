import { describe, expect, it } from "vitest";

import { courses, getCourse } from "./courses";

describe("courses data helpers", () => {
  it("returns a course by id", () => {
    const course = getCourse("introducao-a-programacao");

    expect(course).toBeDefined();
    expect(course).toEqual(courses[0]);
  });

  it("returns undefined for unknown id", () => {
    expect(getCourse("unknown-course")).toBeUndefined();
  });
});
