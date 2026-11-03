export default async function getProduct(productRepository, id) {
  const product = await productRepository.findById(id)
  if (product === null || !product.isActive) {
    return null
  }
  return product
}
