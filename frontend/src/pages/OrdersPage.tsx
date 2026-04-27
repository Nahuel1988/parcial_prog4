import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createOrder, listOrders, listProducts, listUsers } from '../lib/api'
import type { OrderCreate, ProductReadFull, UserRead, UserRead as CurrentUser } from '../types/api'

interface OrdersPageProps {
  currentUser: CurrentUser
}

interface CartProduct {
  producto_id: number
  nombre: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export function OrdersPage({ currentUser }: OrdersPageProps) {
  const queryClient = useQueryClient()
  const [selectedUserId, setSelectedUserId] = useState<number | null>(currentUser.id)
  const [notes, setNotes] = useState('')
  const [cart, setCart] = useState<CartProduct[]>([])

  const isAdmin = currentUser.rol_id === 1

  useEffect(() => {
    if (!isAdmin) {
      setSelectedUserId(currentUser.id)
    }
  }, [currentUser, isAdmin])

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: () => listProducts(0, 50),
  })

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => listUsers(0, 50),
    enabled: isAdmin,
  })

  const ordersQuery = useQuery({
    queryKey: ['orders', selectedUserId],
    queryFn: () => listOrders(50, selectedUserId ?? undefined),
  })

  const createMutation = useMutation({
    mutationFn: (payload: OrderCreate) => createOrder(payload),
    onSuccess: async () => {
      setCart([])
      setNotes('')
      await queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.subtotal, 0),
    [cart],
  )

  const canSubmitOrder = cart.length > 0 && selectedUserId !== null

  const handleAddToCart = (product: ProductReadFull) => {
    setCart((current) => {
      const existing = current.find((item) => item.producto_id === product.id)
      if (existing) {
        return current.map((item) =>
          item.producto_id === product.id
            ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.precio_unitario }
            : item,
        )
      }

      return [
        ...current,
        {
          producto_id: product.id,
          nombre: product.nombre,
          cantidad: 1,
          precio_unitario: product.precio_base,
          subtotal: product.precio_base,
        },
      ]
    })
  }

  const updateCartQuantity = (productId: number, value: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.producto_id === productId
            ? {
                ...item,
                cantidad: value,
                subtotal: value * item.precio_unitario,
              }
            : item,
        )
        .filter((item) => item.cantidad > 0),
    )
  }

  const removeFromCart = (productId: number) => {
    setCart((current) => current.filter((item) => item.producto_id !== productId))
  }

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmitOrder) {
      return
    }

    createMutation.mutate({
      usuario_id: selectedUserId ?? undefined,
      notas: notes.trim() || null,
      items: cart.map((item) => ({ producto_id: item.producto_id, cantidad: item.cantidad })),
    })
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Ventas</h2>
            <p className="text-sm text-slate-600">
              {isAdmin
                ? 'Panel de ventas de administrador: creá pedidos y revisá el historial de pedidos.'
                : 'Tus compras. Armá el carrito como usuario conectado y enviá el pedido con tu cuenta.'}
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
            {isAdmin ? 'Administrador' : 'Usuario'}
          </span>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_440px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-base font-semibold text-slate-900">Crear nuevo pedido</h3>
          <form className="space-y-4" onSubmit={submitOrder}>
            {isAdmin ? (
            <label className="block text-sm font-medium text-slate-700">
              <span>Usuario</span>
              <select
                value={selectedUserId ?? ''}
                onChange={(event) => setSelectedUserId(event.target.value ? Number(event.target.value) : null)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-cyan-500/30 transition focus:ring-4"
              >
                <option value="">Selecciona un usuario</option>
                {usersQuery.data?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nombre} {user.apellido ?? ''} {user.activo ? '' : '(inactivo)'}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Usuario:</p>
              <p>{currentUser.nombre} {currentUser.apellido ?? ''}</p>
              <p className="text-slate-600">El pedido se registrará con esta cuenta.</p>
            </div>
          )}

            <label className="block text-sm font-medium text-slate-700">
              <span>Notas</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-cyan-500/30 transition focus:ring-4"
              />
            </label>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">Carrito</p>
                <span className="text-sm text-slate-500">Total: ${cartTotal.toFixed(2)}</span>
              </div>

              {cart.length === 0 ? (
                <p className="rounded-xl bg-slate-100 px-3 py-3 text-sm text-slate-600">No hay productos en el carrito.</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.producto_id} className="rounded-2xl border border-slate-200 bg-white p-3">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{item.nombre}</p>
                          <p className="text-sm text-slate-600">${item.precio_unitario.toFixed(2)} c/u</p>
                        </div>
                        <button
                          type="button"
                          className="rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                          onClick={() => removeFromCart(item.producto_id)}
                        >
                          Eliminar
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-700">
                        <label className="flex items-center gap-2">
                          Cantidad:
                          <input
                            type="number"
                            min={1}
                            value={item.cantidad}
                            onChange={(event) => updateCartQuantity(item.producto_id, Number(event.target.value))}
                            className="w-20 rounded-xl border border-slate-300 bg-white px-2 py-1 text-sm outline-none"
                          />
                        </label>
                        <span>Subtotal: ${item.subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmitOrder || createMutation.isPending}
              className="w-full rounded-xl bg-cyan-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {createMutation.isPending ? 'Enviando pedido...' : 'Crear pedido'}
            </button>

            {createMutation.isError && (
              <p className="rounded-lg bg-rose-100 px-3 py-2 text-sm font-medium text-rose-700">
                Error: {createMutation.error.message}
              </p>
            )}
            {createMutation.isSuccess && (
              <p className="rounded-lg bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700">
                Pedido creado con éxito.
              </p>
            )}
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-base font-semibold text-slate-900">Productos disponibles</h3>
          {productsQuery.isPending && (
            <p className="rounded-xl bg-sky-100 px-4 py-3 text-sm font-medium text-sky-700">Cargando productos...</p>
          )}
          {productsQuery.isError && (
            <p className="rounded-xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-700">
              Error: {productsQuery.error.message}
            </p>
          )}
          {productsQuery.isSuccess && (
            <div className="grid gap-3 sm:grid-cols-2">
              {productsQuery.data.map((product) => (
                <article key={product.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900">{product.nombre}</p>
                    <span className="text-xs text-slate-500">Stock: {product.stock_cantidad}</span>
                  </div>
                  <p className="mb-3 text-sm text-slate-600">${product.precio_base.toFixed(2)}</p>
                  <button
                    type="button"
                    disabled={!product.disponible}
                    className="rounded-full bg-cyan-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-300"
                    onClick={() => handleAddToCart(product)}
                  >
                    {product.disponible ? 'Agregar al carrito' : 'No disponible'}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Historial de pedidos</h3>
            <p className="text-sm text-slate-600">Revisá pedidos recientes y su estado.</p>
          </div>
          <button
            type="button"
            className="rounded-full bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['orders'] })}
          >
            Refrescar pedidos
          </button>
        </div>

        {ordersQuery.isPending && (
          <p className="rounded-xl bg-sky-100 px-4 py-3 text-sm font-medium text-sky-700">Cargando pedidos...</p>
        )}

        {ordersQuery.isError && (
          <p className="rounded-xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-700">
            Error: {ordersQuery.error.message}
          </p>
        )}

        {ordersQuery.isSuccess && ordersQuery.data.length === 0 && (
          <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">No hay pedidos registrados aún.</p>
        )}

        {ordersQuery.isSuccess && ordersQuery.data.length > 0 && (
          <div className="space-y-4">
            {ordersQuery.data.map((order) => (
              <article key={order.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">Pedido #{order.id}</p>
                    <p className="text-sm text-slate-600">Usuario: {getUserName(usersQuery.data ?? [], order.usuario_id)}</p>
                  </div>
                  <div className="space-x-2 text-sm">
                    <span className="rounded-full bg-white px-2 py-1 text-slate-700">{order.estado}</span>
                    <span className="rounded-full bg-white px-2 py-1 text-slate-700">${order.total.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">Items: {order.items.length}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function getUserName(users: UserRead[], userId?: number | null) {
  if (!userId) {
    return 'No asignado'
  }
  const user = users.find((item) => item.id === userId)
  return user ? `${user.nombre} ${user.apellido ?? ''}`.trim() : `Usuario ${userId}`
}
