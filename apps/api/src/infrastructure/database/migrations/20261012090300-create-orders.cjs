'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      number: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      status: { type: Sequelize.STRING(20), allowNull: false },
      shipping_cost_cents: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      total_cents: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      shipping_name: { type: Sequelize.STRING(200), allowNull: false },
      shipping_address: { type: Sequelize.STRING(255), allowNull: false },
      shipping_postal_code: { type: Sequelize.STRING(10), allowNull: false },
      shipping_city: { type: Sequelize.STRING(100), allowNull: false },
      shipping_country_code: { type: Sequelize.CHAR(2), allowNull: false },
      billing_name: { type: Sequelize.STRING(200), allowNull: false },
      billing_address: { type: Sequelize.STRING(255), allowNull: false },
      billing_postal_code: { type: Sequelize.STRING(10), allowNull: false },
      billing_city: { type: Sequelize.STRING(100), allowNull: false },
      billing_country_code: { type: Sequelize.CHAR(2), allowNull: false },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
      },
      shipping_method_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'shipping_methods', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('orders')
  },
}
