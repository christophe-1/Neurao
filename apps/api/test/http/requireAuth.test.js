import { describe, expect, it, vi } from 'vitest'
import { requireAuth } from '../../src/http/middlewares/requireAuth.js'

const validSession = { userId: 1, role: 'customer' }

function createFakeSessionRepository(session) {
  return {
    findById: vi.fn(async () => session),
  }
}

function createFakeResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  }
}

describe('requireAuth', () => {
  it('refuse une requête sans cookie de session', async () => {
    // Arrange
    const fakeSessionRepository = createFakeSessionRepository(validSession)
    const req = { cookies: {} }
    const res = createFakeResponse()
    const next = vi.fn()

    // Act
    await requireAuth(fakeSessionRepository)(req, res, next)

    // Assert
    expect(res.status).toHaveBeenCalledWith(401)
    expect(fakeSessionRepository.findById).not.toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })

  it('refuse un cookie dont la session est introuvable', async () => {
    // Arrange
    const fakeSessionRepository = createFakeSessionRepository(null)
    const req = { cookies: { sid: 'session-inconnue' } }
    const res = createFakeResponse()
    const next = vi.fn()

    // Act
    await requireAuth(fakeSessionRepository)(req, res, next)

    // Assert
    expect(fakeSessionRepository.findById).toHaveBeenCalledWith('session-inconnue')
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('laisse passer une session valide et la range dans req.session', async () => {
    // Arrange
    const fakeSessionRepository = createFakeSessionRepository(validSession)
    const req = { cookies: { sid: 'session-valide' } }
    const res = createFakeResponse()
    const next = vi.fn()

    // Act
    await requireAuth(fakeSessionRepository)(req, res, next)

    // Assert
    expect(req.session).toEqual(validSession)
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })
})
