import { UniqueConstraintError } from 'sequelize'
import User from '../../domain/User.js'
import { Role as RoleModel, User as UserModel } from '../database/models/index.js'

function toDomain(ligne) {
  return new User({
    id: ligne.id,
    email: ligne.email,
    passwordHash: ligne.passwordHash,
    firstName: ligne.firstName,
    lastName: ligne.lastName,
    role: ligne.Role.code,
  })
}

export default class SequelizeUserRepository {
  async findByEmail(email) {
    const ligne = await UserModel.findOne({ where: { email }, include: [RoleModel] })
    if (ligne === null) {
      return null
    }
    return toDomain(ligne)
  }

  async create({ email, passwordHash, firstName, lastName, role }) {
    const roleLigne = await RoleModel.findOne({ where: { code: role } })
    try {
      const ligne = await UserModel.create({
        email,
        passwordHash,
        firstName,
        lastName,
        roleId: roleLigne.id,
      })
      return new User({ id: ligne.id, email, passwordHash, firstName, lastName, role })
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return null
      }
      throw error
    }
  }
}
