const UNAUTHORIZED = 401
const NOT_FOUND = 404

/** Fetches one page of the catalogue. */
export async function fetchProducts(page) {
  const response = await fetch(`/api/products?page=${page}`)

  if (!response.ok) {
    throw new Error('Impossible de charger les produits')
  }

  return response.json()
}

/** Fetches one product, or returns null if the API answers 404. */
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

/** Sends a JSON body with POST and throws an error with the message of the API if it refuses. */
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

/** Logs the user in. The API sets the session cookie. */
export function login(credentials) {
  return postJson('/api/auth/login', credentials)
}

/** Creates a customer account. */
export function register(user) {
  return postJson('/api/auth/register', user)
}

/** Returns the logged-in user (id and role), or null if nobody is logged in. */
export async function fetchMe() {
  const response = await fetch('/api/auth/me')

  if (response.status === UNAUTHORIZED) {
    return null
  }

  if (!response.ok) {
    throw new Error('Impossible de vérifier la session')
  }

  return response.json()
}

/** Logs the user out and deletes the session cookie. */
export async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' })
}
