export type Module = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  video: {
    thumbnail: string;
    duration: number;
    url: string;
  } | null;
  quizId: string | null;
};

export function getModules(_module: string): Module[] {
  return [];
}

export function getCourseStats(_courseId: string): {
  moduleCount: number;
  lessonCount: number;
  duration: number;
} | null {
  return {
    moduleCount: 0,
    lessonCount: 0,
    duration: 0,
  };
}

export async function getLesson(
  _moduleName: string,
  _slug: string,
): Promise<(Lesson & { module: Module; next: Lesson | null }) | null> {
  return null;
}

export async function getLessonContent(_slug: string) {
  return () => null;
}
