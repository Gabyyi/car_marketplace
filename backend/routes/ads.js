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

// GET /api/ads - list ads with pagination and basic filters
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1))
    const limit = Math.max(1, Math.min(100, Number(req.query.limit || 25)))
    const q = String(req.query.q || '').trim().toLowerCase()
    const make = String(req.query.make || '').trim().toLowerCase()
    const model = String(req.query.model || '').trim().toLowerCase()
    const priceFrom = Number(req.query.priceFrom)
    const priceTo = Number(req.query.priceTo)
    const mileageFrom = Number(req.query.mileageFrom)
    const mileageTo = Number(req.query.mileageTo)
    const registrationFrom = Number(req.query.registrationFrom)
    const registrationTo = Number(req.query.registrationTo)
    const accidentFree = String(req.query.accidentFree || '') === 'true'
    const sort = String(req.query.sort || 'standard')

    const ads = await Ad.find({}).populate('owner', 'username email').sort({ createdAt: -1 })

    const filtered = ads.filter(ad => {
      const adMake = String(ad.vehicle?.make || '').toLowerCase()
      const adModel = String(ad.vehicle?.model || '').toLowerCase()
      const title = String(ad.details?.title || '').toLowerCase()
      const description = String(ad.details?.description || '').toLowerCase()
      const price = Number(String(ad.details?.price || ad.vehicle?.price || 0).replace(/[^\d.]/g, ''))
      const mileage = Number(String(ad.vehicle?.mileage || 0).replace(/[^\d.]/g, ''))
      const regYear = Number(String(ad.vehicle?.regYear || ad.vehicle?.year || 0).replace(/[^\d.]/g, ''))
      const isAccidentFree = [ad.vehicle?.accidentDamaged, ad.vehicle?.damaged].every(v => [null, undefined, '', 'No'].includes(v)) && !/accident/i.test(description)

      if (q && !(adMake.includes(q) || adModel.includes(q) || title.includes(q) || description.includes(q))) return false
      if (make && !adMake.startsWith(make)) return false
      if (model && !adModel.includes(model)) return false
      if (Number.isFinite(priceFrom) && price < priceFrom) return false
      if (Number.isFinite(priceTo) && price > priceTo) return false
      if (Number.isFinite(mileageFrom) && mileage < mileageFrom) return false
      if (Number.isFinite(mileageTo) && mileage > mileageTo) return false
      if (Number.isFinite(registrationFrom) && regYear < registrationFrom) return false
      if (Number.isFinite(registrationTo) && regYear > registrationTo) return false
      if (accidentFree && !isAccidentFree) return false
      return true
    })

    const sorters = {
      'price-asc': (a, b) => Number(String(a.details?.price || 0).replace(/[^\d.]/g, '')) - Number(String(b.details?.price || 0).replace(/[^\d.]/g, '')),
      'price-desc': (a, b) => Number(String(b.details?.price || 0).replace(/[^\d.]/g, '')) - Number(String(a.details?.price || 0).replace(/[^\d.]/g, '')),
      'km-asc': (a, b) => Number(String(a.vehicle?.mileage || 0).replace(/[^\d.]/g, '')) - Number(String(b.vehicle?.mileage || 0).replace(/[^\d.]/g, '')),
      'km-desc': (a, b) => Number(String(b.vehicle?.mileage || 0).replace(/[^\d.]/g, '')) - Number(String(a.vehicle?.mileage || 0).replace(/[^\d.]/g, '')),
      'reg-oldest': (a, b) => Number(String(a.vehicle?.regYear || a.vehicle?.year || 0).replace(/[^\d.]/g, '')) - Number(String(b.vehicle?.regYear || b.vehicle?.year || 0).replace(/[^\d.]/g, '')),
      'reg-newest': (a, b) => Number(String(b.vehicle?.regYear || b.vehicle?.year || 0).replace(/[^\d.]/g, '')) - Number(String(a.vehicle?.regYear || a.vehicle?.year || 0).replace(/[^\d.]/g, ''))
    }

    const sorted = filtered.slice().sort(sorters[sort] || ((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    const total = sorted.length
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const safePage = Math.min(page, totalPages)
    const start = (safePage - 1) * limit
    const paged = sorted.slice(start, start + limit)

    res.json({
      ads: paged,
      page: safePage,
      limit,
      total,
      totalPages
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/ads/random - get one random ad, optionally filtered by minimum price
router.get('/random', async (req, res) => {
  try {
    const minPrice = Number(req.query.minPrice || 0)
    const ads = await Ad.find({}).populate('owner', 'username email').sort({ createdAt: -1 })

    const filtered = ads.filter(ad => {
      const price = Number(String(ad.details?.price || ad.vehicle?.price || 0).replace(/[^\d.]/g, ''))
      return Number.isFinite(price) && price >= minPrice
    })

    const pool = filtered.length ? filtered : ads
    if (!pool.length) return res.status(404).json({ message: 'No ads found' })

    const randomAd = pool[Math.floor(Math.random() * pool.length)]
    res.json({ ad: randomAd })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/ads/random-list - get a random list of ads
router.get('/random-list', async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(24, Number(req.query.limit || 5)))
    const minPrice = Number(req.query.minPrice || 0)
    const ads = await Ad.find({}).populate('owner', 'username email').sort({ createdAt: -1 })

    const eligible = ads.filter(ad => {
      const price = Number(String(ad.details?.price || ad.vehicle?.price || 0).replace(/[^\d.]/g, ''))
      return Number.isFinite(price) && price >= minPrice
    })

    const pool = eligible.length ? eligible : ads
    if (!pool.length) return res.json({ ads: [] })

    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    res.json({ ads: shuffled.slice(0, limit) })
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
