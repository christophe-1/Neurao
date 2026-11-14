'use client'

import { orderSchema } from '@neurao/shared'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'
import { fetchMe, placeOrder } from '@/lib/api'
import { useCartStore } from '@/lib/cartStore'
import formatPrice from '@/lib/formatPrice'

const FIELD_ERRORS = {
  fullName: 'Le nom et le prénom sont obligatoires',
  address: 'L’adresse est obligatoire',
  postalCode: 'Le code postal est obligatoire',
  city: 'La ville est obligatoire',
  countryCode: 'Choisissez un pays de livraison',
}

/** Checkout page: the delivery address, then the order is sent to the API (payment comes later). */
export default function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const { data: me } = useQuery({ queryKey: ['me'], queryFn: fetchMe })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [order, setOrder] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const orderItems = []
    items.forEach((item) => {
      orderItems.push({ productId: item.productId, quantity: item.quantity })
    })

    const values = {
      items: orderItems,
      fullName: formData.get('fullName'),
      address: formData.get('address'),
      postalCode: formData.get('postalCode'),
      city: formData.get('city'),
      countryCode: formData.get('countryCode'),
    }
    setServerError('')

    const result = orderSchema.safeParse(values)
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
      const newOrder = await placeOrder(result.data)
      clearCart()
      setOrder(newOrder)
    } catch (error) {
      setServerError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (order !== null) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <h1>Merci pour votre commande</h1>
          <p>
            Votre commande {order.number} est enregistrée. Total avec la livraison :{' '}
            {formatPrice(order.totalCents)}.
          </p>
          <p>Le paiement en ligne n’est pas encore disponible : la commande attend son paiement.</p>
          <Link href="/products" className="text-link">
            Retour à la gamme
          </Link>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="auth-page">
        <h1>Livraison</h1>
        <p>Votre panier est vide.</p>
        <Link href="/products" className="text-link">
          Voir la gamme
        </Link>
      </main>
    )
  }

  if (me === null) {
    return (
      <main className="auth-page">
        <h1>Livraison</h1>
        <p>Connectez-vous pour valider votre commande. Votre panier est conservé.</p>
        <Link href="/login" className="text-link">
          Se connecter
        </Link>
      </main>
    )
  }

  let subtotal = 0
  items.forEach((item) => {
    subtotal = subtotal + item.unitPriceCents * item.quantity
  })

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Livraison</h1>
        <p>
          {items.length} produit(s) pour {formatPrice(subtotal)}. La livraison Colissimo est ajoutée
          à la validation.
        </p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="fullName">Nom et prénom</label>
          <input id="fullName" name="fullName" autoComplete="name" />
          {errors.fullName && <p className="form-error">{errors.fullName}</p>}

          <label htmlFor="address">Adresse</label>
          <input id="address" name="address" autoComplete="street-address" />
          {errors.address && <p className="form-error">{errors.address}</p>}

          <label htmlFor="postalCode">Code postal</label>
          <input id="postalCode" name="postalCode" autoComplete="postal-code" />
          {errors.postalCode && <p className="form-error">{errors.postalCode}</p>}

          <label htmlFor="city">Ville</label>
          <input id="city" name="city" autoComplete="address-level2" />
          {errors.city && <p className="form-error">{errors.city}</p>}

          <label htmlFor="countryCode">Pays</label>
          <select id="countryCode" name="countryCode" autoComplete="country">
            <option value="FR">France</option>
            <option value="BE">Belgique</option>
            <option value="CH">Suisse</option>
            <option value="LU">Luxembourg</option>
          </select>
          {errors.countryCode && <p className="form-error">{errors.countryCode}</p>}

          {serverError && (
            <p className="form-error" role="alert">
              {serverError}
            </p>
          )}

          <button type="submit" className="button-dark" disabled={isSubmitting}>
            {isSubmitting ? 'Validation...' : 'Valider la commande'}
          </button>
        </form>
      </div>
    </main>
  )
}
