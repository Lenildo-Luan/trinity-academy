import {
  Breadcrumb,
  BreadcrumbHome,
  Breadcrumbs,
  BreadcrumbSeparator,
} from "@/components/molecules/breadcrumbs";
import { NextPageLink } from "@/components/molecules/next-page-link";
import { QuizSection } from "@/components/organisms/quiz-section";
import { SidebarLayoutContent } from "@/components/organisms/sidebar-layout";
import { TableOfContents } from "@/components/organisms/table-of-contents";
import { Video } from "@/components/molecules/video-player";
import { getLesson, getLessonContent } from "@/data/lessons";
import { getQuiz } from "@/data/quizzes";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const COURSE_ID = "vuejs-fundamentals";
const COURSE_TITLE = "Fundamentos do Vue.js";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  let lesson = await getLesson(COURSE_ID, (await params).slug);

  return {
    title: `${lesson?.title} - ${COURSE_TITLE}`,
    description: lesson?.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let slug = (await params).slug;
  let lesson = await getLesson(COURSE_ID, slug);

  if (!lesson) {
    notFound();
  }

  let Content = await getLessonContent(`${COURSE_ID}/${slug}`);
  let quiz = lesson.quizId
    ? await getQuiz(COURSE_ID, lesson.quizId)
    : null;

  return (
    <SidebarLayoutContent
      breadcrumbs={
        <Breadcrumbs>
          <BreadcrumbHome href={`/${COURSE_ID}`}>
            {COURSE_TITLE}
          </BreadcrumbHome>
          <BreadcrumbSeparator className="max-md:hidden" />
          <Breadcrumb>{lesson.title}</Breadcrumb>
        </Breadcrumbs>
      }
    >
      <div className="mx-auto max-w-7xl">
        <div className="-mx-2 sm:-mx-4">
          {lesson.video && (
            <Video
              id="video"
              src={lesson.video.url}
              poster={lesson.video.thumbnail}
            />
          )}
        </div>
        <div className="mx-auto flex max-w-2xl gap-x-10 py-10 sm:py-14 lg:max-w-5xl">
          <div className="w-full flex-1">
            <div id="content" className="prose">
              <Content />
            </div>
            {quiz && (
              <div className="mt-16">
                <QuizSection quiz={quiz} lessonId={lesson.id} courseId={COURSE_ID} />
              </div>
            )}
            <div className="mt-16 border-t border-gray-200 pt-8 dark:border-white/10">
              {lesson.next ? (
                <NextPageLink
                  title={lesson.next.title}
                  description={lesson.next.description}
                  href={`/${COURSE_ID}/${lesson.next.id}`}
                />
              ) : (
                <NextPageLink
                  title="Voltar ao curso"
                  description="Retorne à página principal do curso para explorar outros módulos."
                  href={`/${COURSE_ID}`}
                />
              )}
            </div>
          </div>
          <div className="hidden w-66 lg:block">
            <TableOfContents contentId="content" />
          </div>
        </div>
      </div>
    </SidebarLayoutContent>
  );
}
