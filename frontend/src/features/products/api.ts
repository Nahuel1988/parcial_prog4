export { listProducts, getProduct, createProduct } from '../../lib/api'
import type { ProductCategoryCreate, ProductCategoryRead } from '../../types/api'
import { apiPost } from '../../lib/api'

export async function createProductCategory(payload: ProductCategoryCreate): Promise<ProductCategoryRead> {
	return apiPost<ProductCategoryCreate, ProductCategoryRead>('/producto-categorias/', payload)
}
