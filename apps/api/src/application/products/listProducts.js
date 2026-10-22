export default async function listProducts(productRepository) {
  return await productRepository.findAll()
}
