const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] || req.cookies.auth_token

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

const validateToken = (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] || req.cookies.auth_token

  if (!token) {
    return res.json({ authenticated: false })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return res.json({
      authenticated: true,
      user: decoded,
    })
  } catch (error) {
    return res.json({ authenticated: false })
  }
}

module.exports = {
  authenticateToken,
  validateToken,
}
