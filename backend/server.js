const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const { connectDB } = require('./db')

const app = express()
const PORT = process.env.PORT || 3001

// Connect to database
connectDB()

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Next.js frontend
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/agencies', require('./routes/agencies'))
app.use('/api/buses', require('./routes/buses'))
app.use('/api/routes', require('./routes/routes'))
app.use('/api/conductors', require('./routes/conductors'))
app.use('/api/tickets', require('./routes/tickets'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bus Ticketing Backend is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`Bus Ticketing Backend server is running on port ${PORT}`)
})
