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

export interface ApiError {
  detail?: string | { msg?: string }[]
}
