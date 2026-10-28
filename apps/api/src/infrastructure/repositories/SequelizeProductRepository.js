import { Op } from 'sequelize'
import Product from '../../domain/Product.js'
import { Category as CategoryModel, Product as ProductModel } from '../database/models/index.js'

export default class SequelizeProductRepository {
  async findAll(filters) {
    const where = { isActive: true }
    if (filters.search) {
      where.name = { [Op.like]: `%${filters.search}%` }
    }
    const categoryWhere = filters.category ? { slug: filters.category } : undefined

    const lignes = await ProductModel.findAll({
      where,
      include: [{ model: CategoryModel, attributes: [], where: categoryWhere }],
      order: [['name', 'ASC']],
    })
    return lignes.map((ligne) => new Product(ligne))
  }

  async findById(id) {
    const ligne = await ProductModel.findByPk(id)
    if (ligne === null) {
      return null
    }
    return new Product(ligne)
  }
}
