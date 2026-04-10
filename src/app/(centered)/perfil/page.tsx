'use client'

import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbSeparator,
  Breadcrumbs,
  CenteredPageLayout,
  ProfileHeader,
  ProfileStatsCards,
} from '@/components'
import { useUserProfile } from '@/hooks/use-user-profile'
import { useUserStats } from '@/hooks/use-user-stats'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ProfilePage() {
  const {
    profile,
    loading,
    error,
    uploading,
    initials,
    uploadPhoto,
    removePhoto,
    updateProfile,
  } = useUserProfile()

  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useUserStats()

  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Buscar email do usuário autenticado
  useEffect(() => {
    const fetchUserEmail = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || null)
      }
    }
    fetchUserEmail()
  }, [])

  if (loading) {
    return (
      <CenteredPageLayout
        breadcrumbs={
          <Breadcrumbs>
            <BreadcrumbHome href={'/introducao-a-programacao'}>Introdução a Programação</BreadcrumbHome>
            <BreadcrumbSeparator />
            <Breadcrumb>Perfil</Breadcrumb>
          </Breadcrumbs>
        }
      >
        <div className="mt-10 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent dark:border-zinc-100" />
        </div>
      </CenteredPageLayout>
    )
  }

  if (error) {
    return (
      <CenteredPageLayout
        breadcrumbs={
          <Breadcrumbs>
            <BreadcrumbHome href={'/introducao-a-programacao'}>Introdução a Programação</BreadcrumbHome>
            <BreadcrumbSeparator />
            <Breadcrumb>Perfil</Breadcrumb>
          </Breadcrumbs>
        }
      >
        <div className="mt-10 space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">
              Erro ao carregar perfil
            </h2>
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error.message}
            </p>

            <div className="mt-4 rounded border border-red-300 bg-red-100 p-4 dark:border-red-700 dark:bg-red-900/40">
              <h3 className="text-sm font-semibold text-red-900 dark:text-red-100">
                Como resolver:
              </h3>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-red-700 dark:text-red-300">
                <li>
                  Verifique se você executou o script SQL no Supabase (arquivo{' '}
                  <code className="rounded bg-red-200 px-1 dark:bg-red-800">
                    supabase-profile-schema.sql
                  </code>
                  )
                </li>
                <li>
                  Confirme que a tabela{' '}
                  <code className="rounded bg-red-200 px-1 dark:bg-red-800">
                    user_profiles
                  </code>{' '}
                  existe no seu banco de dados
                </li>
                <li>Verifique se você está autenticado (faça login novamente)</li>
                <li>
                  Abra o Console do navegador (F12) e veja os logs para mais
                  detalhes
                </li>
              </ol>
            </div>
          </div>
        </div>
      </CenteredPageLayout>
    )
  }

  return (
    <CenteredPageLayout
      breadcrumbs={
        <Breadcrumbs>
          <BreadcrumbHome href={'/introducao-a-programacao'}>Introdução a Programação</BreadcrumbHome>
          <BreadcrumbSeparator />
          <Breadcrumb>Perfil</Breadcrumb>
        </Breadcrumbs>
      }
    >
      <h1 className="mt-10 text-3xl/10 font-normal tracking-tight text-zinc-950 sm:mt-14 dark:text-white">
        Meu Perfil
      </h1>
      <p className="mt-6 max-w-xl text-base/7 text-zinc-600 dark:text-zinc-400">
        Gerencie suas informações pessoais e foto de perfil.
      </p>

      <div className="mt-12">
        <ProfileHeader
          profile={
            profile
              ? {
                  ...profile,
                  email: userEmail,
                }
              : null
          }
          initials={initials}
          uploading={uploading}
          onUploadPhoto={uploadPhoto}
          onRemovePhoto={removePhoto}
          onUpdateProfile={updateProfile}
        />
      </div>

      {/* Estatísticas */}
      <div className="mt-16 space-y-16">
        {statsError ? (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Não foi possível carregar as estatísticas: {statsError.message}
            </p>
            <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
              Verifique se você executou o script{' '}
              <code className="rounded bg-yellow-100 px-1 dark:bg-yellow-900">
                supabase-stats-functions.sql
              </code>{' '}
              no Supabase.
            </p>
          </div>
        ) : (
          <ProfileStatsCards stats={stats} loading={statsLoading} />
        )}
      </div>
    </CenteredPageLayout>
  )
}
