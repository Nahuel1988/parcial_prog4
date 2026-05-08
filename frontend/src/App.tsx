import { Link } from 'react-router-dom'
import { NavLink, Route, Routes } from 'react-router-dom'
import { ProductDetailPage } from './features/products/ProductDetailPage'
import { ProductsPage } from './features/products/ProductsPage'
import { CategoriesPage } from './features/categories/CategoriesPage'
import { IngredientsPage } from './features/ingredients/IngredientsPage'

function App() {
  // Minimal app for Domain 2 (Catálogo de Productos)
  // Auth and user management removed for domain-focused UI.
  const isAdmin = true

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
            <NavLink to="/" className="secondary-btn text-sm">
              Productos
            </NavLink>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 pb-4">
          <NavItem to="/">Productos</NavItem>
          <NavItem to="/categorias">Categorías</NavItem>
          <NavItem to="/ingredientes">Ingredientes</NavItem>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<ProductsPage isAdmin={isAdmin} />} />
          <Route path="/detalle/:id" element={<ProductDetailPage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/ingredientes" element={<IngredientsPage />} />
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
