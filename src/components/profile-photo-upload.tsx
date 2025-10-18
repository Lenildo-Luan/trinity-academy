'use client'

import { useRef, useState } from 'react'
import { clsx } from 'clsx'
import Image from 'next/image'

type ProfilePhotoUploadProps = {
  photoUrl: string | null
  initials: string
  onUpload: (file: File) => Promise<{ success: boolean; error?: Error | null }>
  onRemove?: () => Promise<{ success: boolean; error?: Error | null }>
  uploading?: boolean
  className?: string
}

export function ProfilePhotoUpload({
  photoUrl,
  initials,
  onUpload,
  onRemove,
  uploading = false,
  className,
}: ProfilePhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    // Validações básicas
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setUploadError('Tipo de arquivo inválido. Use JPG, PNG ou WebP.')
      return
    }

    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      setUploadError('Arquivo muito grande. O tamanho máximo é 2MB.')
      return
    }

    // Criar preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Fazer upload
    const result = await onUpload(file)

    if (!result.success && result.error) {
      setUploadError(result.error.message)
      setPreviewUrl(null)
    } else {
      setPreviewUrl(null)
    }

    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemovePhoto = async () => {
    if (!onRemove) return

    setUploadError(null)
    const result = await onRemove()

    if (!result.success && result.error) {
      setUploadError(result.error.message)
    }
  }

  const displayUrl = previewUrl || photoUrl

  return (
    <div className={clsx('flex flex-col items-center gap-4', className)}>
      {/* Avatar */}
      <div className="relative">
        <div
          className={clsx(
            'flex h-32 w-32 items-center justify-center rounded-full border-2 border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800',
            uploading && 'opacity-50',
          )}
        >
          {displayUrl ? (
            previewUrl ? (
              // Use img normal para preview (data URL)
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Foto de perfil"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              // Use Next Image para URLs do Supabase
              <Image
                src={photoUrl!}
                alt="Foto de perfil"
                width={128}
                height={128}
                className="h-full w-full rounded-full object-cover"
              />
            )
          ) : (
            <span className="text-3xl font-semibold text-zinc-600 dark:text-zinc-400">
              {initials}
            </span>
          )}
        </div>

        {/* Loading indicator */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleFileSelect}
          disabled={uploading}
          className={clsx(
            'rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:bg-zinc-700 dark:hover:bg-zinc-600',
            uploading && 'cursor-not-allowed opacity-50',
          )}
        >
          {photoUrl ? 'Alterar foto' : 'Adicionar foto'}
        </button>

        {photoUrl && onRemove && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            disabled={uploading}
            className={clsx(
              'rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 focus:outline-2 focus:outline-offset-2 focus:outline-red-500',
              uploading && 'cursor-not-allowed opacity-50',
            )}
          >
            Remover
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error message */}
      {uploadError && (
        <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
      )}

      {/* Info */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        JPG, PNG ou WebP. Máximo 2MB.
      </p>
    </div>
  )
}
