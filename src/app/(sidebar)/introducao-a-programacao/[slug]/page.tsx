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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  let lesson = await getLesson('introducao-a-programacao', (await params).slug);

  return {
    title: `${lesson?.title} - Introdução a Programação`,
    description: lesson?.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const moduleName = 'introducao-a-programacao';
  let slug = (await params).slug;
  let lesson = await getLesson('introducao-a-programacao', slug);

  if (!lesson) {
    notFound();
  }

  let Content = await getLessonContent(`${moduleName}/${slug}`);
  let quiz = lesson.quizId ? await getQuiz('introducao-a-programacao', lesson.quizId) : null;

  return (
    <SidebarLayoutContent
      breadcrumbs={
        <Breadcrumbs>
          <BreadcrumbHome href={'/introducao-a-programacao'}>Introdução a Programação</BreadcrumbHome>
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
                <QuizSection quiz={quiz} lessonId={lesson.id} courseId="introducao-a-programacao" />
              </div>
            )}
            <div className="mt-16 border-t border-gray-200 pt-8 dark:border-white/10">
              {lesson.next ? (
                <NextPageLink
                  title={lesson.next.title}
                  description={lesson.next.description}
                  href={`/${lesson.next.id}`}
                />
              ) : (
                <NextPageLink
                  title="Interviews"
                  description="Explore interviews with industry experts and thought leaders."
                  href="/interviews"
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
