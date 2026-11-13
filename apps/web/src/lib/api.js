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

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message)
  }

  return data
}

export function login(credentials) {
  return postJson('/api/auth/login', credentials)
}

export function register(user) {
  return postJson('/api/auth/register', user)
}
