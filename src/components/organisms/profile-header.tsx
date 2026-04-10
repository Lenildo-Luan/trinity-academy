'use client'

import { useState } from 'react'
import { ProfilePhotoUpload } from './profile-photo-upload'
import { TextInput } from '../atoms/input'
import { Button } from '../atoms/button'
import { clsx } from 'clsx'

type ProfileHeaderProps = {
  profile: {
    id: string
    full_name: string | null
    photo_url: string | null
    email?: string | null
  } | null
  initials: string
  uploading: boolean
  onUploadPhoto: (file: File) => Promise<{ success: boolean; error?: Error | null }>
  onRemovePhoto: () => Promise<{ success: boolean; error?: Error | null }>
  onUpdateProfile: (data: {
    full_name?: string
  }) => Promise<{ success: boolean; error?: Error | null }>
}

export function ProfileHeader({
  profile,
  initials,
  uploading,
  onUploadPhoto,
  onRemovePhoto,
  onUpdateProfile,
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    const result = await onUpdateProfile({ full_name: fullName })

    if (result.success) {
      setIsEditing(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } else if (result.error) {
      setSaveError(result.error.message)
    }

    setSaving(false)
  }

  const handleCancel = () => {
    setFullName(profile?.full_name || '')
    setIsEditing(false)
    setSaveError(null)
  }

  return (
    <div className="flex flex-col items-center gap-8 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
      {/* Photo Upload */}
      <ProfilePhotoUpload
        photoUrl={profile?.photo_url || null}
        initials={initials}
        onUpload={onUploadPhoto}
        onRemove={onRemovePhoto}
        uploading={uploading}
      />

      {/* User Info */}
      <div className="w-full max-w-md space-y-4">
        {/* Name */}
        <div className='flex flex-col content-center'>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Nome completo
          </label>
          {isEditing ? (
            <TextInput
              id="full_name"
              type="text"
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
              placeholder="Seu nome completo"
              className="mt-1"
              disabled={saving}
            />
          ) : (
            <p className="mt-1 text-base font-medium text-zinc-900 dark:text-zinc-100">
              {profile?.full_name || 'Não informado'}
            </p>
          )}
        </div>

        {/* Email (read-only) */}
        {profile?.email && (
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <p className="mt-1 text-base text-zinc-600 dark:text-zinc-400">
              {profile.email}
            </p>
          </div>
        )}

        {/* Edit Buttons */}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={saving || !fullName.trim()}
                className={clsx(
                  saving && 'cursor-not-allowed opacity-50',
                )}
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className={clsx(
                  'rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
                  saving && 'cursor-not-allowed opacity-50',
                )}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              Editar perfil
            </button>
          )}
        </div>

        {/* Success/Error Messages */}
        {saveSuccess && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Perfil atualizado com sucesso!
          </p>
        )}
        {saveError && (
          <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
        )}
      </div>
    </div>
  )
}
