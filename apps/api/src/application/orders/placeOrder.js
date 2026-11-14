/**
 * Places an order for one product, delivered to one address (payment comes later: status pending).
 * Prices are read from the database, never from the request.
 * Returns null if the product is not for sale or the stock is too low.
 */
export default async function placeOrder(productRepository, orderRepository, userId, data) {
  const product = await productRepository.findById(data.productId)
  if (product === null || !product.isAvailable() || product.stock < data.quantity) {
    return null
  }
  const shippingMethod = await orderRepository.findDefaultShippingMethod()
  const totalCents = product.unitPriceCents * data.quantity + shippingMethod.priceCents
  const order = await orderRepository.create({
    number: `NEU-${Date.now()}`,
    userId,
    product,
    quantity: data.quantity,
    shippingMethod,
    totalCents,
    address: data,
  })
  return order
}
