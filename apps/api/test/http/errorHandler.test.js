import { describe, expect, it, vi } from 'vitest'
import { errorHandler } from '../../src/http/middlewares/errorHandler.js'

describe('errorHandler', () => {
  it('renvoie une erreur 500 neutre sans dévoiler le détail', () => {
    // Arrange
    const error = new Error('Access denied for user neurao_app')
    const req = {}
    const res = {
      headersSent: false,
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }
    const next = vi.fn()

    // Act
    errorHandler(error, req, res, next)

    // Assert
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Erreur interne du serveur',
    })
    expect(next).not.toHaveBeenCalled()
  })
})
