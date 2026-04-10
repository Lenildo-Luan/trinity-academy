import { Breadcrumbs } from "@/components/molecules/breadcrumbs";
import { SidebarLayoutContent } from "@/components/organisms/sidebar-layout";
import { courses } from "@/data/courses";
import { getCourseStats } from "@/data/lessons";
import { BookIcon } from "@/icons/book-icon";
import { ClockIcon } from "@/icons/clock-icon";
import { LessonsIcon } from "@/icons/lessons-icon";
import { PlayIcon } from "@/icons/play-icon";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trinity Academy",
  description: "Explore nossos cursos.",
};

function formatDuration(seconds: number): string {
  let h = Math.floor(seconds / 3600);
  let m = Math.floor((seconds % 3600) / 60);

  return h > 0 ? (m > 0 ? `${h} hr ${m} min` : `${h} hr`) : `${m} min`;
}

export default async function Page() {
  const courseData = courses.map((course) => ({
    ...course,
    stats: course.available ? getCourseStats(course.id) : null,
  }));

  return (
    <SidebarLayoutContent
      breadcrumbs={
        <Breadcrumbs>
        </Breadcrumbs>
      }
    >
      {courseData.map((course) => {
        const stats = course.stats;

        return (
          <div key={course.id} className="relative mx-auto max-w-7xl mb-8 mt-6">
            <div className="absolute -inset-x-2 top-0 -z-10 overflow-hidden rounded-t-2xl h-[100%] lg:-inset-x-4">
              <img
                alt=""
                src={course.backgroundImage}
                className="absolute inset-0 h-full w-full mask-l-from-60% object-cover object-center opacity-40"
              />
              <div className="absolute inset-0 rounded-2xl outline-1 -outline-offset-1 outline-gray-950/10 dark:outline-white/10" />
            </div>

            <div className="mx-auto max-w-6xl">
              <div className="relative">
                <div className="px-4 py-12 sm:pt-48 lg:py-24">
                  <h2 className="max-w-lg text-xl md:text-[1.5rem] font-black text-base/7 text-pretty text-gray-900 dark:text-white">
                    {!course.available && "Em breve: "}
                    {course.title}
                  </h2>
                  <p className="mt-7 max-w-lg text-base/7 text-pretty text-gray-600 dark:text-gray-400">
                    {course.description}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm/7 font-semibold text-gray-950 sm:gap-3 dark:text-white">
                    <div className="flex items-center gap-1.5">
                      <BookIcon className="stroke-gray-950/40 dark:stroke-white/40" />
                      {stats ? `${stats.moduleCount} módulos` : "N módulos"}
                    </div>
                    <span className="hidden text-gray-950/25 sm:inline dark:text-white/25">
                      &middot;
                    </span>
                    <div className="flex items-center gap-1.5">
                      <LessonsIcon className="stroke-gray-950/40 dark:stroke-white/40" />
                      {stats ? `${stats.lessonCount} aulas` : "N aulas"}
                    </div>
                    <span className="hidden text-gray-950/25 sm:inline dark:text-white/25">
                      &middot;
                    </span>
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="stroke-gray-950/40 dark:stroke-white/40" />
                      {stats ? formatDuration(stats.duration) : "N mins"}
                    </div>
                  </div>

                  <div className="mt-10">
                    {course.available ? (
                      <Link
                        href={`/${course.id}`}
                        className="inline-flex items-center gap-x-2 rounded-full bg-gray-950 px-3 py-0.5 text-sm/7 font-semibold text-white hover:bg-gray-800 dark:bg-green-600 dark:hover:bg-green-500"
                      >
                        <PlayIcon className="fill-white" />
                        Começar
                      </Link>
                    ) : (
                      <span className="pointer-events-none inline-flex items-center gap-x-2 rounded-full bg-gray-950 px-3 py-0.5 text-sm/7 font-semibold text-white dark:bg-gray-700">
                        <PlayIcon className="fill-white" />
                        Indisponível
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </SidebarLayoutContent>
  );
}
