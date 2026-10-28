import getProduct from '../../application/products/getProduct.js'
import listProducts from '../../application/products/listProducts.js'
import { HTTP_STATUS } from '../httpStatus.js'

export default class ProductController {
  constructor(productRepository) {
    this.productRepository = productRepository
  }

  async getOne(req, res) {
    const id = Number(req.params.id)
    const product = await getProduct(this.productRepository, id)
    if (product === null) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Produit introuvable' })
    }
    return res.status(HTTP_STATUS.OK).json(product)
  }

  async getAll(req, res) {
    const filters = {
      category: req.query.category,
      search: req.query.search,
    }
    const products = await listProducts(this.productRepository, filters)
    return res.status(HTTP_STATUS.OK).json(products)
  }
}
