/** Returns every category, sorted for the menu. */
export default async function listCategories(categoryRepository) {
  return await categoryRepository.findAll()
}
