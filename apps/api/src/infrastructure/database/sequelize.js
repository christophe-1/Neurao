import { Sequelize } from 'sequelize'
import config from './config.cjs'

const sequelize = new Sequelize({ ...config.app, logging: false })
export default sequelize
