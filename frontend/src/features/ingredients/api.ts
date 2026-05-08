import type { IngredientRead, IngredientCreate } from '../../types/api'
import { apiGet, apiPost } from '../../lib/api'

export async function listIngredients(): Promise<IngredientRead[]> {
  return apiGet<IngredientRead[]>('/ingredientes/')
}

export async function getIngredient(id: number): Promise<IngredientRead> {
  return apiGet<IngredientRead>(`/ingredientes/${id}`)
}

export async function createIngredient(payload: IngredientCreate): Promise<IngredientRead> {
  return apiPost<IngredientCreate, IngredientRead>('/ingredientes/', payload)
}
