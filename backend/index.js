const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
const path = require('path')

// serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT || 4000

async function start() {
  if (!MONGO_URI) {
    console.error('MONGO_URI not set in environment')
    process.exit(1)
  }
  try {
    await mongoose.connect(MONGO_URI, { dbName: process.env.DB_NAME })
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error('MongoDB connection error', err)
    process.exit(1)
  }

  await ensureAdminAccount()

  // Routes
  const authRouter = require('./routes/auth')
  app.use('/api/auth', authRouter)
  const dealerApplicationsRouter = require('./routes/dealerApplications')
  app.use('/api/dealer-applications', dealerApplicationsRouter)
  const adminRouter = require('./routes/admin')
  app.use('/api/admin', adminRouter)
  const adsRouter = require('./routes/ads')
  app.use('/api/ads', adsRouter)

  app.get('/', (req, res) => res.json({ ok: true }))

  app.listen(PORT, () => console.log(`Server listening on ${PORT}`))

  // console.log('Connected to DB:', mongoose.connection.name)
  // console.log('MONGO_URI:', process.env.MONGO_URI)
}

async function ensureAdminAccount() {
  const adminEmail = String(process.env.ADMIN_EMAIL || 'admin@carbuy.ro').toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const existing = await User.findOne({ email: adminEmail })
  if (existing) {
    if ((existing.role || 'user') !== 'admin') {
      existing.role = 'admin'
      await existing.save()
    }
    return
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10)
  await User.create({
    username: 'Admin',
    email: adminEmail,
    password: passwordHash,
    role: 'admin',
    ads: []
  })
  console.log(`Created default admin account for ${adminEmail}`)
}

start()
