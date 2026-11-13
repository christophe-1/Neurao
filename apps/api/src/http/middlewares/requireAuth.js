import { HTTP_STATUS } from '../httpStatus.js'
import { SESSION_COOKIE_NAME } from '../sessionCookie.js'

/**
 * Checks that the user is logged in.
 * Answers 401 if the session cookie is missing or the session no longer exists.
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
