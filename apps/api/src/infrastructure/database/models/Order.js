import { DataTypes } from 'sequelize'
import sequelize from '../sequelize.js'

const Order = sequelize.define(
  'Order',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    number: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    status: { type: DataTypes.STRING(20), allowNull: false },
    shippingCostCents: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    totalCents: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    shippingName: { type: DataTypes.STRING(200), allowNull: false },
    shippingAddress: { type: DataTypes.STRING(255), allowNull: false },
    shippingPostalCode: { type: DataTypes.STRING(10), allowNull: false },
    shippingCity: { type: DataTypes.STRING(100), allowNull: false },
    shippingCountryCode: { type: DataTypes.CHAR(2), allowNull: false },
    billingName: { type: DataTypes.STRING(200), allowNull: false },
    billingAddress: { type: DataTypes.STRING(255), allowNull: false },
    billingPostalCode: { type: DataTypes.STRING(10), allowNull: false },
    billingCity: { type: DataTypes.STRING(100), allowNull: false },
    billingCountryCode: { type: DataTypes.CHAR(2), allowNull: false },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    shippingMethodId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  { tableName: 'orders' },
)

export default Order
