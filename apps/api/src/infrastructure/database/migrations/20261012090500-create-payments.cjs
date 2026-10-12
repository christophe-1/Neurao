'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      provider_reference: { type: Sequelize.STRING(100), allowNull: false },
      amount_cents: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      provider_status: { type: Sequelize.STRING(30), allowNull: false },
      received_at: { type: Sequelize.DATE, allowNull: true },
      order_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('payments')
  },
}
