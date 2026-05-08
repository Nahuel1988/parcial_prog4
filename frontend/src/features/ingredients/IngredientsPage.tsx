import { useQuery } from '@tanstack/react-query'
import { listIngredients } from './api'

export function IngredientsPage() {
  const query = useQuery({ queryKey: ['ingredients'], queryFn: () => listIngredients() })

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Ingredientes</h2>
        <p className="text-sm text-slate-600">Listado de ingredientes usados en el catálogo.</p>
      </div>

      {query.isPending && (
        <p className="rounded-2xl bg-[#eef9f1] px-4 py-3 text-sm font-semibold text-[#27603f]">Cargando ingredientes...</p>
      )}

      {query.isError && (
        <p className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-900">Error: {query.error.message}</p>
      )}

      {query.isSuccess && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {query.data.map((it) => (
            <article key={it.id} className="surface-card p-4">
              <h3 className="font-semibold text-slate-900">{it.nombre}</h3>
              <p className="mt-2 text-sm text-slate-700">{it.descripcion ?? 'Sin descripción'}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
