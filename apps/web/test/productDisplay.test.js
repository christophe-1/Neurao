import { describe, expect, it } from 'vitest'
import { minimumAge, rangeColor } from '@/lib/productDisplay'

describe('rangeColor', () => {
  it('donne la couleur de la gamme à partir du nom du produit', () => {
    // Act
    const color = rangeColor('Flora+ 60 gélules')

    // Assert
    expect(color).toBe('turquoise')
  })

  it('donne miel quand le produit n’appartient à aucune gamme connue', () => {
    // Act
    const color = rangeColor('Zinc+ 30 gélules')

    // Assert
    expect(color).toBe('miel')
  })
})

describe('minimumAge', () => {
  it('trouve l’âge minimum dans la description', () => {
    // Act
    const age = minimumAge('Gommes pour enfants dès 4 ans. 30 gommes.')

    // Assert
    expect(age).toBe('dès 4 ans')
  })

  it('renvoie null quand la description ne donne pas d’âge', () => {
    // Act
    const age = minimumAge('Coffret de trois produits.')

    // Assert
    expect(age).toBeNull()
  })
})
