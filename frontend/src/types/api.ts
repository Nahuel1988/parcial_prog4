export interface CategoryRead {
  id: number
  nombre: string
}

export interface IngredientRead {
  id: number
  nombre: string
}

export interface ProductReadFull {
  id: number
  nombre: string
  descripcion: string | null
  precio_base: number
  imagenes_url: string | null
  stock_cantidad: number
  disponible: boolean
  categories: CategoryRead[]
  ingredients: IngredientRead[]
}

export interface ProductCreate {
  nombre: string
  descripcion: string | null
  precio_base: number
  imagenes_url: string | null
  stock_cantidad: number
  disponible: boolean
}

export interface UserRead {
  id: number
  rol_id: number | null
  nombre: string
  apellido: string | null
  email: string
  activo: boolean
}

export interface UserCreate {
  rol_id?: number | null
  nombre: string
  apellido?: string | null
  email: string
  password: string
  activo?: boolean
}

export interface UserUpdate {
  rol_id?: number | null
  nombre?: string
  apellido?: string | null
  email?: string
  activo?: boolean
}

export interface RoleRead {
  id: number
  nombre: string
  descripcion: string | null
  activo: boolean
}

export interface OrderItemBase {
  producto_id: number
  cantidad: number
}

export interface OrderCreate {
  usuario_id?: number | null
  notas?: string | null
  items: OrderItemBase[]
}

export interface OrderItemRead {
  id: number
  pedido_id: number
  producto_id: number
  cantidad: number
  precio_unitario: number
  subtotal: number
  created_at: string
}

export interface OrderReadFull {
  id: number
  usuario_id?: number | null
  notas?: string | null
  estado: string
  total: number
  created_at: string
  updated_at: string
  items: OrderItemRead[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user_id: number
  email: string
}

export interface ApiError {
  detail?: string | { msg?: string }[]
}
