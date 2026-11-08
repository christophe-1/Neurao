import { DataTypes } from 'sequelize'
import sequelize from '../sequelize.js'

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    firstName: { type: DataTypes.STRING(100), allowNull: false },
    lastName: { type: DataTypes.STRING(100), allowNull: false },
    roleId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  { tableName: 'users' },
)

export default User
