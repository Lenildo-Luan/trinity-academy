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

function getLessons(module: string): Module[]  {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  const raw = require(`./lessons/${module}/module.json`);
  const lessons: Module[] = raw?.default ?? raw;

  return lessons;
}

export function getModules(module: string): Module[] {
  return getLessons(module);
}

export async function getLesson(
  moduleName: string,
  slug: string,
): Promise<(Lesson & { module: Module; next: Lesson | null }) | null> {
  const lessons = getLessons(moduleName)
  let module = lessons.find(({ lessons }) =>
    lessons.some(({ id }) => id === slug),
  );

  if (!module) {
    return null;
  }

  let index = module.lessons.findIndex(({ id }) => id === slug);

  return {
    ...module.lessons[index],
    module,
    next: index < module.lessons.length - 1 ? module.lessons[index + 1] : null,
  };
}

export async function getLessonContent(slug: string) {
  return (await import(`@/data/lessons/${slug}.mdx`)).default;
}

