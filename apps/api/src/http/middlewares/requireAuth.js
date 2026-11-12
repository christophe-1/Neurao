import { HTTP_STATUS } from '../httpStatus.js'
import { SESSION_COOKIE_NAME } from '../sessionCookie.js'

/**
 * Builds a middleware that lets the request through only if it carries a valid session.
 *
 * @param {{ findById: (sessionId: string) => Promise<{ userId: number, role: string } | null> }} sessionRepository
 *   Store used to look up the session id read from the cookie.
 * @returns {import('express').RequestHandler} Middleware that answers 401 without a valid
 *   session, or sets `req.session` and calls `next()`.
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
