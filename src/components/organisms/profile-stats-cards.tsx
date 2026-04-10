'use client'

import { clsx } from 'clsx'
import type { UserStatistics } from '@/types/database'
import {
  formatStudyTime,
  getProgressColor,
  getScoreColor,
} from '@/lib/stats-service'

type ProfileStatsCardsProps = {
  stats: UserStatistics | null
  loading?: boolean
}

type StatCardProps = {
  title: string
  value: string | number
  subtitle?: string
  color?: 'green' | 'yellow' | 'red' | 'gray' | 'blue'
  icon?: string
  loading?: boolean
}

function StatCard({
  title,
  value,
  subtitle,
  color = 'gray',
  icon,
  loading = false,
}: StatCardProps) {
  const colorClasses = {
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    red: 'text-red-600 dark:text-red-400',
    gray: 'text-zinc-600 dark:text-zinc-400',
    blue: 'text-blue-600 dark:text-blue-400',
  }

  const bgColorClasses = {
    green: 'bg-green-50 dark:bg-green-900/20',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    gray: 'bg-zinc-50 dark:bg-zinc-900/20',
    blue: 'bg-blue-50 dark:bg-blue-900/20',
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-4 h-12 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-2 h-3 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'flex flex-col items-center rounded-2xl border p-6 transition-shadow hover:shadow-md',
        'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900',
      )}
    >
      {/* Title */}
      <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {title}
      </h3>

      {/* Value */}
      <div className="mt-4 flex items-center gap-2">
        {icon && <span className="text-4xl">{icon}</span>}
        <p
          className={clsx(
            'text-5xl font-bold tabular-nums',
            colorClasses[color],
          )}
        >
          {value}
        </p>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export function ProfileStatsCards({ stats, loading }: ProfileStatsCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <StatCard
            key={i}
            title="Carregando..."
            value="--"
            loading={true}
          />
        ))}
      </div>
    )
  }

  const progressColor = getProgressColor(stats.completion_percentage)
  const scoreColor = getScoreColor(stats.average_score)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Estatísticas
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Acompanhe seu progresso no curso
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Card 1: Progresso Geral */}
        <StatCard
          title="Progresso Geral"
          value={`${Math.round(stats.completion_percentage)}%`}
          subtitle={`${stats.completed_lessons} de ${stats.total_lessons} lições`}
          color={progressColor}
        />

        {/* Card 2: Lições Completadas */}
        <StatCard
          title="Lições Completas"
          value={`${stats.completed_lessons}/${stats.total_lessons}`}
          subtitle="Nota ≥ 70%"
          color={stats.completed_lessons > 0 ? 'blue' : 'gray'}
        />

        {/* Card 3: Nota Média */}
        <StatCard
          title="Nota Média"
          value={stats.average_score.toFixed(1)}
          subtitle="Escala 0-10"
          color={scoreColor}
        />

        {/* Card 4: Tempo Total de Estudo */}
        <StatCard
          title="Tempo de Estudo"
          value={formatStudyTime(stats.total_study_time_seconds)}
          subtitle="Total acumulado"
          color="blue"
        />

        {/* Card 5: Streak de Dias */}
        <StatCard
          title="Sequência"
          value={stats.current_streak}
          subtitle={
            stats.current_streak === 1
              ? 'dia consecutivo'
              : 'dias consecutivos'
          }
          icon={stats.current_streak >= 3 ? '🔥' : undefined}
          color={stats.current_streak >= 7 ? 'green' : stats.current_streak >= 3 ? 'yellow' : 'gray'}
        />
      </div>
    </div>
  )
}
