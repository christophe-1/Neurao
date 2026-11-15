/** Returns every product, active or not, for the back-office. */
export default async function listAllProducts(productRepository) {
  const products = await productRepository.findAllForAdmin()
  return products
}
