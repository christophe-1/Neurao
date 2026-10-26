import Category from '../../domain/Category.js'
import { Category as CategoryModel } from '../database/models/index.js'

export default class SequelizeCategoryRepository {
  async findAll() {
    const lignes = await CategoryModel.findAll({
      order: [
        ['position', 'ASC'],
        ['name', 'ASC'],
      ],
    })
    return lignes.map((ligne) => new Category(ligne))
  }
}
