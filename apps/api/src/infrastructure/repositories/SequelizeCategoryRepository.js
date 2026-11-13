import Category from '../../domain/Category.js'
import { Category as CategoryModel } from '../database/models/index.js'

export default class SequelizeCategoryRepository {
  async findAll() {
    const rows = await CategoryModel.findAll({
      order: [
        ['position', 'ASC'],
        ['name', 'ASC'],
      ],
    })
    return rows.map((row) => new Category(row))
  }
}
