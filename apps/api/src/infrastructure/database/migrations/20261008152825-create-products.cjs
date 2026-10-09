'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      reference: { type: Sequelize.STRING(32), allowNull: false, unique: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      slug: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      unit_price_cents: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      vat_rate_bp: { type: Sequelize.SMALLINT.UNSIGNED, allowNull: false },
      image: { type: Sequelize.STRING(255), allowNull: true },
      stock: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('products')
  },
}
