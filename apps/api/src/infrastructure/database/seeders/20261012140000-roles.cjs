'use strict'

const roles = [
  { code: 'customer', label: 'Client' },
  { code: 'manager', label: 'Gestionnaire' },
  { code: 'admin', label: 'Administrateur' },
]

module.exports = {
  async up(queryInterface) {
    const now = new Date()
    await queryInterface.bulkInsert(
      'roles',
      roles.map((role) => ({ ...role, created_at: now, updated_at: now })),
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', {
      code: { [Sequelize.Op.in]: roles.map((role) => role.code) },
    })
  },
}
