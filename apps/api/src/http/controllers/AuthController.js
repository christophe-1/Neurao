import { loginSchema, registerSchema } from '@neurao/shared'
import loginUser from '../../application/auth/loginUser.js'
import registerUser from '../../application/auth/registerUser.js'
import { HTTP_STATUS } from '../httpStatus.js'
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from '../sessionCookie.js'

export default class AuthController {
  constructor(userRepository, sessionRepository) {
    this.userRepository = userRepository
    this.sessionRepository = sessionRepository
  }

  async register(req, res) {
    const result = registerSchema.safeParse(req.body)
    if (!result.success) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Données d'inscription invalides" })
    }

    const user = await registerUser(this.userRepository, result.data)
    if (user === null) {
      return res.status(HTTP_STATUS.CONFLICT).json({ message: 'Cet email est déjà utilisé' })
    }

    return res.status(HTTP_STATUS.CREATED).json(user.toPublic())
  }

  async login(req, res) {
    const result = loginSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Données de connexion invalides' })
    }

    const session = await loginUser(this.userRepository, this.sessionRepository, result.data)
    if (session === null) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Email ou mot de passe incorrect' })
    }

    res.cookie(SESSION_COOKIE_NAME, session.sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: SESSION_MAX_AGE_MS,
    })
    return res.status(HTTP_STATUS.OK).json(session.user.toPublic())
  }

  /**
   * Sends back the logged-in user's session (userId and role).
   * Only works behind requireAuth, which fills req.session.
   */
  me(req, res) {
    return res.status(HTTP_STATUS.OK).json(req.session)
  }
}
