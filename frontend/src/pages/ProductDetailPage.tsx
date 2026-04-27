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
      <section className="surface-card p-6 text-orange-900">
        <p className="mb-3 text-sm font-semibold">ID inválido.</p>
        <Link to="/" className="secondary-btn text-sm">
          Volver
        </Link>
      </section>
    )
  }

  return (
    <section className="surface-card p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#3d6b4a]">Producto detalle</p>
          <h2 className="text-3xl font-semibold text-slate-900">#{id}</h2>
        </div>
        <Link to="/" className="secondary-btn text-sm">
          Volver al listado
        </Link>
      </div>

      {detailQuery.isPending && (
        <p className="rounded-2xl bg-[#eef9f1] px-4 py-3 text-sm font-semibold text-[#27603f]">Cargando detalle...</p>
      )}

      {detailQuery.isError && (
        <p className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-900">
          Error: {detailQuery.error.message}
        </p>
      )}

      {detailQuery.isSuccess && (
        <div className="space-y-4 text-sm text-slate-700">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-[#f7faf3] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#3d6b4a]">Precio</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">${detailQuery.data.precio_base.toFixed(2)}</p>
            </div>
            <div className="rounded-2xl bg-[#f7faf3] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#3d6b4a]">Stock</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{detailQuery.data.stock_cantidad}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-[#f7faf3] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#3d6b4a]">Nombre</p>
              <p className="mt-2 font-semibold text-slate-900">{detailQuery.data.nombre}</p>
            </div>
            <div className="rounded-2xl bg-[#f7faf3] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#3d6b4a]">Disponible</p>
              <p className="mt-2 font-semibold text-slate-900">{detailQuery.data.disponible ? 'Sí' : 'No'}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#f7faf3] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#3d6b4a]">Descripción</p>
            <p className="mt-2 text-slate-700">{detailQuery.data.descripcion ?? 'Sin descripción'}</p>
          </div>

          <div className="rounded-2xl bg-[#f7faf3] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#3d6b4a]">Categorías</p>
            <p className="mt-2 text-slate-700">
              {detailQuery.data.categories.length > 0
                ? detailQuery.data.categories.map((item) => item.nombre).join(', ')
                : 'Sin categorías'}
            </p>
          </div>

          <div className="rounded-2xl bg-[#f7faf3] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#3d6b4a]">Ingredientes</p>
            <p className="mt-2 text-slate-700">
              {detailQuery.data.ingredients.length > 0
                ? detailQuery.data.ingredients.map((item) => item.nombre).join(', ')
                : 'Sin ingredientes'}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
