import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { createProduct, listProducts } from '../lib/api'
import type { ProductCreate } from '../types/api'
import { ProductCard } from '../components/ProductCard'

interface ProductFormState {
  nombre: string
  descripcion: string
  precio_base: string
  imagenes_url: string
  stock_cantidad: string
  disponible: boolean
}

const initialForm: ProductFormState = {
  nombre: '',
  descripcion: '',
  precio_base: '0',
  imagenes_url: '',
  stock_cantidad: '0',
  disponible: true,
}

interface ProductsPageProps {
  isAdmin: boolean
}

export function ProductsPage({ isAdmin }: ProductsPageProps) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<ProductFormState>(initialForm)

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: () => listProducts(0, 20),
  })

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      setForm(initialForm)
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload: ProductCreate = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      precio_base: Number(form.precio_base),
      imagenes_url: form.imagenes_url.trim() || null,
      stock_cantidad: Number(form.stock_cantidad),
      disponible: form.disponible,
    }

    createMutation.mutate(payload)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <section className="surface-panel p-6">
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-semibold text-slate-900">Alta de producto</h2>
          <p className="text-sm text-slate-600">
            {isAdmin
              ? 'Modo administrador: cargá productos y mantené el inventario actualizado.'
              : 'No tenés permisos para crear productos. Usá Ventas para comprar.'}
          </p>
        </div>

        {isAdmin ? (
          <>
            <form className="space-y-4" onSubmit={onSubmit}>
              <TextInput
                label="Nombre"
                value={form.nombre}
                onChange={(value) => setForm((prev) => ({ ...prev, nombre: value }))}
                required
              />
              <TextInput
                label="Descripción"
                value={form.descripcion}
                onChange={(value) => setForm((prev) => ({ ...prev, descripcion: value }))}
              />
              <TextInput
                label="Precio base"
                type="number"
                step="0.01"
                value={form.precio_base}
                onChange={(value) => setForm((prev) => ({ ...prev, precio_base: value }))}
                required
              />
              <TextInput
                label="Imagen URL"
                value={form.imagenes_url}
                onChange={(value) => setForm((prev) => ({ ...prev, imagenes_url: value }))}
              />
              <TextInput
                label="Stock"
                type="number"
                value={form.stock_cantidad}
                onChange={(value) => setForm((prev) => ({ ...prev, stock_cantidad: value }))}
                required
              />

              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                  checked={form.disponible}
                  onChange={(event) => setForm((prev) => ({ ...prev, disponible: event.target.checked }))}
                />
                Disponible
              </label>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="primary-btn w-full disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {createMutation.isPending ? 'Guardando...' : 'Crear producto'}
              </button>
            </form>

            {createMutation.isError && (
              <p className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-medium text-orange-900">
                Error: {createMutation.error.message}
              </p>
            )}
            {createMutation.isSuccess && (
              <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
                Producto creado con éxito.
              </p>
            )}
          </>
        ) : (
          <div className="surface-card p-5 text-sm text-slate-700">
            <p className="mb-3">No tenés permisos para crear productos en este modo.</p>
            <Link to="/ventas" className="primary-btn w-full justify-center">
              Ir a Ventas
            </Link>
          </div>
        )}
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Listado de productos</h2>
            <p className="text-sm text-slate-600">Explorá el catálogo e ingresá nuevos productos según necesites.</p>
          </div>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
          >
            Refrescar
          </button>
        </div>

        {productsQuery.isPending && (
          <p className="rounded-2xl bg-[#eef9f1] px-4 py-3 text-sm font-semibold text-[#27603f]">Cargando productos...</p>
        )}

        {productsQuery.isError && (
          <p className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-900">
            Error: {productsQuery.error.message}
          </p>
        )}

        {productsQuery.isSuccess && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {productsQuery.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
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
  step?: string
  required?: boolean
}

function TextInput({
  label,
  value,
  onChange,
  type = 'text',
  step,
  required = false,
}: TextInputProps) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        type={type}
        step={step}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-cyan-500/30 transition focus:ring-4"
      />
    </label>
  )
}
