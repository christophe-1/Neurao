import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import RegisterPage from '@/app/register/page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

describe('RegisterPage', () => {
  it("affiche une erreur et n'appelle pas l'API si le mot de passe est trop court", () => {
    // Arrange
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    render(<RegisterPage />)
    fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Camille' } })
    fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Martin' } })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'camille.martin@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'court' } })

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }))

    // Assert
    expect(screen.getByText('Le mot de passe doit contenir entre 15 et 64 caractères')).toBeTruthy()
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
