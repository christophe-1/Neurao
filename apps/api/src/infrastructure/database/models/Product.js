import { DataTypes } from 'sequelize'
import sequelize from '../sequelize.js'

const Product = sequelize.define(
  'Product',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    reference: { type: DataTypes.STRING(32), allowNull: false },
    name: { type: DataTypes.STRING(100), allowNull: false },
    slug: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    unitPriceCents: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    vatRateBp: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false },
    image: { type: DataTypes.STRING(255), allowNull: true },
    stock: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  { tableName: 'products' },
)

export default Product
