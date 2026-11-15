import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProductCard from '@/components/ProductCard'

describe('ProductCard', () => {
  it('affiche le nom, l’âge, le prix en euros et le lien vers la fiche', () => {
    // Arrange
    const product = {
      id: 52,
      name: 'Focus',
      description: 'Gélules pour enfants dès 11 ans.',
      unitPriceCents: 1990,
      stock: 10,
    }

    // Act
    render(<ProductCard product={product} />)

    // Assert
    expect(screen.getByRole('heading', { name: 'Focus' })).toBeTruthy()
    expect(screen.getByText('dès 11 ans')).toBeTruthy()
    expect(screen.getByText(/19,90/)).toBeTruthy()
    expect(screen.getByRole('link').getAttribute('href')).toBe('/products/52')
  })
})
