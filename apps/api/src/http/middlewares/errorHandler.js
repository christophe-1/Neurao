import { HTTP_STATUS } from '../httpStatus.js'

/**
 * Last middleware: Express 5 sends here any error that a controller did not handle.
 * Logs the details for the developer and answers a neutral 500 to the client.
 */
export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error)
  }

  // Remplacé par un journal applicatif plus tard (règle ESLint no-console)
  console.error(error)

  return res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ message: 'Erreur interne du serveur' })
}
