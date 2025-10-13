'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface ActionResult {
  success: boolean
  error?: string
}

/**
 * Send OTP code to the provided email address
 */
export async function sendOTP(email: string): Promise<ActionResult> {
  if (!email || !email.includes('@')) {
    return {
      success: false,
      error: 'Por favor, forneça um endereço de e-mail válido.',
    }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })

    if (error) {
      console.error('Error sending OTP:', error)
      return {
        success: false,
        error: 'Falha ao enviar código. Tente novamente.',
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error sending OTP:', error)
    return {
      success: false,
      error: 'Ocorreu um erro inesperado. Tente novamente.',
    }
  }
}

/**
 * Resend OTP code to the provided email address
 */
export async function resendOTP(email: string): Promise<ActionResult> {
  // Resending is the same as sending a new OTP
  return sendOTP(email)
}

/**
 * Verify OTP code for the provided email
 */
export async function verifyOTP(
  email: string,
  token: string,
): Promise<ActionResult> {
  if (!email || !email.includes('@')) {
    return {
      success: false,
      error: 'Endereço de e-mail inválido.',
    }
  }

  if (!token || token.length !== 6) {
    return {
      success: false,
      error: 'Código deve ter 6 dígitos.',
    }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (error) {
      console.error('Error verifying OTP:', error)
      return {
        success: false,
        error: 'Código inválido ou expirado. Tente novamente.',
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error verifying OTP:', error)
    return {
      success: false,
      error: 'Ocorreu um erro inesperado. Tente novamente.',
    }
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Error signing out:', error)
  }

  redirect('/login')
}
