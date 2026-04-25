import { NavLink, Route, Routes } from 'react-router-dom'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ProductsPage } from './pages/ProductsPage'
import { UsersPage } from './pages/UsersPage'

function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#e0f2fe_0%,_#f8fafc_35%,_#f1f5f9_100%)]">
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Parcial Prog4</p>
            <h1 className="font-serif text-2xl font-bold text-slate-900">Panel de Gestion</h1>
          </div>
          <nav className="flex gap-2">
            <NavItem to="/">Productos</NavItem>
            <NavItem to="/usuarios">Usuarios</NavItem>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/detalle/:id" element={<ProductDetailPage />} />
          <Route path="/usuarios" element={<UsersPage />} />
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

export default App
