const PAGE_SIZE = 12

/** Returns one page of active products, with the total and the number of pages. */
export default async function listProducts(productRepository, filters) {
  const { products, total } = await productRepository.findAll({
    ...filters,
    limit: PAGE_SIZE,
    offset: (filters.page - 1) * PAGE_SIZE,
  })
  return {
    products,
    total,
    page: filters.page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  }
}
