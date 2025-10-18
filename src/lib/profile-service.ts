/**
 * Serviço para gerenciar perfis de usuário no Supabase
 * Funções para buscar, atualizar perfil e fazer upload de fotos
 */

import { createClient } from '@/lib/supabase/client'
import type {
  UserProfile,
  UserProfileInsert,
  UserProfileUpdate,
} from '@/types/database'

/**
 * Busca o perfil do usuário autenticado
 */
export async function getUserProfile(): Promise<{
  data: UserProfile | null
  error: Error | null
}> {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error('Erro de autenticação:', authError)
      throw new Error(`Erro de autenticação: ${authError.message}`)
    }

    if (!user) {
      throw new Error('Usuário não autenticado. Faça login para continuar.')
    }

    console.log('Buscando perfil para usuário:', user.id)

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Erro ao buscar perfil no banco:', error)

      // Se o perfil não existe, criar um novo
      if (error.code === 'PGRST116') {
        console.log('Perfil não encontrado. Criando novo perfil...')
        const { data: newProfile, error: createError } = await createUserProfile(
          {
            id: user.id,
            full_name: user.email || null,
          },
        )
        if (createError) {
          console.error('Erro ao criar perfil:', createError)
          throw createError
        }
        console.log('Perfil criado com sucesso:', newProfile)
        return { data: newProfile, error: null }
      }

      // Outros erros do Supabase
      throw new Error(`Erro do banco de dados: ${error.message || error.code || 'desconhecido'}`)
    }

    console.log('Perfil encontrado:', profile)
    return { data: profile, error: null }
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    const errorMessage =
      error instanceof Error
        ? error.message
        : JSON.stringify(error) || 'Erro desconhecido ao buscar perfil'
    return {
      data: null,
      error: new Error(errorMessage),
    }
  }
}

/**
 * Cria um novo perfil de usuário
 */
export async function createUserProfile(
  data: UserProfileInsert,
): Promise<{ data: UserProfile | null; error: Error | null }> {
  try {
    const supabase = createClient()

    console.log('Criando perfil com dados:', data)

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error('Erro do Supabase ao criar perfil:', error)
      throw new Error(
        `Erro ao criar perfil: ${error.message || error.code || 'desconhecido'}. Verifique se a tabela user_profiles existe no Supabase.`,
      )
    }

    return { data: profile, error: null }
  } catch (error) {
    console.error('Erro ao criar perfil:', error)
    const errorMessage =
      error instanceof Error
        ? error.message
        : JSON.stringify(error) || 'Erro desconhecido ao criar perfil'
    return {
      data: null,
      error: new Error(errorMessage),
    }
  }
}

/**
 * Atualiza o perfil do usuário autenticado
 */
export async function updateUserProfile(
  data: UserProfileUpdate,
): Promise<{ data: UserProfile | null; error: Error | null }> {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update(data)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error

    return { data: profile, error: null }
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Erro desconhecido'),
    }
  }
}

/**
 * Faz upload de uma foto de perfil
 * @param file - Arquivo de imagem (JPG, PNG, WebP)
 * @returns URL pública da foto ou erro
 */
export async function uploadProfilePhoto(file: File): Promise<{
  data: { url: string; path: string } | null
  error: Error | null
}> {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo inválido. Use JPG, PNG ou WebP.')
    }

    // Validar tamanho (2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB em bytes
    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. O tamanho máximo é 2MB.')
    }

    // Gerar nome único para o arquivo
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`

    // Fazer upload para o Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) throw uploadError

    // Obter URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from('profile-photos').getPublicUrl(fileName)

    return {
      data: {
        url: publicUrl,
        path: uploadData.path,
      },
      error: null,
    }
  } catch (error) {
    console.error('Erro ao fazer upload da foto:', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Erro desconhecido'),
    }
  }
}

/**
 * Deleta a foto de perfil atual do usuário
 */
export async function deleteProfilePhoto(photoPath: string): Promise<{
  data: boolean
  error: Error | null
}> {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Deletar do storage
    const { error: deleteError } = await supabase.storage
      .from('profile-photos')
      .remove([photoPath])

    if (deleteError) throw deleteError

    // Atualizar perfil para remover a URL
    await updateUserProfile({ photo_url: null })

    return { data: true, error: null }
  } catch (error) {
    console.error('Erro ao deletar foto:', error)
    return {
      data: false,
      error: error instanceof Error ? error : new Error('Erro desconhecido'),
    }
  }
}

/**
 * Gera iniciais do nome para usar como avatar
 */
export function getInitials(name: string | null): string {
  if (!name) return '?'

  const parts = name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }

  return (
    parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase()
  )
}
