import { randomBytes } from 'node:crypto'

const ORDER_NUMBER_BYTES = 4

/**
 * Places an order for the products of the cart, delivered to one address (payment comes later: status pending).
 * Prices are read from the database, never from the request.
 * Returns null if one product is not for sale or its stock is too low.
 */
export default async function placeOrder(productRepository, orderRepository, userId, data) {
  const lines = []
  let productsTotalCents = 0

  for (const item of data.items) {
    const product = await productRepository.findById(item.productId)
    if (product === null || !product.isAvailable() || product.stock < item.quantity) {
      return null
    }
    lines.push({ product: product, quantity: item.quantity })
    productsTotalCents = productsTotalCents + product.unitPriceCents * item.quantity
  }

  const shippingMethod = await orderRepository.findDefaultShippingMethod()
  const totalCents = productsTotalCents + shippingMethod.priceCents
  const order = await orderRepository.create({
    number: `NEU-${randomBytes(ORDER_NUMBER_BYTES).toString('hex').toUpperCase()}`,
    userId,
    lines,
    shippingMethod,
    totalCents,
    address: data,
  })
  return order
}
