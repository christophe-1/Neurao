import Category from './Category.js'
import Product from './Product.js'

Category.hasMany(Product, { foreignKey: 'categoryId' })
Product.belongsTo(Category, { foreignKey: 'categoryId' })

export { Category, Product }
