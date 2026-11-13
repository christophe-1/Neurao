import { describe, expect, it, vi } from 'vitest'
import { requireRole } from '../../src/http/middlewares/requireRole.js'

function createFakeResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  }
}

describe('requireRole', () => {
  it('refuse un client sur une route réservée aux admins', () => {
    // Arrange
    const vigile = requireRole(['admin'])
    const req = { session: { userId: 1, role: 'customer' } }
    const res = createFakeResponse()
    const next = vi.fn()

    // Act
    vigile(req, res, next)

    // Assert
    expect(res.status).toHaveBeenCalledWith(403)
    expect(next).not.toHaveBeenCalled()
  })

  it('laisse passer un admin', () => {
    // Arrange
    const vigile = requireRole(['admin'])
    const req = { session: { userId: 2, role: 'admin' } }
    const res = createFakeResponse()
    const next = vi.fn()

    // Act
    vigile(req, res, next)

    // Assert
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })
})
