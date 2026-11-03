import { describe, expect, it } from 'vitest'
import Product from '../../src/domain/Product.js'

const validData = {
  id: 58,
  reference: 'NEU-D3',
  name: 'D3',
  slug: 'd3',
  description: 'Gouttes pour enfants dès 4 ans.',
  unitPriceCents: 1490,
  vatRateBp: 550,
  image: '/images/products/d3.png',
  stock: 10,
  isActive: true,
  categoryId: 1,
}

describe('Product', () => {
  it('crée un produit à partir de données valides', () => {
    const product = new Product(validData)

    expect(product.name).toBe('D3')
    expect(product.unitPriceCents).toBe(1490)
  })

  it('refuse un prix négatif', () => {
    expect(() => new Product({ ...validData, unitPriceCents: -1 })).toThrow()
  })

  it('refuse un prix non entier', () => {
    expect(() => new Product({ ...validData, unitPriceCents: 14.9 })).toThrow()
  })

  it('accepte un prix à 0', () => {
    expect(() => new Product({ ...validData, unitPriceCents: 0 })).not.toThrow()
  })

  it('refuse un stock négatif', () => {
    expect(() => new Product({ ...validData, stock: -1 })).toThrow()
  })

  it('refuse un stock non entier', () => {
    expect(() => new Product({ ...validData, stock: 2.5 })).toThrow()
  })

  it('accepte un stock à 0', () => {
    expect(() => new Product({ ...validData, stock: 0 })).not.toThrow()
  })

  it('refuse un isActive qui n’est pas un booléen', () => {
    expect(() => new Product({ ...validData, isActive: 'oui' })).toThrow(
      'isActive doit être vrai ou faux',
    )
  })

  it('est disponible quand il est actif et en stock', () => {
    // Arrange
    const product = new Product(validData)

    // Act
    const result = product.isAvailable()

    // Assert
    expect(result).toBe(true)
  })

  it("n'est pas disponible quand le stock est à 0", () => {
    // Arrange
    const product = new Product({ ...validData, stock: 0 })

    // Act
    const result = product.isAvailable()

    // Assert
    expect(result).toBe(false)
  })

  it("n'est pas disponible quand le produit est inactif", () => {
    // Arrange
    const product = new Product({ ...validData, isActive: false })

    // Act
    const result = product.isAvailable()

    // Assert
    expect(result).toBe(false)
  })
})
