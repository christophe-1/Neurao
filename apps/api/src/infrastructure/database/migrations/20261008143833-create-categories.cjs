'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      slug: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      position: { type: Sequelize.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('categories')
  },
}
