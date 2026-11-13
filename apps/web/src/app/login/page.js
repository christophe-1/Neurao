'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import PasswordInput from '@/components/PasswordInput'
import { login } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setError('')
    setIsSubmitting(true)

    try {
      await login({ email: formData.get('email'), password: formData.get('password') })
      router.push('/products')
    } catch (error) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <h1>Connexion</h1>

      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />

        <label htmlFor="password">Mot de passe</label>
        <PasswordInput id="password" name="password" autoComplete="current-password" required />

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p>
        Pas encore de compte ?{' '}
        <Link href="/register" className="text-link">
          Créer un compte
        </Link>
      </p>
    </main>
  )
}
