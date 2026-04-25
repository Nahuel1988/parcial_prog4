import { Link } from 'react-router-dom'
import type { ProductReadFull } from '../types/api'

interface ProductCardProps {
  product: ProductReadFull
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{product.nombre}</h3>
        <span
          className={[
            'rounded-full px-2 py-1 text-xs font-semibold',
            product.disponible ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700',
          ].join(' ')}
        >
          {product.disponible ? 'Disponible' : 'No disponible'}
        </span>
      </div>
      <p className="mb-3 text-sm text-slate-600">{product.descripcion ?? 'Sin descripcion'}</p>
      <div className="mb-3 flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded bg-slate-100 px-2 py-1">${product.precio_base.toFixed(2)}</span>
        <span className="rounded bg-slate-100 px-2 py-1">Stock: {product.stock_cantidad}</span>
      </div>
      <Link
        to={`/detalle/${product.id}`}
        className="inline-flex rounded-full bg-cyan-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-cyan-500"
      >
        Ver detalle
      </Link>
    </article>
  )
}
