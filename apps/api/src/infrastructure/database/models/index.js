import Category from './Category.js'
import Product from './Product.js'
import Role from './Role.js'
import User from './User.js'

Category.hasMany(Product, { foreignKey: 'categoryId' })
Product.belongsTo(Category, { foreignKey: 'categoryId' })

Role.hasMany(User, { foreignKey: 'roleId' })
User.belongsTo(Role, { foreignKey: 'roleId' })

export { Category, Product, Role, User }
