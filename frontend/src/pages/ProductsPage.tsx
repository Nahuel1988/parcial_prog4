import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
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

export function ProductsPage() {
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

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Alta de producto</h2>
        <p className="mb-4 text-sm text-slate-600">Usa useState para el formulario y useMutation para enviar al backend.</p>

        <form className="space-y-3" onSubmit={onSubmit}>
          <TextInput
            label="Nombre"
            value={form.nombre}
            onChange={(value) => setForm((prev) => ({ ...prev, nombre: value }))}
            required
          />
          <TextInput
            label="Descripcion"
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

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
              checked={form.disponible}
              onChange={(event) => setForm((prev) => ({ ...prev, disponible: event.target.checked }))}
            />
            Disponible
          </label>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full rounded-xl bg-cyan-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {createMutation.isPending ? 'Guardando...' : 'Crear producto'}
          </button>
        </form>

        {createMutation.isError && (
          <p className="mt-3 rounded-lg bg-rose-100 px-3 py-2 text-sm font-medium text-rose-700">
            Error: {createMutation.error.message}
          </p>
        )}
        {createMutation.isSuccess && (
          <p className="mt-3 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700">
            Producto creado con exito.
          </p>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Listado de productos</h2>
          <button
            type="button"
            className="rounded-full bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
          >
            Refrescar
          </button>
        </div>

        {productsQuery.isPending && (
          <p className="rounded-xl bg-sky-100 px-4 py-3 text-sm font-medium text-sky-700">Cargando productos...</p>
        )}

        {productsQuery.isError && (
          <p className="rounded-xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-700">
            Error: {productsQuery.error.message}
          </p>
        )}

        {productsQuery.isSuccess && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
