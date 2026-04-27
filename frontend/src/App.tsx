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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(15,82,56,0.12)_0%,_transparent_24%),_radial-gradient(circle_at_20%_20%,_rgba(252,138,64,0.08)_0%,_transparent_18%),_linear-gradient(180deg,_#f7faf6_0%,_#ecf3ef_100%)]">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/85 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#3d6b4a]">Fresh Market Admin</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold text-slate-900">Panel de Gestión</span>
              <span className="brand-pill">Market</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentUser ? (
              <>
                <span className="rounded-full bg-[#ebf5ed] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#2c533c]">
                  {currentUser.nombre} {currentUser.apellido ?? ''}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentUser(null)}
                  className="secondary-btn text-sm"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  [
                    'secondary-btn text-sm',
                    isActive ? 'bg-[#2d6a4f] text-white' : 'bg-[#f7faf3] text-[#1c2921]',
                  ].join(' ')
                }
              >
                Iniciar sesión
              </NavLink>
            )}
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 pb-4">
          {isAdmin && <NavItem to="/">Productos</NavItem>}
          <NavItem to="/ventas">Ventas</NavItem>
          {isAdmin && <NavItem to="/usuarios">Usuarios</NavItem>}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
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
