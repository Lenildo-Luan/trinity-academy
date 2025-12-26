import {
  Breadcrumb,
  BreadcrumbHome,
  Breadcrumbs,
  BreadcrumbSeparator,
} from "@/components/breadcrumbs";
import { ContentLink } from "@/components/content-link";
import { Logo } from "@/components/logo";
import { PageSection } from "@/components/page-section";
import { SidebarLayoutContent } from "@/components/sidebar-layout";
import { getModules, type Module } from "@/data/lessons";
import { BookIcon } from "@/icons/book-icon";
import { ClockIcon } from "@/icons/clock-icon";
import { LessonsIcon } from "@/icons/lessons-icon";
import { PlayIcon } from "@/icons/play-icon";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Introdução a Programação",
  description:
    "Uma jornada no universo da programação que te fará entender os conceitos fundamentais da programação utilizando a linguagem mais popular do mundo: JavaScript.",
};

function formatDuration(seconds: number): string {
  let h = Math.floor(seconds / 3600);
  let m = Math.floor((seconds % 3600) / 60);

  return h > 0 ? (m > 0 ? `${h} hr ${m} min` : `${h} hr`) : `${m} min`;
}

export default async function Page() {
  let modules: Module[] = await getModules('introducao-a-programacao');
  let lessons = modules.flatMap(({ lessons }) => lessons);
  let duration = lessons.reduce(
    (sum, { video }) => sum + (video?.duration ?? 0),
    0,
  );

  return (
    <SidebarLayoutContent
      breadcrumbs={
        <Breadcrumbs>
        </Breadcrumbs>
      }
    >
      <div className="relative mx-auto max-w-7xl mb-8">
        <div className="absolute -inset-x-2 top-0 -z-10 h-80 overflow-hidden rounded-t-2xl sm:h-[100%] lg:-inset-x-4">
          <img
            alt=""
            src="https://ik.imagekit.io/qfmgarse7/js-background.avif?updatedAt=1760284705415"
            className="absolute inset-0 h-full w-full mask-l-from-60% object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 rounded-2xl outline-1 -outline-offset-1 outline-gray-950/10 dark:outline-white/10" />
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="relative">
            <div className="px-4 pt-48 pb-12 lg:py-24">
              <h1 className="max-w-lg text-xl md:text-[1.5rem] font-black text-base/7 text-pretty text-gray-900 dark:text-white">
                Introdução a Programação
              </h1>
              <h1 className="sr-only">Introdução a Programação</h1>
              <p className="mt-7 max-w-lg text-base/7 text-pretty text-gray-600 dark:text-gray-400">
                Uma jornada no universo da programação que te fará entender os
                conceitos fundamentais da programação utilizando a linguagem mais
                popular do mundo: JavaScript.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm/7 font-semibold text-gray-950 sm:gap-3 dark:text-white">
                <div className="flex items-center gap-1.5">
                  <BookIcon className="stroke-gray-950/40 dark:stroke-white/40" />
                  {modules.length} modulos
                </div>
                <span className="hidden text-gray-950/25 sm:inline dark:text-white/25">
                  &middot;
                </span>
                <div className="flex items-center gap-1.5">
                  <LessonsIcon className="stroke-gray-950/40 dark:stroke-white/40" />
                  {lessons.length} aulas
                </div>
                <span className="hidden text-gray-950/25 sm:inline dark:text-white/25">
                  &middot;
                </span>
                <div className="flex items-center gap-1.5">
                  <ClockIcon className="stroke-gray-950/40 dark:stroke-white/40" />
                  {formatDuration(duration)}
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href={`/introducao-a-programacao`}
                  className="inline-flex items-center gap-x-2 rounded-full bg-gray-950 px-3 py-0.5 text-sm/7 font-semibold text-white hover:bg-gray-800 dark:bg-green-600 dark:hover:bg-green-500"
                >
                  <PlayIcon className="fill-white" />
                  Começar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl mb-8">
        <div className="absolute -inset-x-2 top-0 -z-10 h-80 overflow-hidden rounded-t-2xl sm:h-[100%] lg:-inset-x-4">
          <img
            alt=""
            src="https://ik.imagekit.io/qfmgarse7/thomas-t-OPpCbAAKWv8-unsplash.avif"
            className="absolute inset-0 h-full w-full mask-l-from-60% object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 rounded-2xl outline-1 -outline-offset-1 outline-gray-950/10 dark:outline-white/10" />
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="relative">
            <div className="px-4 pt-48 pb-12 lg:py-24">
              <h1 className="max-w-lg text-xl md:text-[1.5rem] font-black text-base/7 text-pretty text-gray-900 dark:text-white">
                Em breve: Pré-cálculo
              </h1>
              <h1 className="sr-only">Em breve: Pré-cálculo</h1>
              <p className="mt-7 max-w-lg text-base/7 text-pretty text-gray-600 dark:text-gray-400">
                Prepare-se para dominar os conceitos essenciais de pré-cálculo,
                incluindo funções, gráficos e trigonometria, estabelecendo uma base
                sólida para o sucesso em matemática avançada.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm/7 font-semibold text-gray-950 sm:gap-3 dark:text-white">
                <div className="flex items-center gap-1.5">
                  <BookIcon className="stroke-gray-950/40 dark:stroke-white/40" />
                  N modulos
                </div>
                <span className="hidden text-gray-950/25 sm:inline dark:text-white/25">
                  &middot;
                </span>
                <div className="flex items-center gap-1.5">
                  <LessonsIcon className="stroke-gray-950/40 dark:stroke-white/40" />
                  N aulas
                </div>
                <span className="hidden text-gray-950/25 sm:inline dark:text-white/25">
                  &middot;
                </span>
                <div className="flex items-center gap-1.5">
                  <ClockIcon className="stroke-gray-950/40 dark:stroke-white/40" />
                  N mins
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href={`/`}
                  className="pointer-events-none inline-flex items-center gap-x-2 rounded-full bg-gray-950 px-3 py-0.5 text-sm/7 font-semibold text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <PlayIcon className="fill-white" />
                  Indisponível
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayoutContent>
  );
}
