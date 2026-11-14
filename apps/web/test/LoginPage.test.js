import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import LoginPage from '@/app/login/page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

describe('LoginPage', () => {
  it("affiche le message vague de l'API quand la connexion est refusée", async () => {
    // Arrange
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Email ou mot de passe incorrect' }),
    })
    render(
      <QueryClientProvider client={new QueryClient()}>
        <LoginPage />
      </QueryClientProvider>,
    )
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'camille@example.com' } })
    fireEvent.change(screen.getByLabelText('Mot de passe'), {
      target: { value: 'mauvais-mot-de-passe' },
    })

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

    // Assert
    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toBe('Email ou mot de passe incorrect')
    expect(fetchSpy).toHaveBeenCalledWith('/api/auth/login', expect.anything())
  })
})
