import Category from '../../domain/Category.js'
import { Category as CategoryModel } from '../database/models/index.js'

/** Reads categories in MySQL with Sequelize. */
export default class SequelizeCategoryRepository {
  /** Returns every category, sorted by position then by name. */
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
