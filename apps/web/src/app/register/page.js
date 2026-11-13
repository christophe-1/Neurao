'use client'

import { registerSchema } from '@neurao/shared'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import PasswordInput from '@/components/PasswordInput'
import { register } from '@/lib/api'

const FIELD_ERRORS = {
  firstName: 'Le prénom est obligatoire',
  lastName: 'Le nom est obligatoire',
  email: 'Adresse email invalide',
  password: 'Le mot de passe doit contenir entre 15 et 64 caractères',
}

/** Sign-up form, checked with the same Zod schema as the API before sending. */
export default function RegisterPage() {
  const router = useRouter()
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    setServerError('')

    const result = registerSchema.safeParse(values)
    if (!result.success) {
      const fieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        fieldErrors[field] = FIELD_ERRORS[field]
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      await register(result.data)
      router.push('/login')
    } catch (error) {
      setServerError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <h1>Créer un compte</h1>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="firstName">Prénom</label>
        <input id="firstName" name="firstName" autoComplete="given-name" />
        {errors.firstName && <p className="form-error">{errors.firstName}</p>}

        <label htmlFor="lastName">Nom</label>
        <input id="lastName" name="lastName" autoComplete="family-name" />
        {errors.lastName && <p className="form-error">{errors.lastName}</p>}

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" />
        {errors.email && <p className="form-error">{errors.email}</p>}

        <label htmlFor="password">Mot de passe</label>
        <PasswordInput id="password" name="password" autoComplete="new-password" />
        {errors.password && <p className="form-error">{errors.password}</p>}

        {serverError && (
          <p className="form-error" role="alert">
            {serverError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Création...' : 'Créer mon compte'}
        </button>
      </form>

      <p>
        Déjà un compte ?{' '}
        <Link href="/login" className="text-link">
          Se connecter
        </Link>
      </p>
    </main>
  )
}
