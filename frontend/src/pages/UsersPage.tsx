import { useQuery } from '@tanstack/react-query'
import { listUsers } from '../lib/api'

export function UsersPage() {
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => listUsers(0, 20),
  })

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-lg font-bold text-slate-900">Usuarios (useQuery)</h2>

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
              </tr>
            </thead>
            <tbody>
              {usersQuery.data.map((user) => (
                <tr key={user.id} className="border-b border-slate-100">
                  <td className="px-2 py-2">{user.id}</td>
                  <td className="px-2 py-2">{`${user.nombre} ${user.apellido ?? ''}`.trim()}</td>
                  <td className="px-2 py-2">{user.email}</td>
                  <td className="px-2 py-2">{user.activo ? 'Si' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
