import { HTTP_STATUS } from '../httpStatus.js'

/**
 * Checks that the logged-in user has one of the allowed roles, otherwise answers 403.
 * Use it after requireAuth.
 */
export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.session.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Accès refusé' })
    }

    return next()
  }
}
