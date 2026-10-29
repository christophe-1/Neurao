import { productIdSchema, productListQuerySchema } from '@neurao/shared'
import getProduct from '../../application/products/getProduct.js'
import listProducts from '../../application/products/listProducts.js'
import { HTTP_STATUS } from '../httpStatus.js'

export default class ProductController {
  constructor(productRepository) {
    this.productRepository = productRepository
  }

  async getOne(req, res) {
    const result = productIdSchema.safeParse(req.params)
    if (!result.success) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Identifiant de produit invalide' })
    }
    const product = await getProduct(this.productRepository, result.data.id)
    if (product === null) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Produit introuvable' })
    }
    return res.status(HTTP_STATUS.OK).json(product)
  }

  async getAll(req, res) {
    const result = productListQuerySchema.safeParse(req.query)
    if (!result.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Paramètres invalides' })
    }
    const products = await listProducts(this.productRepository, result.data)
    return res.status(HTTP_STATUS.OK).json(products)
  }
}
