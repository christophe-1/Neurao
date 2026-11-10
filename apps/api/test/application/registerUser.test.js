import { describe, expect, it, vi } from 'vitest'
import registerUser from '../../src/application/auth/registerUser.js'

const validData = {
  email: 'jean.dupont@example.com',
  password: 'soleil-du-matin-2026',
  firstName: 'Jean',
  lastName: 'Dupont',
}

function createFakeRepository(existingUser) {
  return {
    findByEmail: vi.fn(async () => existingUser),
    create: vi.fn(async (data) => data),
  }
}

describe('registerUser', () => {
  it("crée le compte avec l'empreinte du mot de passe, jamais le mot de passe en clair", async () => {
    // Arrange
    const fakeRepository = createFakeRepository(null)

    // Act
    const user = await registerUser(fakeRepository, validData)

    // Assert
    expect(user.passwordHash).not.toBe(validData.password)
    expect(user.passwordHash.startsWith('$2b$10$')).toBe(true)
  })

  it("ne crée rien si l'email est déjà utilisé", async () => {
    // Arrange
    const fakeRepository = createFakeRepository({ email: validData.email })

    // Act
    const user = await registerUser(fakeRepository, validData)

    // Assert
    expect(user).toBe(null)
    expect(fakeRepository.create).not.toHaveBeenCalled()
  })

  it('donne toujours le rôle customer, même si la requête demande admin', async () => {
    // Arrange
    const fakeRepository = createFakeRepository(null)

    // Act
    const user = await registerUser(fakeRepository, { ...validData, role: 'admin' })

    // Assert
    expect(user.role).toBe('customer')
  })
})
