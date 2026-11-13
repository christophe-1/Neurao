import { UniqueConstraintError } from 'sequelize'
import User from '../../domain/User.js'
import { Role as RoleModel, User as UserModel } from '../database/models/index.js'

/** Turns a Sequelize row (with its role) into a User of the domain. */
function toDomain(row) {
  return new User({
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    firstName: row.firstName,
    lastName: row.lastName,
    role: row.Role.code,
  })
}

/** Reads and creates users in MySQL with Sequelize. */
export default class SequelizeUserRepository {
  /** Returns the user with this email, or null. */
  async findByEmail(email) {
    const row = await UserModel.findOne({ where: { email }, include: [RoleModel] })
    if (row === null) {
      return null
    }
    return toDomain(row)
  }

  /**
   * Creates a user with the given role.
   * Returns null if the email is already used (UNIQUE constraint).
   */
  async create({ email, passwordHash, firstName, lastName, role }) {
    const roleRow = await RoleModel.findOne({ where: { code: role } })
    if (roleRow === null) {
      throw new Error(`Rôle "${role}" absent de la table roles : lancer les seeders`)
    }

    try {
      const row = await UserModel.create({
        email,
        passwordHash,
        firstName,
        lastName,
        roleId: roleRow.id,
      })
      return new User({ id: row.id, email, passwordHash, firstName, lastName, role })
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return null
      }
      throw error
    }
  }
}
