const express = require('express')
const router = express.Router()
const { getAgencies, getConductors } = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validateToken } = require('../middleware/auth')

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Login route
router.post('/login', async (req, res) => {
  try {
    let { agencyCode, username, password, role } = req.body

    if (!username || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // For admin, agencyCode is not required
    if (role !== "admin" && !agencyCode) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // For admin, set empty agencyCode
    if (role === "admin") {
      agencyCode = ""
    }

    let user = null

    if (role === "admin") {
      // Admin login - check hardcoded or env
      if (username === "admin" && password === "admin123") {
        user = {
          id: "admin_1",
          role: "admin",
          username: "admin",
          name: "Administrator",
        }
      }
    } else if (role === "agency") {
      // Agency login
      const agencies = await getAgencies()
      const agency = agencies.find(a => a.code === agencyCode && a.username === username)
      if (agency && await bcrypt.compare(password, agency.password)) {
        user = {
          id: agency.id,
          role: "agency",
          agencyId: agency.id,
          agencyCode: agency.code,
          username: agency.username,
          name: agency.name,
          email: agency.email,
        }
      }
    } else if (role === "conductor") {
      // Conductor login
      const conductors = await getConductors()
      const conductor = conductors.find(c => c.agencyCode === agencyCode && c.username === username)
      if (conductor && await bcrypt.compare(password, conductor.password)) {
        user = {
          id: conductor.id,
          role: "conductor",
          agencyId: conductor.agencyId,
          agencyCode: conductor.agencyCode,
          username: conductor.username,
          name: conductor.name,
          email: conductor.email,
        }
      }
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: "24h" })

    res.json({
      success: true,
      token,
      user,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: "Authentication failed" })
  }
})

// Validate token route
router.get('/validate', validateToken)

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token')
  res.json({ success: true })
})

module.exports = router
