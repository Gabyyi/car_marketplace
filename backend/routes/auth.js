const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' })

    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ message: 'Email already in use' })

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = new User({ username: name, email, password: hash })
    await user.save()

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
