/**
 * Deactivates a product so it no longer appears in the catalogue.
 * Returns false if the product does not exist.
 */
export default async function deactivateProduct(productRepository, id) {
  const product = await productRepository.findById(id)
  if (product === null) {
    return false
  }

  await productRepository.deactivate(id)
  return true
}
