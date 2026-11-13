const NOT_FOUND = 404

export async function fetchProducts(page) {
  const response = await fetch(`/api/products?page=${page}`)

  if (!response.ok) {
    throw new Error('Impossible de charger les produits')
  }

  return response.json()
}

export async function fetchProduct(id) {
  const response = await fetch(`/api/products/${id}`)

  if (response.status === NOT_FOUND) {
    return null
  }

  if (!response.ok) {
    throw new Error('Impossible de charger le produit')
  }

  return response.json()
}
