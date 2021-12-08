const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI
let environment = process.env.NODE_ENV
let SECRET = process.env.SECRET

module.exports = {
  PORT,
  MONGODB_URI,
  SECRET,
  environment,
}