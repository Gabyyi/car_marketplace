const express = require('express')
const DealerApplication = require('../models/DealerApplication')
const User = require('../models/User')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      companyName,
      businessType,
      contactName,
      email,
      phone,
      city,
      website,
      yearsInBusiness,
      inventorySize,
      message
    } = req.body

    if (!companyName || !businessType || !contactName || !email || !city || !inventorySize) {
      return res.status(400).json({ message: 'Missing fields' })
    }

    const existing = await DealerApplication.findOne({ user: req.userId, status: 'pending' })
    const payload = {
      companyName,
      businessType,
      contactName,
      email,
      phone: phone || '',
      city,
      website: website || '',
      yearsInBusiness: yearsInBusiness || '',
      inventorySize,
      message: message || '',
      status: 'pending',
      reviewedBy: null,
      reviewedAt: null
    }

    let application
    if (existing) {
      Object.assign(existing, payload)
      application = await existing.save()
    } else {
      application = await DealerApplication.create({ ...payload, user: req.userId })
    }

    await User.updateOne({ _id: req.userId }, { $set: { dealerStatus: 'pending' } })

    res.json({ application })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const application = await DealerApplication.findOne({ user: req.userId }).sort({ createdAt: -1 })
    res.json({ application: application || null })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router