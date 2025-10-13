'use client'

import { Button } from "@/components/button";
import { OTPInput } from "@/components/input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect, useRef } from "react";
import { verifyOTP, resendOTP } from "../actions";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const otpInputRef = useRef<HTMLFormElement>(null);

  // Get email from URL params
  const email = searchParams.get('email') || '';

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Redirect to login if no email provided
  useEffect(() => {
    if (!email) {
      router.push('/login');
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = otpValue.trim();

    if (!token || token.length !== 6) {
      setError('Por favor, insira o código de 6 dígitos.');
      return;
    }

    startTransition(async () => {
      const result = await verifyOTP(email, token);

      if (result.success) {
        setSuccess('Código verificado! Redirecionando...');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setError(result.error || 'Código inválido ou expirado. Tente novamente.');
      }
    });
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResending) return;

    setError(null);
    setSuccess(null);
    setIsResending(true);

    const result = await resendOTP(email);

    setIsResending(false);

    if (result.success) {
      setSuccess('Novo código enviado para o seu email!');
      setResendCooldown(60); // 60 second cooldown
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(result.error || 'Falha ao reenviar código. Tente novamente.');
    }
  };

  if (!email) {
    return null; // Will redirect to login
  }

  return (
    <>
      <h1 className="sr-only">Entrar com a senha de utilização única</h1>
      <p className="text-center text-sm/7 text-gray-950 dark:text-white">
        O código de verificação de 6 dígitos foi enviado para{" "}
        <span className="font-semibold">{email}</span>.
      </p>
      <form ref={otpInputRef} onSubmit={handleSubmit} className="mt-6">
        <OTPInput
          maxLength={6}
          name="otp"
          value={otpValue}
          onChange={(value) => setOtpValue(value)}
        />

        {error && (
          <div className="mt-4 rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-md bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-800 dark:text-green-200">
            {success}
          </div>
        )}

        <p className="mt-6 text-center text-sm/7 text-gray-600 dark:text-gray-400">
          Não recebeu o código?{" "}
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendCooldown > 0 || isResending}
            className="font-semibold text-gray-950 underline decoration-gray-950/25 underline-offset-2 hover:decoration-gray-950/50 dark:text-white dark:decoration-white/25 dark:hover:decoration-white/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
          >
            {isResending
              ? 'Reenviando...'
              : resendCooldown > 0
              ? `Aguarde ${resendCooldown}s`
              : 'Peça um novo código'}
          </button>
        </p>
        <Button type="submit" className="mt-6 w-full" disabled={isPending}>
          {isPending ? 'Verificando...' : 'Verificar'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm/7 dark:text-gray-400">
        <Link
          href="/login"
          className="font-semibold text-gray-950 dark:text-white"
        >
          Usar um email diferente
        </Link>
      </p>
    </>
  );
}
