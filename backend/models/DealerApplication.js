const mongoose = require('mongoose')

const DealerApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  businessType: { type: String, required: true },
  contactName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  city: { type: String, required: true },
  website: { type: String, default: '' },
  yearsInBusiness: { type: String, default: '' },
  inventorySize: { type: String, required: true },
  message: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reviewedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

DealerApplicationSchema.pre('save', function updateTimestamp(next) {
  this.updatedAt = new Date()
  next()
})

module.exports = mongoose.model('DealerApplication', DealerApplicationSchema)