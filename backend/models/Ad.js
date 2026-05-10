const mongoose = require('mongoose')

const AdSchema = new mongoose.Schema({
  vehicle: { type: Object, required: true },
  equipment: { type: Object },
  details: { type: Object },
  contact: { type: Object },
  images: { type: [String], default: [] },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
})

AdSchema.index({ createdAt: -1 })
AdSchema.index({ owner: 1, createdAt: -1 })

module.exports = mongoose.model('Ad', AdSchema)
