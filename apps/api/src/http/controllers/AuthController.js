import { registerSchema } from '@neurao/shared'
import registerUser from '../../application/auth/registerUser.js'
import { HTTP_STATUS } from '../httpStatus.js'

export default class AuthController {
  constructor(userRepository) {
    this.userRepository = userRepository
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
}
