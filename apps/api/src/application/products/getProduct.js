/** Returns one product, or null if it does not exist or is deactivated. */
export default async function getProduct(productRepository, id) {
  const product = await productRepository.findById(id)
  if (product === null || !product.isActive) {
    return null
  }
  return product
}
