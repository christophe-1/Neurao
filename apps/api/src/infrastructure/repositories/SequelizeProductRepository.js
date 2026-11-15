import { Op } from 'sequelize'
import Product from '../../domain/Product.js'
import { Category as CategoryModel, Product as ProductModel } from '../database/models/index.js'

/** Reads and updates products in MySQL with Sequelize. */
export default class SequelizeProductRepository {
  /**
   * Returns one page of active products and the total count, with optional category and search filters.
   */
  async findAll(filters) {
    const where = { isActive: true }
    if (filters.search) {
      where.name = { [Op.like]: `%${filters.search}%` }
    }
    const categoryWhere = filters.category ? { slug: filters.category } : undefined

    const { count, rows } = await ProductModel.findAndCountAll({
      where,
      include: [{ model: CategoryModel, attributes: [], where: categoryWhere }],
      order: [['name', 'ASC']],
      limit: filters.limit,
      offset: filters.offset,
    })
    return {
      products: rows.map((row) => new Product(row)),
      total: count,
    }
  }

  /** Returns the product with this id, active or not, or null. */
  async findById(id) {
    const row = await ProductModel.findByPk(id)
    if (row === null) {
      return null
    }
    return new Product(row)
  }

  /** Hides a product from the catalogue (is_active = 0) instead of deleting it. */
  async deactivate(id) {
    await ProductModel.update({ isActive: false }, { where: { id } })
  }
}
