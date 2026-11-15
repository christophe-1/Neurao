'use client'

import { QUANTITY_MAX } from '@neurao/shared'
import Link from 'next/link'
import ProductImage from '@/components/ProductImage'
import { useCartStore } from '@/lib/cartStore'
import formatPrice from '@/lib/formatPrice'
import { rangeColor } from '@/lib/productDisplay'

/** Cart page: the products of the cart, their quantity and the subtotal. */
export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const changeQuantity = useCartStore((state) => state.changeQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  if (items.length === 0) {
    return (
      <main>
        <h1>Mon panier</h1>
        <p>Votre panier est vide.</p>
        <Link href="/products" className="text-link">
          Voir la gamme
        </Link>
      </main>
    )
  }

  let subtotal = 0
  items.forEach((item) => {
    subtotal = subtotal + item.unitPriceCents * item.quantity
  })

  return (
    <main>
      <h1>Mon panier</h1>
      <p>{items.length} produit(s)</p>

      <div className="cart">
        <ul className="cart-lines">
          {items.map((item) => (
            <li key={item.productId} className="cart-line">
              <ProductImage src={item.image} alt="" size={96} color={rangeColor(item.name)} />
              <Link href={`/products/${item.productId}`} className="cart-line-name">
                {item.name}
              </Link>
              <div className="quantity-selector">
                <button
                  type="button"
                  aria-label={`Retirer un ${item.name}`}
                  onClick={() => changeQuantity(item.productId, item.quantity - 1)}
                  disabled={item.quantity === 1}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  aria-label={`Ajouter un ${item.name}`}
                  onClick={() => changeQuantity(item.productId, item.quantity + 1)}
                  disabled={item.quantity === QUANTITY_MAX}
                >
                  +
                </button>
              </div>
              <p className="cart-line-price">{formatPrice(item.unitPriceCents * item.quantity)}</p>
              <button
                type="button"
                className="text-button"
                aria-label={`Retirer ${item.name} du panier`}
                onClick={() => removeItem(item.productId)}
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>

        <div className="cart-summary">
          <h2>Récapitulatif</h2>
          <p className="cart-summary-row">
            <span>Sous-total</span>
            <span>{formatPrice(subtotal)}</span>
          </p>
          <p>La livraison est ajoutée à la validation de la commande.</p>
          <Link href="/checkout" className="button">
            Commander
          </Link>
        </div>
      </div>

      <Link href="/products" className="text-link">
        Continuer mes achats
      </Link>
    </main>
  )
}
