import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { getProduct } from '../lib/api'

export function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)

  const detailQuery = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: Number.isInteger(id) && id > 0,
  })

  if (!Number.isInteger(id) || id <= 0) {
    return (
      <section className="rounded-2xl bg-rose-100 p-6 text-rose-700">
        <p className="mb-3 text-sm font-semibold">ID invalido.</p>
        <Link to="/" className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white">
          Volver
        </Link>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Detalle de producto #{id}</h2>
        <Link to="/" className="rounded-full bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700">
          Volver al listado
        </Link>
      </div>

      {detailQuery.isPending && (
        <p className="rounded-xl bg-sky-100 px-4 py-3 text-sm font-medium text-sky-700">Cargando detalle...</p>
      )}

      {detailQuery.isError && (
        <p className="rounded-xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-700">
          Error: {detailQuery.error.message}
        </p>
      )}

      {detailQuery.isSuccess && (
        <div className="space-y-3 text-sm text-slate-700">
          <p>
            <strong className="text-slate-900">Nombre:</strong> {detailQuery.data.nombre}
          </p>
          <p>
            <strong className="text-slate-900">Descripcion:</strong> {detailQuery.data.descripcion ?? 'Sin descripcion'}
          </p>
          <p>
            <strong className="text-slate-900">Precio:</strong> ${detailQuery.data.precio_base.toFixed(2)}
          </p>
          <p>
            <strong className="text-slate-900">Stock:</strong> {detailQuery.data.stock_cantidad}
          </p>
          <p>
            <strong className="text-slate-900">Categorias:</strong>{' '}
            {detailQuery.data.categories.length > 0
              ? detailQuery.data.categories.map((item) => item.nombre).join(', ')
              : 'Sin categorias'}
          </p>
          <p>
            <strong className="text-slate-900">Ingredientes:</strong>{' '}
            {detailQuery.data.ingredients.length > 0
              ? detailQuery.data.ingredients.map((item) => item.nombre).join(', ')
              : 'Sin ingredientes'}
          </p>
        </div>
      )}
    </section>
  )
}
