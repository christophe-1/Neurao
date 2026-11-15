/**
 * Activates a product so it appears again in the catalogue.
 * Returns false if the product does not exist.
 */
export default async function activateProduct(productRepository, id) {
  const product = await productRepository.findById(id)
  if (product === null) {
    return false
  }

  await productRepository.activate(id)
  return true
}
