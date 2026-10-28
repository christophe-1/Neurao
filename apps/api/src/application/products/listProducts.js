export default async function listProducts(productRepository, filters) {
  return await productRepository.findAll(filters)
}
