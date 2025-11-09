// Password hashing utilities (for production use with bcrypt)
// For now, using simple validation

export const validatePassword = (password: string): boolean => {
  // Minimum 6 characters
  return password.length >= 6
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  // Basic phone validation for Indian numbers
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(phone.replace(/\D/g, ""))
}

export const validateAgencyCode = (code: string): boolean => {
  return code.length >= 3 && code.length <= 10
}
