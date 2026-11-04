import request from 'supertest'
import { describe, expect, it } from 'vitest'
import app from '../../src/app.js'

describe('GET /api/products', () => {
  it('renvoie la première page du catalogue', async () => {
    // Act
    const response = await request(app).get('/api/products')

    // Assert
    expect(response.status).toBe(200)
    expect(response.body.page).toBe(1)
  })

  it("refuse un identifiant qui n'est pas un nombre", async () => {
    // Act
    const response = await request(app).get('/api/products/abc')

    // Assert
    expect(response.status).toBe(400)
  })
})
