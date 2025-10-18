'use client'

/**
 * Hook para gerenciar perfil do usuário
 * Busca e atualiza dados do perfil e foto
 */

import { useState, useEffect, useCallback } from 'react'
import type { UserProfile, UserProfileUpdate } from '@/types/database'
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  getInitials,
} from '@/lib/profile-service'

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [uploading, setUploading] = useState(false)

  /**
   * Carrega o perfil do usuário
   */
  const loadProfile = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await getUserProfile()

    if (fetchError) {
      setError(fetchError)
      setProfile(null)
    } else {
      setProfile(data)
    }

    setLoading(false)
  }, [])

  /**
   * Atualiza dados do perfil
   */
  const updateProfile = useCallback(
    async (data: UserProfileUpdate) => {
      setError(null)

      const { data: updatedProfile, error: updateError } =
        await updateUserProfile(data)

      if (updateError) {
        setError(updateError)
        return { success: false, error: updateError }
      }

      setProfile(updatedProfile)
      return { success: true, error: null }
    },
    [],
  )

  /**
   * Faz upload de uma nova foto de perfil
   */
  const uploadPhoto = useCallback(
    async (file: File) => {
      setUploading(true)
      setError(null)

      try {
        // Upload da foto
        const { data: uploadData, error: uploadError } =
          await uploadProfilePhoto(file)

        if (uploadError) {
          setError(uploadError)
          return { success: false, error: uploadError }
        }

        if (!uploadData) {
          throw new Error('Erro ao fazer upload da foto')
        }

        // Atualizar perfil com a nova URL
        const { data: updatedProfile, error: updateError } =
          await updateUserProfile({
            photo_url: uploadData.url,
          })

        if (updateError) {
          setError(updateError)
          return { success: false, error: updateError }
        }

        setProfile(updatedProfile)
        return { success: true, error: null, url: uploadData.url }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido')
        setError(error)
        return { success: false, error }
      } finally {
        setUploading(false)
      }
    },
    [],
  )

  /**
   * Remove a foto de perfil
   */
  const removePhoto = useCallback(async () => {
    if (!profile?.photo_url) return { success: false, error: null }

    setError(null)

    // Extrair o path da URL
    const urlParts = profile.photo_url.split('/profile-photos/')
    if (urlParts.length < 2) {
      const error = new Error('URL da foto inválida')
      setError(error)
      return { success: false, error }
    }

    const photoPath = urlParts[1]

    const { error: deleteError } = await deleteProfilePhoto(photoPath)

    if (deleteError) {
      setError(deleteError)
      return { success: false, error: deleteError }
    }

    setProfile((prev) => (prev ? { ...prev, photo_url: null } : null))
    return { success: true, error: null }
  }, [profile?.photo_url])

  /**
   * Obtém iniciais do nome para avatar
   */
  const initials = profile?.full_name ? getInitials(profile.full_name) : '?'

  /**
   * Carrega perfil na montagem
   */
  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  return {
    profile,
    loading,
    error,
    uploading,
    initials,
    loadProfile,
    updateProfile,
    uploadPhoto,
    removePhoto,
  }
}
