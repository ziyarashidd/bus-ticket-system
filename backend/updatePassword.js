const { connectDB, getAgencies, getConductors } = require('./db')
const bcrypt = require('bcryptjs')

async function updatePasswords() {
  try {
    await connectDB()

    // Update agency password
    const agencies = await getAgencies()
    const agency = agencies.find(a => a.username === 'arzu')
    if (agency) {
      const hashedPassword = await bcrypt.hash('pass123', 10)
      console.log('Agency current password hash:', agency.password)
      console.log('New password hash for pass123:', hashedPassword)

      // Update the password in database
      const mongoose = require('mongoose')
      const AgencyModel = mongoose.model('Agency')
      await AgencyModel.findOneAndUpdate(
        { username: 'arzu' },
        { password: hashedPassword }
      )
      console.log('Agency password updated')
    }

    // Update conductor password
    const conductors = await getConductors()
    const conductor = conductors.find(c => c.username === 'ak')
    if (conductor) {
      const hashedPassword = await bcrypt.hash('pass123', 10)
      console.log('Conductor current password hash:', conductor.password)
      console.log('New password hash for pass123:', hashedPassword)

      // Update the password in database
      const mongoose = require('mongoose')
      const ConductorModel = mongoose.model('Conductor')
      await ConductorModel.findOneAndUpdate(
        { username: 'ak' },
        { password: hashedPassword }
      )
      console.log('Conductor password updated')
    }

    console.log('Password update completed')
    process.exit(0)
  } catch (error) {
    console.error('Error updating passwords:', error)
    process.exit(1)
  }
}

updatePasswords()
