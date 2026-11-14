import request from 'supertest'
import { describe, expect, it } from 'vitest'
import app from '../../src/app.js'

describe('POST /api/orders', () => {
  it('refuse une commande sans être connecté', async () => {
    // Act
    const response = await request(app).post('/api/orders').send({ productId: 52, quantity: 1 })

    // Assert
    expect(response.status).toBe(401)
  })
})
