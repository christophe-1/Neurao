'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'
import { activateProduct, deactivateProduct, fetchAdminProducts } from '@/lib/api'
import formatPrice from '@/lib/formatPrice'

/** One row of the table, with the button that deactivates or activates the product. */
function ProductRow({ product, onToggle }) {
  let stateLabel = 'Inactif'
  let stateClass = 'badge badge-inactive'
  let buttonLabel = 'Activer'
  if (product.isActive) {
    stateLabel = 'Actif'
    stateClass = 'badge badge-active'
    buttonLabel = 'Désactiver'
  }

  return (
    <tr>
      <td className="admin-reference">{product.reference}</td>
      <td>{product.name}</td>
      <td>{formatPrice(product.unitPriceCents)}</td>
      <td>{product.stock}</td>
      <td>
        <span className={stateClass}>{stateLabel}</span>
      </td>
      <td>
        <button
          type="button"
          className="button-secondary"
          aria-label={`${buttonLabel} ${product.name}`}
          onClick={() => onToggle(product)}
        >
          {buttonLabel}
        </button>
      </td>
    </tr>
  )
}

/** Back-office: every product, active or not. Only for admins and managers (the API checks the role). */
export default function AdminPage() {
  const queryClient = useQueryClient()
  const { data, isPending, isError } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchAdminProducts,
  })
  const [error, setError] = useState('')

  async function handleToggle(product) {
    setError('')
    try {
      if (product.isActive) {
        await deactivateProduct(product.id)
      } else {
        await activateProduct(product.id)
      }
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    } catch (error) {
      setError(error.message)
    }
  }

  if (isPending) {
    return <main>Chargement des produits...</main>
  }

  if (isError) {
    return <main>Impossible de charger les produits.</main>
  }

  if (data === null) {
    return (
      <main>
        <h1>Produits</h1>
        <p>Cette page est réservée à l’équipe neuraO.</p>
        <Link href="/login" className="text-link">
          Se connecter
        </Link>
      </main>
    )
  }

  return (
    <main>
      <h1>Produits</h1>
      <p>{data.length} produits. Un produit inactif n’apparaît plus dans la boutique.</p>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Référence</th>
              <th>Nom</th>
              <th>Prix TTC</th>
              <th>Stock</th>
              <th>État</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product) => (
              <ProductRow key={product.id} product={product} onToggle={handleToggle} />
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
