import { orderSchema } from '@neurao/shared'
import placeOrder from '../../application/orders/placeOrder.js'
import { HTTP_STATUS } from '../httpStatus.js'

/** Answers the HTTP requests about orders. */
export default class OrderController {
  constructor(productRepository, orderRepository) {
    this.productRepository = productRepository
    this.orderRepository = orderRepository
  }

  /**
   * Places an order for the logged-in user.
   * Answers 400 for invalid data and 409 if the product is not for sale or the stock is too low.
   */
  async create(req, res) {
    const result = orderSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Données de commande invalides' })
    }

    const order = await placeOrder(
      this.productRepository,
      this.orderRepository,
      req.session.userId,
      result.data,
    )
    if (order === null) {
      return res
        .status(HTTP_STATUS.CONFLICT)
        .json({ message: 'Produit indisponible ou stock insuffisant' })
    }

    return res.status(HTTP_STATUS.CREATED).json(order)
  }
}
