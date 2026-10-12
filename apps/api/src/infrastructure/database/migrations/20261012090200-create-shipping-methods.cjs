'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shipping_methods', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      price_cents: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('shipping_methods')
  },
}
