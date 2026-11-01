const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchProducts(page) {
  const response = await fetch(`${API_URL}/api/products?page=${page}`)

  if (!response.ok) {
    throw new Error('Impossible de charger les produits')
  }

  return response.json()
}
