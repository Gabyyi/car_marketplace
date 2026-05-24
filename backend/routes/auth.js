const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { authMiddleware } = require('../middleware/auth')

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
    const role = process.env.ADMIN_EMAIL && String(email).toLowerCase() === String(process.env.ADMIN_EMAIL).toLowerCase() ? 'admin' : 'user'

    const user = new User({ username: name, email, password: hash, role })
    await user.save()

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role || 'user' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role || 'user', dealerStatus: user.dealerStatus || 'none', phone: user.phone || '', address: user.address || '', parkedCars: user.parkedCars || [], createdAt: user.createdAt } })
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

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role || 'user' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role || 'user', dealerStatus: user.dealerStatus || 'none', phone: user.phone || '', address: user.address || '', parkedCars: user.parkedCars || [], createdAt: user.createdAt } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/auth/me - current authenticated user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('username email role dealerStatus phone address ads parkedCars createdAt')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/auth/profile - update the current user's profile contact info
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, email, phone, address } = req.body

    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (typeof username === 'string' && username.trim()) user.username = username.trim()
    if (typeof email === 'string' && email.trim()) {
      const normalizedEmail = email.trim().toLowerCase()
      const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } })
      if (existing) return res.status(409).json({ message: 'Email already in use' })
      user.email = normalizedEmail
    }
    if (typeof phone === 'string') user.phone = phone.trim()
    if (typeof address === 'string') user.address = address.trim()

    await user.save()

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || 'user',
        dealerStatus: user.dealerStatus || 'none',
        phone: user.phone || '',
        address: user.address || '',
        parkedCars: user.parkedCars || [],
        createdAt: user.createdAt
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/auth/parked-cars - retrieve user's parked cars
router.get('/parked-cars', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('parkedCars')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ parkedCars: user.parkedCars || [] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/auth/parked-cars - replace user's parked cars list
router.put('/parked-cars', authMiddleware, async (req, res) => {
  try {
    const { parkedCars } = req.body
    if (!Array.isArray(parkedCars)) return res.status(400).json({ message: 'parkedCars must be an array' })

    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.parkedCars = parkedCars
    await user.save()

    res.json({ parkedCars: user.parkedCars || [] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/auth/password - change password for the current user
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Missing fields' })
    if (String(newPassword).length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' })

    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) return res.status(401).json({ message: 'Invalid current password' })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()

    res.json({ message: 'Password updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/auth/account - delete the current user account and their ads
router.delete('/account', authMiddleware, async (req, res) => {
  try {
    const Ad = require('../models/Ad')
    await Ad.deleteMany({ owner: req.userId })
    await User.deleteOne({ _id: req.userId })
    res.json({ message: 'Account deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
