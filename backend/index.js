const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT || 4000

async function start() {
  if (!MONGO_URI) {
    console.error('MONGO_URI not set in environment')
    process.exit(1)
  }
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error('MongoDB connection error', err)
    process.exit(1)
  }

  // Routes
  const authRouter = require('./routes/auth')
  app.use('/api/auth', authRouter)

  app.get('/', (req, res) => res.json({ ok: true }))

  app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
}

start()
