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

export async function listUsers(offset = 0, limit = 20): Promise<UserRead[]> {
  return apiGet<UserRead[]>(`/usuarios/?offset=${offset}&limit=${limit}`)
}

export async function createUser(payload: UserCreate): Promise<UserRead> {
  return apiPost<UserCreate, UserRead>('/usuarios/', payload)
}

export async function updateUser(userId: number, payload: UserUpdate): Promise<UserRead> {
  return apiPatch<UserUpdate, UserRead>(`/usuarios/${userId}`, payload)
}

export async function listRoles(): Promise<RoleRead[]> {
  return apiGet<RoleRead[]>('/roles/')
}

export async function listOrders(limit = 20, usuarioId?: number): Promise<OrderReadFull[]> {
  const query = usuarioId ? `?limit=${limit}&usuario_id=${usuarioId}` : `?limit=${limit}`
  return apiGet<OrderReadFull[]>(`/pedidos/${query}`)
}

export async function createOrder(payload: OrderCreate): Promise<OrderReadFull> {
  return apiPost<OrderCreate, OrderReadFull>('/pedidos/', payload)
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  return apiPost<LoginRequest, LoginResponse>('/auth/login', payload)
}

export async function getUser(id: number): Promise<UserRead> {
  return apiGet<UserRead>(`/usuarios/${id}`)
}

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
