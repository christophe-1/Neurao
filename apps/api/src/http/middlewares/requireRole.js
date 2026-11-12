import { HTTP_STATUS } from '../httpStatus.js'

/**
 * Creates a middleware that only lets users with one of the allowed roles through.
 * Must be placed after requireAuth, which fills req.session.
 *
 * @param {string[]} allowedRoles - Roles allowed to continue, for example ['admin'].
 * @returns {Function} Middleware that answers 403 when the user's role is not allowed.
 */
export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.session.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Accès refusé' })
    }

    return next()
  }
}
