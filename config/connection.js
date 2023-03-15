import mysql from 'mysql2'
import * as dotenv from 'dotenv'
dotenv.config()

const online = process.env.JAWSDB_URL
// const online = process.env.CLEARDB_DATABASE_URL
const offline = {
  port: 3306,
  host: 'localhost',
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
}

export default mysql.createConnection(online || offline)

//cleardb
// mysql -h host -u root -p
