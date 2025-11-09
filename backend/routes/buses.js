const express = require('express')
const router = express.Router()
const { getBuses, getBusesByAgency, createBus, updateBus, deleteBus } = require('../db')

// Get buses
router.get('/', async (req, res) => {
  try {
    const { agencyId } = req.query
    const buses = agencyId ? await getBusesByAgency(agencyId) : await getBuses()
    res.json({ buses })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch buses" })
  }
})

// Create new bus
router.post('/', async (req, res) => {
  try {
    const { agencyId, name, plate, capacity } = req.body

    if (!agencyId || !name || !plate || !capacity) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const newBus = await createBus({
      agencyId,
      name,
      plate,
      capacity: Number(capacity),
      totalSeats: Number(capacity),
    })

    res.status(201).json({ success: true, bus: newBus })
  } catch (error) {
    res.status(500).json({ error: "Failed to create bus" })
  }
})

// Update bus
router.put('/', async (req, res) => {
  try {
    const { id, name, plate, capacity } = req.body

    if (!id) {
      return res.status(400).json({ error: "Bus ID required" })
    }

    const updates = {}
    if (name) updates.name = name
    if (plate) updates.plate = plate
    if (capacity) {
      updates.capacity = Number(capacity)
      updates.totalSeats = Number(capacity)
    }

    const updatedBus = await updateBus(id, updates)
    if (!updatedBus) {
      return res.status(404).json({ error: "Bus not found" })
    }

    res.json({ success: true, bus: updatedBus })
  } catch (error) {
    res.status(500).json({ error: "Failed to update bus" })
  }
})

// Delete bus
router.delete('/', async (req, res) => {
  try {
    const { id } = req.query
    if (!id) {
      return res.status(400).json({ error: "Bus ID required" })
    }

    const success = await deleteBus(id)
    if (!success) {
      return res.status(404).json({ error: "Bus not found" })
    }

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete bus" })
  }
})

module.exports = router
