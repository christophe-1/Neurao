import { randomBytes } from 'node:crypto'
import redisClient from '../redis/client.js'

const SESSION_ID_BYTES = 32
const SESSION_TTL_SECONDS = 7200

export default class RedisSessionRepository {
  async create({ userId, role }) {
    const sessionId = randomBytes(SESSION_ID_BYTES).toString('hex')
    await redisClient.set(`session:${sessionId}`, JSON.stringify({ userId, role }), {
      EX: SESSION_TTL_SECONDS,
    })
    return sessionId
  }

  async findById(sessionId) {
    const value = await redisClient.get(`session:${sessionId}`)
    if (value === null) {
      return null
    }
    return JSON.parse(value)
  }
}
