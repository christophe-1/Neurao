import listCategories from '../../application/categories/listCategories.js'
import { HTTP_STATUS } from '../httpStatus.js'

export default class CategoryController {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository
  }

  async getAll(req, res) {
    const categories = await listCategories(this.categoryRepository)
    return res.status(HTTP_STATUS.OK).json(categories)
  }
}
