'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_items', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      order_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
      },
      product_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
      },
      quantity: { type: Sequelize.SMALLINT.UNSIGNED, allowNull: false },
      unit_price_cents: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      vat_rate_bp: { type: Sequelize.SMALLINT.UNSIGNED, allowNull: false },
      product_name: { type: Sequelize.STRING(100), allowNull: false },
    })

    await queryInterface.addConstraint('order_items', {
      fields: ['order_id', 'product_id'],
      type: 'unique',
      name: 'order_items_order_id_product_id_unique',
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('order_items')
  },
}
