import { DataTypes } from 'sequelize'
import sequelize from '../sequelize.js'

const ShippingMethod = sequelize.define(
  'ShippingMethod',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    priceCents: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { tableName: 'shipping_methods' },
)

export default ShippingMethod
