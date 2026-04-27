import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes } from 'react-router-dom'
import { LoginPage, type LoggedUser } from './pages/LoginPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ProductsPage } from './pages/ProductsPage'
import { UsersPage } from './pages/UsersPage'
import { OrdersPage } from './pages/OrdersPage'
import type { UserRead } from './types/api'

function App() {
  const [currentUser, setCurrentUser] = useState<LoggedUser | null>(() => {
    const raw = localStorage.getItem('currentUser')
    if (!raw) return null
    try {
      return JSON.parse(raw) as LoggedUser
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('currentUser')
    }
  }, [currentUser])

  const isAdmin = currentUser?.rol_id === 1

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#e0f2fe_0%,_#f8fafc_35%,_#f1f5f9_100%)]">
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Parcial Prog4</p>
            <h1 className="font-serif text-2xl font-bold text-slate-900">Panel de Gestión</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentUser ? (
              <>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                  {currentUser.nombre} {currentUser.apellido ?? ''}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentUser(null)}
                  className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  [
                    'rounded-full px-4 py-2 text-sm font-semibold transition',
                    isActive
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  ].join(' ')
                }
              >
                Iniciar sesión
              </NavLink>
            )}
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-3">
          {isAdmin && <NavItem to="/">Productos</NavItem>}
          <NavItem to="/ventas">Ventas</NavItem>
          {isAdmin && <NavItem to="/usuarios">Usuarios</NavItem>}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={setCurrentUser} />} />
          <Route
            path="/"
            element={
              !currentUser ? (
                <LoginPage onLogin={setCurrentUser} />
              ) : isAdmin ? (
                <ProductsPage isAdmin={true} />
              ) : (
                <OrdersPage currentUser={currentUser} />
              )
            }
          />
          <Route path="/detalle/:id" element={<ProductDetailPage />} />
          <Route
            path="/usuarios"
            element={
              !currentUser ? (
                <LoginPage onLogin={setCurrentUser} />
              ) : isAdmin ? (
                <UsersPage />
              ) : (
                <AccessDenied />
              )
            }
          />
          <Route
            path="/ventas"
            element={!currentUser ? <LoginPage onLogin={setCurrentUser} /> : <OrdersPage currentUser={currentUser} />}
          />
        </Routes>
      </main>
    </div>
  )
}

interface NavItemProps {
  to: string
  children: string
}

function NavItem({ to, children }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'rounded-full px-4 py-2 text-sm font-semibold transition',
          isActive
            ? 'bg-cyan-600 text-white shadow-sm'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  )
}

function AccessDenied() {
  return (
    <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">Acceso denegado</h2>
      <p className="text-sm">No tenés permisos para ver esta sección. Iniciá sesión con una cuenta administrativa.</p>
    </section>
  )
}

export default App
