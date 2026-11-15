'use client'

import { QUANTITY_MAX } from '@neurao/shared'
import { useState } from 'react'
import { useCartStore } from '@/lib/cartStore'

/** Quantity selector and "Ajouter au panier" button of the product page. */
export default function AddToCart({ product }) {
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const addItem = useCartStore((state) => state.addItem)

  function handleAdd() {
    addItem(product, quantity)
    setMessage('Ajouté au panier')
  }

  return (
    <div className="add-to-cart">
      <div className="quantity-selector">
        <button
          type="button"
          aria-label="Retirer un article"
          onClick={() => setQuantity(quantity - 1)}
          disabled={quantity === 1}
        >
          −
        </button>
        <span>{quantity}</span>
        <button
          type="button"
          aria-label="Ajouter un article"
          onClick={() => setQuantity(quantity + 1)}
          disabled={quantity === QUANTITY_MAX || quantity === product.stock}
        >
          +
        </button>
      </div>

      <button type="button" onClick={handleAdd}>
        Ajouter au panier
      </button>

      <p role="status">{message}</p>
    </div>
  )
}
