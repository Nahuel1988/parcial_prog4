import { Link } from 'react-router-dom'
import type { ProductReadFull } from '../types/api'

interface ProductCardProps {
  product: ProductReadFull
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="surface-card p-5 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,82,56,0.12)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{product.nombre}</h3>
          <p className="mt-2 text-sm text-slate-600">{product.descripcion ?? 'Sin descripción'}</p>
        </div>
        <span
          className={['status-pill', 'min-w-[92px]', 'text-center', 'px-3', product.disponible ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-100 text-orange-900'].join(' ')}
        >
          {product.disponible ? 'Disponible' : 'No disponible'}
        </span>
      </div>
      <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-slate-700">
        <span className="rounded-full bg-[#f3f7f0] px-3 py-1.5 font-semibold text-[#23432d]">${product.precio_base.toFixed(2)}</span>
        <span className="rounded-full bg-[#f3f7f0] px-3 py-1.5 text-slate-600">Stock {product.stock_cantidad}</span>
      </div>
      <Link to={`/detalle/${product.id}`} className="primary-btn w-full justify-center">
        Ver detalle
      </Link>
    </article>
  )
}
