'use strict'

const { categories, products } = require('./data/catalog.json')

module.exports = {
  async up(queryInterface) {
    const now = new Date()

    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkInsert(
        'categories',
        categories.map((category) => ({ ...category, created_at: now, updated_at: now })),
        { transaction },
      )

      // Les id sont attribués par MySQL : on les relit pour relier chaque produit à sa catégorie
      const [rows] = await queryInterface.sequelize.query(
        'SELECT id, slug FROM categories WHERE slug IN (:slugs)',
        { replacements: { slugs: categories.map((category) => category.slug) }, transaction },
      )
      const categoryIdBySlug = Object.fromEntries(rows.map((row) => [row.slug, row.id]))

      await queryInterface.bulkInsert(
        'products',
        products.map(({ category, ...product }) => ({
          ...product,
          category_id: categoryIdBySlug[category],
          created_at: now,
          updated_at: now,
        })),
        { transaction },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    // Les produits d'abord : la clé étrangère RESTRICT interdit de supprimer une catégorie qui en contient
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkDelete(
        'products',
        { reference: { [Sequelize.Op.in]: products.map((product) => product.reference) } },
        { transaction },
      )
      await queryInterface.bulkDelete(
        'categories',
        { slug: { [Sequelize.Op.in]: categories.map((category) => category.slug) } },
        { transaction },
      )
    })
  },
}
