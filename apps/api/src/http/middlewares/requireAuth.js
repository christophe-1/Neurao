import { HTTP_STATUS } from '../httpStatus.js'
import { SESSION_COOKIE_NAME } from '../sessionCookie.js'

/**
 * Creates a middleware that only lets logged-in users through.
 *
 * @param {object} sessionRepository - Finds a session in Redis from its id.
 * @returns {Function} Middleware that answers 401 without a valid session,
 *   or saves the session in req.session and calls next().
 */
export function requireAuth(sessionRepository) {
  return async (req, res, next) => {
    const sessionId = req.cookies[SESSION_COOKIE_NAME]
    if (sessionId === undefined) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Authentification requise' })
    }

    const session = await sessionRepository.findById(sessionId)
    if (session === null) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Authentification requise' })
    }

    req.session = session
    return next()
  }
}
