import { describe, expect, it, vi } from 'vitest'
import placeOrder from '../../src/application/orders/placeOrder.js'
import Product from '../../src/domain/Product.js'

const focus = new Product({
  id: 52,
  reference: 'NEU-FOCUS-60',
  name: 'Focus',
  slug: 'focus',
  description: 'Gélules pour enfants dès 11 ans.',
  unitPriceCents: 1990,
  vatRateBp: 550,
  image: null,
  stock: 3,
  isActive: true,
  categoryId: 6,
})

const orderData = {
  items: [{ productId: 52, quantity: 2 }],
  fullName: 'Jean Dupont',
  address: '1 rue de la Paix',
  postalCode: '83000',
  city: 'Toulon',
  countryCode: 'FR',
}

function createFakeRepositories(product) {
  const productRepository = { findById: vi.fn(async () => product) }
  const orderRepository = {
    findDefaultShippingMethod: vi.fn(async () => ({ id: 4, name: 'Colissimo', priceCents: 490 })),
    create: vi.fn(async (data) => ({ id: 1, number: data.number, totalCents: data.totalCents })),
  }
  return { productRepository, orderRepository }
}

describe('placeOrder', () => {
  it('ne crée rien si le stock est trop bas', async () => {
    // Arrange
    const { productRepository, orderRepository } = createFakeRepositories(focus)

    // Act
    const order = await placeOrder(productRepository, orderRepository, 7, {
      ...orderData,
      items: [{ productId: 52, quantity: 4 }],
    })

    // Assert
    expect(order).toBe(null)
    expect(orderRepository.create).not.toHaveBeenCalled()
  })

  it('calcule le total avec le prix de la base, jamais avec un prix envoyé par le client', async () => {
    // Arrange
    const { productRepository, orderRepository } = createFakeRepositories(focus)

    // Act
    const order = await placeOrder(productRepository, orderRepository, 7, {
      ...orderData,
      unitPriceCents: 1,
    })

    // Assert
    expect(order.totalCents).toBe(1990 * 2 + 490)
  })
})
