const express = require('express')
const jwt = require('jsonwebtoken')
const Ad = require('../models/Ad')
const User = require('../models/User')

const multer = require('multer')
const fs = require('fs')
const path = require('path')

// ensure uploads dir exists
const uploadsDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `${unique}${ext}`)
  }
})
const upload = multer({ storage })

const router = express.Router()

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ message: 'No authorization header' })
  const parts = auth.split(' ')
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid authorization header' })
  const token = parts[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    req.userId = payload.id
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

// POST /api/ads - create a new ad (authenticated)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { vehicle, equipment, details, contact, images } = req.body
    if (!vehicle) return res.status(400).json({ message: 'Missing vehicle data' })

    const ad = new Ad({ vehicle, equipment, details, contact, images: images || [], owner: req.userId })
    await ad.save()

    // add to user's ads array
    const user = await User.findById(req.userId)
    if (user) {
      user.ads = user.ads || []
      user.ads.push(ad._id)
      await user.save()
    }

    res.json({ ad })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/ads/me - list current user's ads
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const ads = await Ad.find({ owner: req.userId }).sort({ createdAt: -1 })
    res.json({ ads })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/ads/:id - get single ad (public)
router.get('/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id).populate('owner', 'username email')
    if (!ad) return res.status(404).json({ message: 'Ad not found' })
    res.json({ ad })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/ads/:id/images - upload images for an ad (auth required)
router.post('/:id/images', authMiddleware, upload.array('images', 12), async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
    if (!ad) return res.status(404).json({ message: 'Ad not found' })
    // only owner can upload images
    if (String(ad.owner) !== String(req.userId)) return res.status(403).json({ message: 'Not allowed' })

    const host = req.get('host')
    const protocol = req.protocol
    const urls = (req.files || []).map(f => `${protocol}://${host}/uploads/${f.filename}`)

    // append to ad.details.images (prefer details.images) and ad.images
    ad.details = ad.details || {}
    ad.details.images = ad.details.images || []
    ad.images = ad.images || []
    ad.details.images.push(...urls)
    ad.images.push(...urls)
    await ad.save()

    res.json({ urls, ad })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
