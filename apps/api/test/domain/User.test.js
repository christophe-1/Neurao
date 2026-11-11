import { describe, expect, it } from 'vitest'
import User from '../../src/domain/User.js'

const validData = {
  id: 12,
  email: 'jean.dupont@example.com',
  passwordHash: '$mdpfictifhashepourletest1234$',
  firstName: 'Jean',
  lastName: 'Dupont',
  role: 'customer',
}

describe('User', () => {
  it('crée un utilisateur à partir de données valides', () => {
    const user = new User(validData)

    expect(user.email).toBe('jean.dupont@example.com')
    expect(user.role).toBe('customer')
  })

  it('refuse un rôle inconnu', () => {
    expect(() => new User({ ...validData, role: 'hacker' })).toThrow(
      'role doit être customer, manager ou admin',
    )
  })

  it('accepte le rôle admin', () => {
    expect(() => new User({ ...validData, role: 'admin' })).not.toThrow()
  })

  it("ne montre pas l'empreinte du mot de passe dans sa version publique", () => {
    // Arrange
    const user = new User(validData)

    // Act
    const result = user.toPublic()

    // Assert
    expect(result).not.toHaveProperty('passwordHash')
    expect(result.email).toBe('jean.dupont@example.com')
  })
})
