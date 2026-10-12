const path = require('node:path')

require('dotenv').config({ path: path.resolve(__dirname, '../../../../../.env') })

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env

const baseConfig = {
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  dialect: 'mysql',
  define: { underscored: true },
  // Garde la liste des seeders déjà joués (table SequelizeData), comme SequelizeMeta pour les migrations
  seederStorage: 'sequelize',
}

module.exports = { development: baseConfig }
