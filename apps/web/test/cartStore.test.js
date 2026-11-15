import { beforeEach, describe, expect, it } from 'vitest'
import { useCartStore } from '@/lib/cartStore'

const focus = { id: 52, name: 'Focus', unitPriceCents: 1990, image: null, stock: 3 }

describe('cartStore', () => {
  beforeEach(() => {
    // Arrange : chaque test part d'un panier vide
    useCartStore.setState({ items: [] })
  })

  it('additionne les quantités quand on ajoute deux fois le même produit', () => {
    // Act
    useCartStore.getState().addItem(focus, 2)
    useCartStore.getState().addItem(focus, 3)

    // Assert
    const items = useCartStore.getState().items
    expect(items.length).toBe(1)
    expect(items[0].quantity).toBe(5)
  })

  it('ne dépasse jamais 10 articles du même produit', () => {
    // Act
    useCartStore.getState().addItem(focus, 8)
    useCartStore.getState().addItem(focus, 8)

    // Assert
    expect(useCartStore.getState().items[0].quantity).toBe(10)
  })
})
