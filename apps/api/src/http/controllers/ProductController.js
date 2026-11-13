import { productIdSchema, productListQuerySchema } from '@neurao/shared'
import deactivateProduct from '../../application/products/deactivateProduct.js'
import getProduct from '../../application/products/getProduct.js'
import listProducts from '../../application/products/listProducts.js'
import { HTTP_STATUS } from '../httpStatus.js'

/** Answers the HTTP requests about products. */
export default class ProductController {
  constructor(productRepository) {
    this.productRepository = productRepository
  }

  /** Sends one product. Answers 400 for an invalid id and 404 if it is not found. */
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

  /**
   * Sends one page of the catalogue, filtered by category or search. Answers 400 for invalid parameters.
   */
  async getAll(req, res) {
    const result = productListQuerySchema.safeParse(req.query)
    if (!result.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Paramètres invalides' })
    }
    const products = await listProducts(this.productRepository, result.data)
    return res.status(HTTP_STATUS.OK).json(products)
  }

  /**
   * Deactivates a product. Answers 204, or 404 if the product does not exist.
   */
  async deactivate(req, res) {
    const result = productIdSchema.safeParse(req.params)
    if (!result.success) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Identifiant de produit invalide' })
    }

    const deactivated = await deactivateProduct(this.productRepository, result.data.id)
    if (!deactivated) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Produit introuvable' })
    }

    return res.status(HTTP_STATUS.NO_CONTENT).end()
  }
}
