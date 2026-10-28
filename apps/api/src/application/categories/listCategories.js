export default async function listCategories(categoryRepository) {
  return await categoryRepository.findAll()
}
