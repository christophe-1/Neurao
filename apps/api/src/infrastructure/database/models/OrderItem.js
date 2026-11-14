import { DataTypes } from 'sequelize'
import sequelize from '../sequelize.js'

const OrderItem = sequelize.define(
  'OrderItem',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    orderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    quantity: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false },
    unitPriceCents: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    vatRateBp: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false },
    productName: { type: DataTypes.STRING(100), allowNull: false },
  },
  { tableName: 'order_items', timestamps: false },
)

export default OrderItem
