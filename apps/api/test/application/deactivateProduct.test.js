import { describe, expect, it, vi } from 'vitest'
import deactivateProduct from '../../src/application/products/deactivateProduct.js'

function createFakeProductRepository(product) {
  return {
    findById: vi.fn(async () => product),
    deactivate: vi.fn(async () => {}),
  }
}

describe('deactivateProduct', () => {
  it('renvoie false et ne modifie rien si le produit est introuvable', async () => {
    // Arrange
    const fakeProductRepository = createFakeProductRepository(null)

    // Act
    const result = await deactivateProduct(fakeProductRepository, 999)

    // Assert
    expect(result).toBe(false)
    expect(fakeProductRepository.deactivate).not.toHaveBeenCalled()
  })

  it('désactive un produit existant', async () => {
    // Arrange
    const fakeProductRepository = createFakeProductRepository({ id: 52, isActive: true })

    // Act
    const result = await deactivateProduct(fakeProductRepository, 52)

    // Assert
    expect(result).toBe(true)
    expect(fakeProductRepository.deactivate).toHaveBeenCalledWith(52)
  })
})
