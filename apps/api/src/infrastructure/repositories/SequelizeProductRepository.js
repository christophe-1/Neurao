import Product from '../../domain/Product.js'
import { Product as ProductModel } from '../database/models/index.js'

export default class SequelizeProductRepository {
  async findAll() {
    const lignes = await ProductModel.findAll({
      where: { isActive: true },
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
