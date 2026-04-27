import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { createUser, listRoles, listUsers, updateUser } from '../lib/api'
import type { UserCreate, UserRead } from '../types/api'

interface UsersPageProps {
  isAdmin: boolean
}

interface UserFormState {
  nombre: string
  apellido: string
  email: string
  password: string
  rol_id: number | null
  activo: boolean
}

const initialFormState: UserFormState = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  rol_id: null,
  activo: true,
}

export function UsersPage({ isAdmin }: UsersPageProps) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<UserFormState>(initialFormState)

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => listUsers(0, 50),
  })

  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: () => listRoles(),
  })

  const createMutation = useMutation({
    mutationFn: (payload: UserCreate) => createUser(payload),
    onSuccess: async () => {
      setForm(initialFormState)
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, activo }: { id: number; activo: boolean }) =>
      updateUser(id, { activo: !activo }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    createMutation.mutate({
      rol_id: form.rol_id,
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim() || null,
      email: form.email.trim(),
      password: form.password,
      activo: form.activo,
    })
  }

  if (!isAdmin) {
    return (
      <section className="surface-panel p-6">
        <h2 className="mb-3 text-2xl font-semibold text-slate-900">Usuarios</h2>
        <p className="text-sm text-slate-600">
          Esta vista es parte del panel de administración. Iniciá sesión con una cuenta administrativa para gestionar usuarios.
        </p>
      </section>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
      <section className="surface-panel p-6">
        <h2 className="mb-2 text-2xl font-semibold text-slate-900">Alta de usuario</h2>
        <p className="mb-6 text-sm text-slate-600">Administrá roles y usuarios para el panel de ventas.</p>

        <form className="space-y-3" onSubmit={onSubmit}>
          <TextInput
            label="Nombre"
            value={form.nombre}
            onChange={(value) => setForm((prev) => ({ ...prev, nombre: value }))}
            required
          />
          <TextInput
            label="Apellido"
            value={form.apellido}
            onChange={(value) => setForm((prev) => ({ ...prev, apellido: value }))}
          />
          <TextInput
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
            required
          />
          <TextInput
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
            required
          />

          <label className="block text-sm font-medium text-slate-700">
            <span>Rol</span>
            <select
              value={form.rol_id ?? ''}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  rol_id: event.target.value ? Number(event.target.value) : null,
                }))
              }
              className="input-surface mt-2 w-full"
            >
              <option value="">Sin rol</option>
              {rolesQuery.data?.map((roleItem) => (
                <option key={roleItem.id} value={roleItem.id}>
                  {roleItem.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary)]"
              checked={form.activo}
              onChange={(event) => setForm((prev) => ({ ...prev, activo: event.target.checked }))}
            />
            Activo
          </label>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="primary-btn w-full disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {createMutation.isPending ? 'Guardando...' : 'Crear usuario'}
          </button>
        </form>

        {createMutation.isError && (
          <p className="mt-3 rounded-lg bg-rose-100 px-3 py-2 text-sm font-medium text-rose-700">
            Error: {createMutation.error.message}
          </p>
        )}
        {createMutation.isSuccess && (
          <p className="mt-3 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700">
            Usuario creado con éxito.
          </p>
        )}
      </section>

      <section className="surface-panel p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Listado de usuarios</h2>
            <p className="text-sm text-slate-600">Revisá y activá o desactivá cuentas existentes.</p>
          </div>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
          >
            Refrescar
          </button>
        </div>

        {usersQuery.isPending && (
          <p className="rounded-xl bg-sky-100 px-4 py-3 text-sm font-medium text-sky-700">Cargando usuarios...</p>
        )}

        {usersQuery.isError && (
          <p className="rounded-xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-700">
            Error: {usersQuery.error.message}
          </p>
        )}

        {usersQuery.isSuccess && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-2 py-2">ID</th>
                  <th className="px-2 py-2">Nombre</th>
                  <th className="px-2 py-2">Email</th>
                  <th className="px-2 py-2">Activo</th>
                  <th className="px-2 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usersQuery.data.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100">
                    <td className="px-2 py-2">{user.id}</td>
                    <td className="px-2 py-2">{`${user.nombre} ${user.apellido ?? ''}`.trim()}</td>
                    <td className="px-2 py-2">{user.email}</td>
                    <td className="px-2 py-2">{user.activo ? 'Sí' : 'No'}</td>
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                        onClick={() => toggleActiveMutation.mutate({ id: user.id, activo: user.activo })}
                      >
                        {user.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

interface TextInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}

function TextInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: TextInputProps) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-cyan-500/30 transition focus:ring-4"
      />
    </label>
  )
}
