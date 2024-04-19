//require('dotenv').config()

// const host = process.env.DB_HOST || 'localhost'
// const username = process.env.DB_USER || 'root'
// const password = process.env.DB_PASSWORD || null
// const database = process.env.DB_NAME || 'yp'

const db =  {
  development: {
    username: 'root',
    password: null,
    database: 'yp',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
  },
}
export {db}
