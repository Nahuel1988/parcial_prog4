import type { IngredientRead } from '../../types/api'
import { apiGet } from '../../lib/api'

export async function listIngredients(): Promise<IngredientRead[]> {
  return apiGet<IngredientRead[]>('/ingredientes/')
}

export async function getIngredient(id: number): Promise<IngredientRead> {
  return apiGet<IngredientRead>(`/ingredientes/${id}`)
}
