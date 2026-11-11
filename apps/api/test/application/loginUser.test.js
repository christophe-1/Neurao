import bcrypt from 'bcrypt'
import { describe, expect, it, vi } from 'vitest'
import loginUser from '../../src/application/auth/loginUser.js'

const credentials = {
  email: 'jean.dupont@example.com',
  password: 'soleil-du-matin-2026',
}

const existingUser = {
  id: 1,
  email: credentials.email,
  passwordHash: await bcrypt.hash(credentials.password, 10),
  role: 'customer',
}

function createFakeUserRepository(user) {
  return {
    findByEmail: vi.fn(async () => user),
  }
}

function createFakeSessionRepository() {
  return {
    create: vi.fn(async () => 'fake-session-id'),
  }
}

describe('loginUser', () => {
  it('refuse un email inconnu sans créer de session', async () => {
    // Arrange
    const fakeUserRepository = createFakeUserRepository(null)
    const fakeSessionRepository = createFakeSessionRepository()

    // Act
    const result = await loginUser(fakeUserRepository, fakeSessionRepository, credentials)

    // Assert
    expect(result).toBe(null)
    expect(fakeSessionRepository.create).not.toHaveBeenCalled()
  })

  it('refuse un mauvais mot de passe sans créer de session', async () => {
    // Arrange
    const fakeUserRepository = createFakeUserRepository(existingUser)
    const fakeSessionRepository = createFakeSessionRepository()

    // Act
    const result = await loginUser(fakeUserRepository, fakeSessionRepository, {
      ...credentials,
      password: 'mauvais-mot-de-passe',
    })

    // Assert
    expect(result).toBe(null)
    expect(fakeSessionRepository.create).not.toHaveBeenCalled()
  })

  it("crée une session avec l'id et le rôle quand le mot de passe est bon", async () => {
    // Arrange
    const fakeUserRepository = createFakeUserRepository(existingUser)
    const fakeSessionRepository = createFakeSessionRepository()

    // Act
    const result = await loginUser(fakeUserRepository, fakeSessionRepository, credentials)

    // Assert
    expect(fakeSessionRepository.create).toHaveBeenCalledWith({ userId: 1, role: 'customer' })
    expect(result.sessionId).toBe('fake-session-id')
  })
})
