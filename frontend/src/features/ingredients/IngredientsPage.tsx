import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listIngredients, createIngredient } from './api'
import { useState, type FormEvent } from 'react'

export function IngredientsPage() {
  const query = useQuery({ queryKey: ['ingredients'], queryFn: () => listIngredients() })
  const queryClient = useQueryClient()

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [esAlergeno, setEsAlergeno] = useState(false)

  const createMutation = useMutation({
    mutationFn: (payload: { nombre: string; descripcion?: string; es_alergeno?: boolean }) =>
      createIngredient({ nombre: payload.nombre, descripcion: payload.descripcion || null, es_alergeno: payload.es_alergeno }),
    onSuccess: async () => {
      setNombre('')
      setDescripcion('')
      setEsAlergeno(false)
      await queryClient.invalidateQueries({ queryKey: ['ingredients'] })
    },
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return
    createMutation.mutate({ nombre: nombre.trim(), descripcion: descripcion.trim() || undefined, es_alergeno: esAlergeno })
  }

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
          <form onSubmit={onSubmit} className="surface-panel p-4 mb-4">
            <h3 className="font-semibold text-slate-900 mb-2">Nuevo ingrediente</h3>
            <label className="block text-sm font-medium text-slate-700">
              <span>Nombre</span>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700 mt-3">
              <span>Descripción</span>
              <input
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700 mt-3">
              <input type="checkbox" checked={esAlergeno} onChange={(e) => setEsAlergeno(e.currentTarget.checked)} />
              Es alérgeno
            </label>
            <button type="submit" className="primary-btn mt-4" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Guardando...' : 'Crear ingrediente'}
            </button>
          </form>
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
