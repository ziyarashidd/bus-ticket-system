const mongoose = require('mongoose')

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

module.exports = mongoose.models.Agency || mongoose.model('Agency', AgencySchema)
