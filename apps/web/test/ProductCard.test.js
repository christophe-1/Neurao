import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProductCard from '@/components/ProductCard'

describe('ProductCard', () => {
  it('affiche le nom, le prix en euros et le lien vers la fiche', () => {
    // Act
    render(<ProductCard id={52} name="Focus" unitPriceCents={1990} />)

    // Assert
    expect(screen.getByRole('heading', { name: 'Focus' })).toBeTruthy()
    expect(screen.getByText(/19,90/)).toBeTruthy()
    expect(screen.getByRole('link').getAttribute('href')).toBe('/products/52')
  })
})
