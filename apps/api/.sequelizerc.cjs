const path = require('node:path')

module.exports = {
    config: path.resolve('src/infrastructure/database/config.cjs'),
    'migrations-path': path.resolve('src/infrastructure/database/migrations'),
    'seeders-path': path.resolve('src/infrastructure/database/seeders'),
}