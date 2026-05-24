const jwt = require('jsonwebtoken')
const User = require('../models/User')

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ message: 'No authorization header' })
  const parts = auth.split(' ')
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid authorization header' })

  try {
    const payload = jwt.verify(parts[1], process.env.JWT_SECRET || 'secret')
    req.userId = payload.id
    req.userRole = payload.role || 'user'
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

async function requireAdmin(req, res, next) {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Unauthorized' })
    const user = await User.findById(req.userId).select('role')
    if (!user) return res.status(404).json({ message: 'User not found' })
    if ((user.role || 'user') !== 'admin') return res.status(403).json({ message: 'Admin access required' })
    req.adminUser = user
    next()
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { authMiddleware, requireAdmin }