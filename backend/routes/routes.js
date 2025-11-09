const express = require('express')
const router = express.Router()
const { getRoutes, getRoutesByAgency, createRoute, updateRoute, deleteRoute } = require('../db')

// Get routes
router.get('/', async (req, res) => {
  try {
    const { agencyId } = req.query
    const routes = agencyId ? await getRoutesByAgency(agencyId) : await getRoutes()
    res.json({ routes })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch routes" })
  }
})

// Create new route
router.post('/', async (req, res) => {
  try {
    const { agencyId, code, source, destination, fare, distance, estimatedTime, subRoutes } = req.body

    if (!agencyId || !code || !source || !destination || !fare) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const newRoute = await createRoute({
      agencyId,
      code: code.toUpperCase(),
      source,
      destination,
      fare: Number(fare),
      distance: Number(distance) || 0,
      estimatedTime: Number(estimatedTime) || 0,
      subRoutes: subRoutes || [],
    })

    res.status(201).json({ success: true, route: newRoute })
  } catch (error) {
    res.status(500).json({ error: "Failed to create route" })
  }
})

// Update route
router.put('/', async (req, res) => {
  try {
    const { id, code, source, destination, fare, distance, estimatedTime, subRoutes } = req.body

    if (!id) {
      return res.status(400).json({ error: "Route ID required" })
    }

    const updates = {}
    if (code) updates.code = code.toUpperCase()
    if (source) updates.source = source
    if (destination) updates.destination = destination
    if (fare) updates.fare = Number(fare)
    if (distance !== undefined) updates.distance = Number(distance)
    if (estimatedTime !== undefined) updates.estimatedTime = Number(estimatedTime)
    if (subRoutes !== undefined) updates.subRoutes = subRoutes

    const updatedRoute = await updateRoute(id, updates)
    if (!updatedRoute) {
      return res.status(404).json({ error: "Route not found" })
    }

    res.json({ success: true, route: updatedRoute })
  } catch (error) {
    res.status(500).json({ error: "Failed to update route" })
  }
})

// Delete route
router.delete('/', async (req, res) => {
  try {
    const { id } = req.query
    if (!id) {
      return res.status(400).json({ error: "Route ID required" })
    }

    const success = await deleteRoute(id)
    if (!success) {
      return res.status(404).json({ error: "Route not found" })
    }

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete route" })
  }
})

module.exports = router
