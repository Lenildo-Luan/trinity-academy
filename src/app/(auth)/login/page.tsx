'use client'

import { Button, TextInput } from "@/components/atoms";
import { sendOTP } from "../actions";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function Page() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    startTransition(async () => {
      const result = await sendOTP(email);

      if (result.success) {
        setSuccess('Código enviado! Redirecionando...');
        // Redirect to OTP page with email in URL params
        setTimeout(() => {
          router.push(`/otp?email=${encodeURIComponent(email)}`);
        }, 1000);
      } else {
        setError(result.error || 'Falha ao enviar código. Tente novamente.');
      }
    });
  };

  return (
    <>
      <h1 className="sr-only">Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block w-full text-sm/7 font-medium text-gray-950 dark:text-white"
          >
            Email
          </label>
          <TextInput
            type="email"
            id="email"
            name="email"
            required
            className="mt-2"
            disabled={isPending}
          />
        </div>

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

        <Button
          type="submit"
          className="mt-6 w-full"
          disabled={isPending}
        >
          {isPending ? 'Enviando...' : 'Enviar senha de utiliação única'}
        </Button>
      </form>
    </>
  );
}
