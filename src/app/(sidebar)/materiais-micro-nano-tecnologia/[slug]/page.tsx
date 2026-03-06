import {
  Breadcrumb,
  BreadcrumbHome,
  Breadcrumbs,
  BreadcrumbSeparator,
} from "@/components/breadcrumbs";
import { NextPageLink } from "@/components/next-page-link";
import { QuizSection } from "@/components/quiz-section";
import { SidebarLayoutContent } from "@/components/sidebar-layout";
import TableOfContents from "@/components/table-of-contents";
import { Video } from "@/components/video-player";
import { getLesson, getLessonContent } from "@/data/lessons";
import { getQuiz } from "@/data/quizzes";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  let lesson = await getLesson('materiais-micro-nano-tecnologia', (await params).slug);

  return {
    title: `${lesson?.title} - Materiais para Micro e Nano Tecnologia`,
    description: lesson?.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const moduleName = 'materiais-micro-nano-tecnologia';
  let slug = (await params).slug;
  let lesson = await getLesson('materiais-micro-nano-tecnologia', slug);

  if (!lesson) {
    notFound();
  }

  let Content = await getLessonContent(`${moduleName}/${slug}`);
  let quiz = lesson.quizId ? await getQuiz('materiais-micro-nano-tecnologia', lesson.quizId) : null;

  return (
    <SidebarLayoutContent
      breadcrumbs={
        <Breadcrumbs>
          <BreadcrumbHome href={'/materiais-micro-nano-tecnologia'}>Materiais para Micro e Nano Tecnologia</BreadcrumbHome>
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
                <QuizSection quiz={quiz} lessonId={lesson.id} courseId="materiais-micro-nano-tecnologia" />
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
                  title="Voltar ao Início"
                  description="Retorne à página principal do curso para explorar outros módulos."
                  href="/materiais-micro-nano-tecnologia"
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

