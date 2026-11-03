'use strict'

const shippingMethods = [
  { name: 'Colissimo à domicile', price_cents: 490 },
  { name: 'Point relais', price_cents: 390 },
]

module.exports = {
  async up(queryInterface) {
    const now = new Date()
    await queryInterface.bulkInsert(
      'shipping_methods',
      shippingMethods.map((method) => ({
        ...method,
        is_active: true,
        created_at: now,
        updated_at: now,
      })),
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('shipping_methods', {
      name: { [Sequelize.Op.in]: shippingMethods.map((method) => method.name) },
    })
  },
}
