const express = require('express')
const Ad = require('../models/Ad')
const User = require('../models/User')
const DealerApplication = require('../models/DealerApplication')
const { authMiddleware, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.use(authMiddleware)
router.use(requireAdmin)

router.get('/overview', async (req, res) => {
  try {
    const [applications, users, ads] = await Promise.all([
      DealerApplication.find({}).sort({ createdAt: -1 }).populate('user', 'username email role createdAt').populate('reviewedBy', 'username email'),
      User.find({}).sort({ createdAt: -1 }).select('username email role createdAt ads'),
      Ad.find({}).sort({ createdAt: -1 }).populate('owner', 'username email role')
    ])

    res.json({
      stats: {
        applications: applications.length,
        pendingApplications: applications.filter((item) => item.status === 'pending').length,
        users: users.length,
        ads: ads.length
      },
      applications,
      users,
      ads
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.patch('/dealer-applications/:id', async (req, res) => {
  try {
    const { status } = req.body
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const application = await DealerApplication.findById(req.params.id)
    if (!application) return res.status(404).json({ message: 'Application not found' })

    application.status = status
    application.reviewedBy = req.userId
    application.reviewedAt = new Date()
    await application.save()

    if (status === 'approved') {
      await User.updateOne({ _id: application.user }, { $set: { role: 'dealer', dealerStatus: 'approved' } })
    } else if (status === 'rejected') {
      await User.updateOne({ _id: application.user }, { $set: { dealerStatus: 'rejected' } })
    }

    const refreshed = await DealerApplication.findById(application._id).populate('user', 'username email role createdAt').populate('reviewedBy', 'username email')
    res.json({ application: refreshed })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body
    if (!['user', 'dealer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.role = role
    await user.save()
    res.json({ user: { id: user._id, username: user.username, email: user.email, role: user.role, createdAt: user.createdAt } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    await Ad.deleteMany({ owner: user._id })
    await DealerApplication.deleteMany({ user: user._id })
    await User.deleteOne({ _id: user._id })
    res.json({ message: 'User deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/ads/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
    if (!ad) return res.status(404).json({ message: 'Ad not found' })

    await Ad.deleteOne({ _id: ad._id })
    await User.updateOne({ _id: ad.owner }, { $pull: { ads: ad._id } })
    res.json({ message: 'Ad deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router