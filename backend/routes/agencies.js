const express = require('express')
const router = express.Router()
const { getAgencies, createAgency, getPendingAgencies, approveAgency, rejectAgency } = require('../db')
const AgencyModel = require('../models/Agency')

// Get all agencies (admin only)
router.get('/', async (req, res) => {
  try {
    const agencies = await AgencyModel.find() // Return all agencies for admin dashboard filtering
    res.json({ agencies })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch agencies" })
  }
})

// Get pending agencies (admin only)
router.get('/pending', async (req, res) => {
  try {
    const agencies = await getPendingAgencies()
    res.json({ agencies })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pending agencies" })
  }
})

// Create new agency (public registration or admin creation)
router.post('/', async (req, res) => {
  try {
    const {
      name, code, username, password, adminEmail, adminPhone, email, phone,
      legalStatus, yearOfEstablishment, companyRegistrationNumber, gstTaxId,
      headOfficeAddress, city, state, pincode,
      adminName, adminDesignation, alternatePhone,
      totalBuses, primaryBusTypes, keyOperatingRoutes, currentTicketingMethod,
      expectedGoLiveDate, specificRequirements
    } = req.body

    // Check if this is admin creation (minimal fields) or full registration
    const isAdminCreation = !legalStatus && !yearOfEstablishment && !headOfficeAddress

    if (isAdminCreation) {
      // Admin creation - minimal required fields
      if (!name || !username || !password) {
        return res.status(400).json({ error: "Missing required fields: name, username, password" })
      }

      const newAgency = await createAgency({
        code: code ? code.toUpperCase() : name.substring(0, 3).toUpperCase(),
        name,
        username,
        password,
        email: email || adminEmail,
        phone: phone || adminPhone,
        status: 'approved' // Admin created agencies are auto-approved
      })

      res.status(201).json({ success: true, agency: newAgency })
    } else {
      // Full registration - validate all required fields
      if (!name || !username || !password || !adminEmail || !adminPhone || !legalStatus ||
          !yearOfEstablishment || !headOfficeAddress || !city || !state || !pincode ||
          !adminName || !adminDesignation || !totalBuses || !primaryBusTypes || !keyOperatingRoutes || !currentTicketingMethod) {
        return res.status(400).json({ error: "Missing required fields" })
      }

      const newAgency = await createAgency({
        code: code ? code.toUpperCase() : name.substring(0, 3).toUpperCase(),
        name,
        username,
        password,
        email: adminEmail, // Use adminEmail as the main email
        phone: adminPhone, // Use adminPhone as the main phone
        legalStatus,
        yearOfEstablishment,
        companyRegistrationNumber,
        gstTaxId,
        headOfficeAddress,
        city,
        state,
        pincode,
        adminName,
        adminDesignation,
        adminEmail,
        adminPhone,
        alternatePhone,
        totalBuses,
        primaryBusTypes,
        keyOperatingRoutes,
        currentTicketingMethod,
        expectedGoLiveDate,
        specificRequirements,
        status: 'pending'
      })

      res.status(201).json({ success: true, agency: newAgency })
    }
  } catch (error) {
    console.error("Agency creation error:", error)
    res.status(500).json({ error: "Failed to create agency" })
  }
})

// Approve agency (admin only)
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params
    const { adminId } = req.body

    if (!adminId) {
      return res.status(400).json({ error: "Admin ID is required" })
    }

    const approvedAgency = await approveAgency(id, adminId)

    if (!approvedAgency) {
      return res.status(404).json({ error: "Agency not found" })
    }

    res.json({ success: true, agency: approvedAgency })
  } catch (error) {
    console.error("Agency approval error:", error)
    res.status(500).json({ error: "Failed to approve agency" })
  }
})

// Reject agency (admin only)
router.put('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params
    const { adminId, reason } = req.body

    if (!adminId) {
      return res.status(400).json({ error: "Admin ID is required" })
    }

    const rejectedAgency = await rejectAgency(id, adminId, reason)

    if (!rejectedAgency) {
      return res.status(404).json({ error: "Agency not found" })
    }

    res.json({ success: true, agency: rejectedAgency })
  } catch (error) {
    console.error("Agency rejection error:", error)
    res.status(500).json({ error: "Failed to reject agency" })
  }
})

// Update agency
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, code, username, password, email, phone } = req.body

    if (!id) {
      return res.status(400).json({ error: "Agency ID is required" })
    }

    const { updateAgency } = require('../db')
    const updatedAgency = await updateAgency(id, {
      ...(name && { name }),
      ...(code && { code: code.toUpperCase() }),
      ...(username && { username }),
      ...(password && { password }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
    })

    if (!updatedAgency) {
      return res.status(404).json({ error: "Agency not found" })
    }

    res.json({ success: true, agency: updatedAgency })
  } catch (error) {
    console.error("Agency update error:", error)
    res.status(500).json({ error: "Failed to update agency" })
  }
})

// Delete agency
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ error: "Agency ID is required" })
    }

    const { deleteAgency } = require('../db')
    const deleted = await deleteAgency(id)

    if (!deleted) {
      return res.status(404).json({ error: "Agency not found" })
    }

    res.json({ success: true })
  } catch (error) {
    console.error("Agency deletion error:", error)
    res.status(500).json({ error: "Failed to delete agency" })
  }
})

module.exports = router
