const mongoose = require('mongoose')
require('dotenv').config()
const User = require('../models/User')
const Ad = require('../models/Ad')

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/car_marketplace'
const DB_NAME = process.env.DB_NAME || 'CarBuy'

async function run() {
  await mongoose.connect(MONGO_URI, { dbName: DB_NAME })
  const users = await User.countDocuments()
  const ads = await Ad.countDocuments()
  console.log(`DB counts -> users: ${users}, ads: ${ads}`)
  await mongoose.disconnect()
}

run().catch(err => { console.error(err); process.exit(1) })
