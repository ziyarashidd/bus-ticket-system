const express = require('express')
const router = express.Router()
const { getTickets, getTicketsByAgency, getTicketsByConductor, createTicket } = require('../db')

// Get tickets
router.get('/', async (req, res) => {
  try {
    const { agencyId, conductorId } = req.query

    let tickets
    if (conductorId) {
      tickets = await getTicketsByConductor(conductorId)
    } else if (agencyId) {
      tickets = await getTicketsByAgency(agencyId)
    } else {
      tickets = await getTickets()
    }

    res.json({ tickets })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tickets" })
  }
})

// Create ticket
router.post('/', async (req, res) => {
  try {
    const ticketData = req.body
    const ticket = await createTicket(ticketData)
    res.status(201).json({ ticket })
  } catch (error) {
    console.error('Ticket creation error:', error)
    if (error.message.includes('not available')) {
      res.status(409).json({ error: error.message })
    } else {
      res.status(500).json({ error: "Failed to create ticket" })
    }
  }
})

module.exports = router
