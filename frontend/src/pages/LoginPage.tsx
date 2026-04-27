import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { getUser, login } from '../lib/api'
import type { LoginRequest, UserRead } from '../types/api'

export interface LoggedUser extends UserRead {
  access_token: string
}

interface LoginPageProps {
  onLogin: (user: LoggedUser) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const loginResponse = await login(payload)
      const user = await getUser(loginResponse.user_id)
      return {
        ...user,
        access_token: loginResponse.access_token,
      } as LoggedUser
    },
    onSuccess: (user) => {
      onLogin(user)
    },
  })

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate({ email, password })
  }

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-slate-900">Iniciar sesión</h2>
      <p className="mb-6 text-sm text-slate-600">Ingresá con tu email y contraseña para ver tus compras.</p>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm font-medium text-slate-700">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-cyan-500/30 transition focus:ring-4"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-cyan-500/30 transition focus:ring-4"
          />
        </label>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-xl bg-cyan-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {mutation.isPending ? 'Validando...' : 'Iniciar sesión'}
        </button>
      </form>

      {mutation.isError && (
        <p className="mt-4 rounded-lg bg-rose-100 px-3 py-2 text-sm font-medium text-rose-700">
          Error: {mutation.error instanceof Error ? mutation.error.message : 'No se pudo iniciar sesión'}
        </p>
      )}
    </section>
  )
}
