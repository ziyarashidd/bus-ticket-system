// Authentication utilities

export interface AuthUser {
  id: string
  role: "admin" | "agency" | "conductor"
  agencyId?: string
  agencyCode?: string
  username: string
  name: string
  email?: string
}

export const setAuthToken = (token: string, user: AuthUser) => {
  // Store user data in localStorage for client-side access
  localStorage.setItem("auth_user", JSON.stringify(user))

  // Token is now handled by httpOnly cookies in API routes
}

export const getAuthToken = (): string | null => {
  // Token is now in httpOnly cookies, not accessible from client-side
  // Use API routes to validate authentication
  return null
}

export const getAuthUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("auth_user")
  return user ? JSON.parse(user) : null
}

export const clearAuth = () => {
  localStorage.removeItem("auth_user")
  // Cookies are cleared by the logout API route
}

export const isAuthenticated = (): boolean => {
  return !!getAuthUser()
}

export const generateMockToken = (): string => {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
