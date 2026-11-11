import { DataTypes } from 'sequelize'
import sequelize from '../sequelize.js'

const Role = sequelize.define(
  'Role',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    label: { type: DataTypes.STRING(50), allowNull: false },
  },
  { tableName: 'roles' },
)

export default Role
