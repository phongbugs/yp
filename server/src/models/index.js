import { Sequelize } from 'sequelize'
import {db} from '../config/database'
const env = process.env.NODE_ENV || 'development'
const config = db[env]

const sequelize = config.url
  ? new Sequelize(config.url, config)
  : new Sequelize(config.database, config.username, config.password, config)

export { Sequelize, sequelize }
