import { HTTP_STATUS } from '../httpStatus.js'

// Filet de sécurité : Express 5 envoie ici toute erreur qu'un contrôleur n'a pas traitée
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
