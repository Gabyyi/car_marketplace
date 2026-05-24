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

function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function toNumberExpression(path) {
  return {
    $convert: {
      input: { $ifNull: [path, 0] },
      to: 'double',
      onError: 0,
      onNull: 0
    }
  }
}

function buildSortStage(sort) {
  switch (sort) {
    case 'price-asc':
      return { numericPrice: 1, createdAt: -1 }
    case 'price-desc':
      return { numericPrice: -1, createdAt: -1 }
    case 'km-asc':
      return { numericMileage: 1, createdAt: -1 }
    case 'km-desc':
      return { numericMileage: -1, createdAt: -1 }
    case 'reg-oldest':
      return { numericRegYear: 1, createdAt: -1 }
    case 'reg-newest':
      return { numericRegYear: -1, createdAt: -1 }
    default:
      return { createdAt: -1 }
  }
}

function toLowerStringExpression(path) {
  return {
    $toLower: {
      $convert: {
        input: { $ifNull: [path, ''] },
        to: 'string',
        onError: '',
        onNull: ''
      }
    }
  }
}

function buildMatchStage({ q, make, model, priceFrom, priceTo, mileageFrom, mileageTo, registrationFrom, registrationTo, transmission, fuelType, bodyType, doors, color, condition, accidentFree }) {
  const match = {}

  if (make) match.normalizedMake = { $regex: `^${escapeRegex(make)}` }
  if (model) match.normalizedModel = { $regex: escapeRegex(model) }
  if (Number.isFinite(priceFrom)) match.numericPrice = { ...match.numericPrice, $gte: priceFrom }
  if (Number.isFinite(priceTo)) match.numericPrice = { ...match.numericPrice, $lte: priceTo }
  if (Number.isFinite(mileageFrom)) match.numericMileage = { ...match.numericMileage, $gte: mileageFrom }
  if (Number.isFinite(mileageTo)) match.numericMileage = { ...match.numericMileage, $lte: mileageTo }
  if (Number.isFinite(registrationFrom)) match.numericRegYear = { ...match.numericRegYear, $gte: registrationFrom }
  if (Number.isFinite(registrationTo)) match.numericRegYear = { ...match.numericRegYear, $lte: registrationTo }
  if (transmission) match.normalizedTransmission = { $regex: `^${escapeRegex(transmission)}$` }
  if (fuelType) match.normalizedFuelType = { $regex: `^${escapeRegex(fuelType)}$` }
  if (bodyType) match.normalizedBodyType = { $regex: `^${escapeRegex(bodyType)}$` }
  if (doors) match.normalizedDoors = { $regex: `^${escapeRegex(doors)}$` }
  if (color) match.normalizedColor = { $regex: `^${escapeRegex(color)}$` }
  if (condition) match.normalizedCondition = { $regex: `^${escapeRegex(condition)}$` }
  if (accidentFree) {
    match.$and = [
      { $or: [{ 'vehicle.accidentDamaged': { $in: [null, undefined, '', 'No'] } }, { 'vehicle.accidentDamaged': { $exists: false } }] },
      { $or: [{ 'vehicle.damaged': { $in: [null, undefined, '', 'No'] } }, { 'vehicle.damaged': { $exists: false } }] },
      { normalizedDescription: { $not: /accident/i } }
    ]
  }

  if (q) {
    const qRegex = escapeRegex(q)
    const qClause = {
      $or: [
        { normalizedMake: { $regex: qRegex } },
        { normalizedModel: { $regex: qRegex } },
        { normalizedTitle: { $regex: qRegex } },
        { normalizedDescription: { $regex: qRegex } }
      ]
    }
    match.$and = match.$and ? [...match.$and, qClause] : [qClause]
  }

  return match
}

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

// PUT /api/ads/:id - update an existing ad owned by the current user
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
    if (!ad) return res.status(404).json({ message: 'Ad not found' })
    if (String(ad.owner) !== String(req.userId)) return res.status(403).json({ message: 'Not allowed' })

    const { vehicle, equipment, details, contact, images } = req.body
    if (vehicle) ad.vehicle = vehicle
    if (equipment) ad.equipment = equipment
    if (details) ad.details = { ...(ad.details || {}), ...details }
    if (contact) ad.contact = contact
    if (Array.isArray(images)) {
      ad.images = images
      ad.details = ad.details || {}
      ad.details.images = images
    }

    await ad.save()
    res.json({ ad })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/ads/:id - delete an ad owned by the current user
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
    if (!ad) return res.status(404).json({ message: 'Ad not found' })
    if (String(ad.owner) !== String(req.userId)) return res.status(403).json({ message: 'Not allowed' })

    await Ad.deleteOne({ _id: ad._id })
    await User.updateOne({ _id: req.userId }, { $pull: { ads: ad._id } })
    res.json({ message: 'Ad deleted' })
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
    const transmission = String(req.query.transmission || '').trim().toLowerCase()
    const fuelType = String(req.query.fuelType || '').trim().toLowerCase()
    const bodyType = String(req.query.bodyType || '').trim().toLowerCase()
    const doors = String(req.query.doors || '').trim().toLowerCase()
    const color = String(req.query.color || '').trim().toLowerCase()
    const condition = String(req.query.condition || '').trim().toLowerCase()
    const accidentFree = String(req.query.accidentFree || '') === 'true'
    const sort = String(req.query.sort || 'standard')

    const pipeline = [
      {
        $addFields: {
          normalizedMake: { $toLower: { $ifNull: ['$vehicle.make', ''] } },
          normalizedModel: { $toLower: { $ifNull: ['$vehicle.model', ''] } },
          normalizedTransmission: toLowerStringExpression('$vehicle.transmission'),
          normalizedFuelType: toLowerStringExpression('$vehicle.fuel'),
          normalizedBodyType: toLowerStringExpression({ $ifNull: ['$vehicle.bodyType', { $ifNull: ['$vehicle.category', '$vehicle.subcategory'] }] }),
          normalizedDoors: toLowerStringExpression('$vehicle.doors'),
          normalizedColor: toLowerStringExpression({ $ifNull: ['$vehicle.color', '$vehicle.exteriorColor'] }),
          normalizedCondition: toLowerStringExpression({ $ifNull: ['$vehicle.condition', '$details.condition'] }),
          normalizedTitle: { $toLower: { $ifNull: ['$details.title', ''] } },
          normalizedDescription: { $toLower: { $ifNull: ['$details.description', ''] } },
          numericPrice: toNumberExpression('$details.price'),
          numericMileage: toNumberExpression('$vehicle.mileage'),
          numericRegYear: toNumberExpression({ $ifNull: ['$vehicle.regYear', '$vehicle.year'] })
        }
      },
      { $match: buildMatchStage({ q, make, model, priceFrom, priceTo, mileageFrom, mileageTo, registrationFrom, registrationTo, transmission, fuelType, bodyType, doors, color, condition, accidentFree }) },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          ads: [
            { $sort: buildSortStage(sort) },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner'
              }
            },
            { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
            {
              $project: {
                normalizedMake: 0,
                normalizedModel: 0,
                normalizedTransmission: 0,
                normalizedFuelType: 0,
                normalizedBodyType: 0,
                normalizedDoors: 0,
                normalizedColor: 0,
                normalizedCondition: 0,
                normalizedTitle: 0,
                normalizedDescription: 0,
                numericPrice: 0,
                numericMileage: 0,
                numericRegYear: 0
              }
            }
          ]
        }
      }
    ]

    const [result] = await Ad.aggregate(pipeline).allowDiskUse(true)
    const total = result?.metadata?.[0]?.total || 0
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const safePage = Math.min(page, totalPages)

    res.json({
      ads: result?.ads || [],
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
    const pipeline = [
      {
        $addFields: {
          numericPrice: toNumberExpression('$details.price')
        }
      },
      { $match: Number.isFinite(minPrice) && minPrice > 0 ? { numericPrice: { $gte: minPrice } } : {} },
      { $sample: { size: 1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner'
        }
      },
      { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
      { $project: { numericPrice: 0 } }
    ]

    const ads = await Ad.aggregate(pipeline).allowDiskUse(true)
    if (!ads.length) return res.status(404).json({ message: 'No ads found' })

    res.json({ ad: ads[0] })
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
    const pipeline = [
      {
        $addFields: {
          numericPrice: toNumberExpression('$details.price')
        }
      },
      { $match: Number.isFinite(minPrice) && minPrice > 0 ? { numericPrice: { $gte: minPrice } } : {} },
      { $sample: { size: limit } },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner'
        }
      },
      { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
      { $project: { numericPrice: 0 } }
    ]

    const ads = await Ad.aggregate(pipeline).allowDiskUse(true)
    res.json({ ads })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/ads/:id - get single ad (public)
router.get('/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id).populate('owner', 'username email role dealerStatus')
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
