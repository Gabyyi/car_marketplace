const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'dealer', 'admin'], default: 'user' },
  dealerStatus: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  ads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ad' }],
  parkedCars: { type: [mongoose.Schema.Types.Mixed], default: [] },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', UserSchema)
