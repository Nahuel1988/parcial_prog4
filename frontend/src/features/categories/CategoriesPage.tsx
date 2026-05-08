import { useQuery } from '@tanstack/react-query'
import { listCategories } from './api'

export function CategoriesPage() {
  const query = useQuery({ queryKey: ['categories'], queryFn: () => listCategories() })

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Categorías</h2>
        <p className="text-sm text-slate-600">Listado de categorías del catálogo.</p>
      </div>

      {query.isPending && (
        <p className="rounded-2xl bg-[#eef9f1] px-4 py-3 text-sm font-semibold text-[#27603f]">Cargando categorías...</p>
      )}

      {query.isError && (
        <p className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-900">Error: {query.error.message}</p>
      )}

      {query.isSuccess && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {query.data.map((cat) => (
            <article key={cat.id} className="surface-card p-4">
              <h3 className="font-semibold text-slate-900">{cat.nombre}</h3>
              <p className="mt-2 text-sm text-slate-700">{cat.descripcion ?? 'Sin descripción'}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
