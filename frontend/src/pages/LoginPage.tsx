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
    <section className="surface-panel mx-auto max-w-md p-7">
      <div className="mb-6">
        <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#3d6b4a]">Acceso al panel</p>
        <h2 className="text-3xl font-semibold text-slate-900">Iniciar sesión</h2>
        <p className="mt-3 text-sm text-slate-600">Ingresá con tu email y contraseña para gestionar tu cuenta y pedidos.</p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        <label className="block text-sm font-medium text-slate-700">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="input-surface mt-2 w-full"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="input-surface mt-2 w-full"
          />
        </label>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="primary-btn w-full disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {mutation.isPending ? 'Validando...' : 'Iniciar sesión'}
        </button>
      </form>

      {mutation.isError && (
        <p className="mt-5 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-medium text-orange-900">
          Error: {mutation.error instanceof Error ? mutation.error.message : 'No se pudo iniciar sesión'}
        </p>
      )}
    </section>
  )
}
