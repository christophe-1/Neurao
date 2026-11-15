import { randomBytes } from 'node:crypto'
import redisClient from '../redis/client.js'

const SESSION_ID_BYTES = 32
const SESSION_TTL_SECONDS = 7200

/** Stores sessions in Redis under the key session:<id>, for 2 hours. */
export default class RedisSessionRepository {
  /** Opens a session and returns its random id (64 hexadecimal characters). */
  async create({ userId, role }) {
    const sessionId = randomBytes(SESSION_ID_BYTES).toString('hex')
    await redisClient.set(`session:${sessionId}`, JSON.stringify({ userId, role }), {
      EX: SESSION_TTL_SECONDS,
    })
    return sessionId
  }

  /** Returns { userId, role } for this session id, or null if it does not exist or has expired. */
  async findById(sessionId) {
    const value = await redisClient.get(`session:${sessionId}`)
    if (value === null) {
      return null
    }
    return JSON.parse(value)
  }

  /** Deletes the session, so its id can no longer be used. */
  async delete(sessionId) {
    await redisClient.del(`session:${sessionId}`)
  }
}
