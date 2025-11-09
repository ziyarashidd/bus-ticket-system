const express = require('express')
const router = express.Router()
const { getConductors, getConductorsByAgency, createConductor, updateConductor } = require('../db')
const bcrypt = require('bcryptjs')

// Get conductors
router.get('/', async (req, res) => {
  try {
    const { agencyId } = req.query
    const conductors = agencyId ? await getConductorsByAgency(agencyId) : await getConductors()
    res.json({ conductors })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conductors" })
  }
})

// Create conductor
router.post('/', async (req, res) => {
  try {
    const { agencyId, agencyCode, name, email, phone, username, password } = req.body

    if (!agencyId || !agencyCode || !name || !email || !phone || !username || !password) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newConductor = await createConductor({
      agencyId,
      agencyCode,
      name,
      email,
      phone,
      username,
      password: hashedPassword,
    })

    res.status(201).json({ success: true, conductor: newConductor })
  } catch (error) {
    res.status(500).json({ error: "Failed to create conductor" })
  }
})

// Update conductor
router.put('/', async (req, res) => {
  try {
    const { id, name, email, phone, username, password } = req.body

    if (!id) {
      return res.status(400).json({ error: "Conductor ID is required" })
    }

    const updateData = { name, email, phone, username }
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const updatedConductor = await updateConductor(id, updateData)
    if (!updatedConductor) {
      return res.status(404).json({ error: "Conductor not found" })
    }

    res.json({ success: true, conductor: updatedConductor })
  } catch (error) {
    res.status(500).json({ error: "Failed to update conductor" })
  }
})

module.exports = router
