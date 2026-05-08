import type {
  ApiError,
  LoginRequest,
  LoginResponse,
  OrderCreate,
  OrderReadFull,
  ProductCreate,
  ProductReadFull,
  RoleRead,
  UserCreate,
  UserRead,
  UserUpdate,
} from '../types/api'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`)
  if (!response.ok) {
    throw await toError(response)
  }
  return (await response.json()) as T
}

export async function apiPost<TRequest, TResponse>(
  path: string,
  payload: TRequest,
): Promise<TResponse> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw await toError(response)
  }

  return (await response.json()) as TResponse
}

export async function apiPatch<TRequest, TResponse>(
  path: string,
  payload: TRequest,
): Promise<TResponse> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw await toError(response)
  }

  return (await response.json()) as TResponse
}

export async function listProducts(offset = 0, limit = 20): Promise<ProductReadFull[]> {
  return apiGet<ProductReadFull[]>(`/productos/?offset=${offset}&limit=${limit}`)
}

export async function getProduct(id: number): Promise<ProductReadFull> {
  return apiGet<ProductReadFull>(`/productos/${id}`)
}

export async function createProduct(payload: ProductCreate): Promise<ProductReadFull> {
  return apiPost<ProductCreate, ProductReadFull>('/productos/', payload)
}

// Domain 2 focused API: keep core HTTP helpers and product endpoints only.

async function toError(response: Response): Promise<Error> {
  let message = `HTTP ${response.status}`

  try {
    const data = (await response.json()) as ApiError
    if (typeof data.detail === 'string') {
      message = data.detail
    }
    if (Array.isArray(data.detail) && data.detail[0]?.msg) {
      message = data.detail[0].msg
    }
  } catch {
    // keep default HTTP message when backend body is not JSON.
  }

  return new Error(message)
}
