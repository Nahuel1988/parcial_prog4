import type { CategoryRead } from '../../types/api'
import { apiGet } from '../../lib/api'

export async function listCategories(): Promise<CategoryRead[]> {
  return apiGet<CategoryRead[]>('/categorias/')
}

export async function getCategory(id: number): Promise<CategoryRead> {
  return apiGet<CategoryRead>(`/categorias/${id}`)
}
