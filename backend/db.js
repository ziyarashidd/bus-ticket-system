// Database utilities for bus ticketing system
// Migrated from TypeScript to plain JavaScript

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ziyarashid204:ziya%40786@youtubenotes.ta7cg.mongodb.net/bus-ticketing-system?appName=YoutubeNotes'

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    throw error
  }
}

const AgencySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  buses: [{ type: String }],
  routes: [{ type: String }],
  createdAt: { type: String, required: true },
  // New fields for registration form (optional for admin creation)
  legalStatus: { type: String },
  yearOfEstablishment: { type: Number },
  companyRegistrationNumber: { type: String },
  gstTaxId: { type: String },
  headOfficeAddress: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  adminName: { type: String },
  adminDesignation: { type: String },
  adminEmail: { type: String },
  adminPhone: { type: String },
  alternatePhone: { type: String },
  totalBuses: { type: Number },
  primaryBusTypes: [{ type: String }],
  keyOperatingRoutes: { type: String },
  currentTicketingMethod: { type: String },
  expectedGoLiveDate: { type: String },
  specificRequirements: { type: String },
  // Approval status
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedAt: { type: String },
  reviewedBy: { type: String },
  rejectionReason: { type: String }
})

const BusSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  agencyId: { type: String, required: true },
  name: { type: String, required: true },
  plate: { type: String, required: true },
  capacity: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  createdAt: { type: String, required: true }
})

const RouteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  agencyId: { type: String, required: true },
  code: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  fare: { type: Number, required: true },
  distance: { type: Number, required: true },
  estimatedTime: { type: Number, required: true },
  subRoutes: [{ stop: { type: String }, fare: { type: Number }, distance: { type: Number } }],
  createdAt: { type: String, required: true }
})

const ConductorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  agencyId: { type: String, required: true },
  agencyCode: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  totalTickets: { type: Number, required: true },
  totalEarnings: { type: Number, required: true },
  lastActive: { type: String, required: true },
  createdAt: { type: String, required: true }
})

const TicketSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  conductorId: { type: String, required: true },
  conductorName: { type: String, required: true },
  agencyId: { type: String, required: true },
  agencyCode: { type: String, required: true },
  busId: { type: String, required: true },
  routeId: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  fare: { type: String, required: true },
  seat: { type: String, required: true },
  passengerName: { type: String, required: true },
  passengerPhone: { type: String, required: true },
  createdAt: { type: String, required: true }
})

const AgencyModel = mongoose.models.Agency || mongoose.model('Agency', AgencySchema)
const BusModel = mongoose.models.Bus || mongoose.model('Bus', BusSchema)
const RouteModel = mongoose.models.Route || mongoose.model('Route', RouteSchema)
const ConductorModel = mongoose.models.Conductor || mongoose.model('Conductor', ConductorSchema)
const TicketModel = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema)

// Agency operations
const getAgencies = async () => {
  return await AgencyModel.find({ status: 'approved' })
}

const getAgencyById = async (id) => {
  return await AgencyModel.findOne({ id })
}

const createAgency = async (agency) => {
  const hashedPassword = await bcrypt.hash(agency.password, 10)
  const newAgency = new AgencyModel({
    ...agency,
    password: hashedPassword,
    id: `AG${Date.now()}`,
    buses: [],
    routes: [],
    createdAt: new Date().toISOString(),
    status: agency.status || 'pending',
  })
  return await newAgency.save()
}

const updateAgency = async (id, updates) => {
  return await AgencyModel.findOneAndUpdate({ id }, updates, { new: true })
}

const deleteAgency = async (id) => {
  const agency = await AgencyModel.findOne({ id })
  if (!agency) return false

  // Delete all buses for this agency
  await BusModel.deleteMany({ agencyId: id })

  // Delete all routes for this agency
  await RouteModel.deleteMany({ agencyId: id })

  // Delete all conductors for this agency
  await ConductorModel.deleteMany({ agencyId: id })

  // Delete all tickets for this agency
  await TicketModel.deleteMany({ agencyId: id })

  // Delete the agency itself
  await AgencyModel.deleteOne({ id })

  return true
}

// Bus operations
const getBuses = async () => {
  return await BusModel.find()
}

const getBusesByAgency = async (agencyId) => {
  return await BusModel.find({ agencyId })
}

const createBus = async (bus) => {
  const newBus = new BusModel({
    ...bus,
    id: `BUS${Date.now()}`,
    createdAt: new Date().toISOString(),
  })
  const savedBus = await newBus.save()

  // Update agency buses array
  await AgencyModel.findOneAndUpdate(
    { id: bus.agencyId },
    { $push: { buses: savedBus.id } }
  )

  return savedBus
}

const updateBus = async (id, updates) => {
  return await BusModel.findOneAndUpdate({ id }, updates, { new: true })
}

const deleteBus = async (id) => {
  const bus = await BusModel.findOne({ id })
  if (!bus) return false

  await BusModel.deleteOne({ id })

  // Update agency buses array
  await AgencyModel.findOneAndUpdate(
    { id: bus.agencyId },
    { $pull: { buses: id } }
  )

  return true
}

// Route operations
const getRoutes = async () => {
  return await RouteModel.find()
}

const getRoutesByAgency = async (agencyId) => {
  return await RouteModel.find({ agencyId })
}

const createRoute = async (route) => {
  const newRoute = new RouteModel({
    ...route,
    id: `RT${Date.now()}`,
    createdAt: new Date().toISOString(),
  })
  const savedRoute = await newRoute.save()

  // Update agency routes array
  await AgencyModel.findOneAndUpdate(
    { id: route.agencyId },
    { $push: { routes: savedRoute.id } }
  )

  return savedRoute
}

const updateRoute = async (id, updates) => {
  return await RouteModel.findOneAndUpdate({ id }, updates, { new: true })
}

const deleteRoute = async (id) => {
  const route = await RouteModel.findOne({ id })
  if (!route) return false

  await RouteModel.deleteOne({ id })

  // Update agency routes array
  await AgencyModel.findOneAndUpdate(
    { id: route.agencyId },
    { $pull: { routes: id } }
  )

  return true
}

// Conductor operations
const getConductors = async () => {
  return await ConductorModel.find()
}

const getConductorsByAgency = async (agencyId) => {
  return await ConductorModel.find({ agencyId })
}

const createConductor = async (conductor) => {
  const newConductor = new ConductorModel({
    ...conductor,
    id: `COND${Date.now()}`,
    totalTickets: 0,
    totalEarnings: 0,
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  })
  return await newConductor.save()
}

const updateConductor = async (id, updates) => {
  return await ConductorModel.findOneAndUpdate({ id }, updates, { new: true })
}

// Ticket operations
const getTickets = async () => {
  return await TicketModel.find()
}

const getTicketsByAgency = async (agencyId) => {
  return await TicketModel.find({ agencyId })
}

const getTicketsByConductor = async (conductorId) => {
  return await TicketModel.find({ conductorId })
}

const createTicket = async (ticket) => {
  // Check seat availability
  const route = await RouteModel.findOne({ id: ticket.routeId })
  if (!route) {
    throw new Error('Route not found')
  }

  const currentTime = new Date()
  const journeyEndTime = new Date(currentTime.getTime() + route.estimatedTime * 60 * 60 * 1000) // estimatedTime in hours
  const seatAvailableAfter = new Date(journeyEndTime.getTime() + 24 * 60 * 60 * 1000) // +24 hours

  // Check for existing tickets on the same bus, route, seat that are still occupying the seat
  const allTickets = await TicketModel.find({
    busId: ticket.busId,
    routeId: ticket.routeId,
    seat: ticket.seat
  })
  const conflictingTickets = allTickets.filter(t => {
    const ticketTime = new Date(t.createdAt)
    const endTime = new Date(ticketTime.getTime() + route.estimatedTime * 60 * 60 * 1000 + 24 * 60 * 60 * 1000)
    return currentTime < endTime
  })

  if (conflictingTickets.length > 0) {
    throw new Error(`Seat ${ticket.seat} is not available. It will be available after ${seatAvailableAfter.toISOString()}`)
  }

  const newTicket = new TicketModel({
    ...ticket,
    id: `T${Date.now()}`,
    createdAt: new Date().toISOString(),
  })
  const savedTicket = await newTicket.save()

  // Update conductor stats
  const conductor = await ConductorModel.findOne({ id: ticket.conductorId })
  if (conductor) {
    await ConductorModel.findOneAndUpdate(
      { id: ticket.conductorId },
      {
        totalTickets: conductor.totalTickets + 1,
        totalEarnings: conductor.totalEarnings + Number.parseFloat(ticket.fare),
        lastActive: new Date().toISOString(),
      }
    )
  }

  return savedTicket
}

const getPendingAgencies = async () => {
  return await AgencyModel.find({ status: 'pending' })
}

const approveAgency = async (id, adminId) => {
  return await AgencyModel.findOneAndUpdate(
    { id },
    {
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy: adminId,
    },
    { new: true }
  )
}

const rejectAgency = async (id, adminId, reason) => {
  return await AgencyModel.findOneAndUpdate(
    { id },
    {
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: adminId,
      rejectionReason: reason,
    },
    { new: true }
  )
}

module.exports = {
  connectDB,
  getAgencies,
  getAgencyById,
  getPendingAgencies,
  createAgency,
  approveAgency,
  rejectAgency,
  updateAgency,
  deleteAgency,
  getBuses,
  getBusesByAgency,
  createBus,
  updateBus,
  deleteBus,
  getRoutes,
  getRoutesByAgency,
  createRoute,
  updateRoute,
  deleteRoute,
  getConductors,
  getConductorsByAgency,
  createConductor,
  updateConductor,
  getTickets,
  getTicketsByAgency,
  getTicketsByConductor,
  createTicket,
}
