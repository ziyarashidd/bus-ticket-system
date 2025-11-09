// Database utilities for bus ticketing system
// Connected to backend API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://bus-ticket-system-2phn.onrender.com/api"

export interface Agency {
  id: string
  code: string
  name: string
  username: string
  password: string
  email: string
  phone: string
  buses: string[] // bus IDs
  routes: string[] // route IDs
  createdAt: string
  status?: string
  legalStatus?: string
  yearOfEstablishment?: number
  companyRegistrationNumber?: string
  gstTaxId?: string
  headOfficeAddress?: string
  city?: string
  state?: string
  pincode?: string
  adminName?: string
  adminDesignation?: string
  adminEmail?: string
  adminPhone?: string
  alternatePhone?: string
  totalBuses?: number
  primaryBusTypes?: string[]
  keyOperatingRoutes?: string
  currentTicketingMethod?: string
  expectedGoLiveDate?: string
  specificRequirements?: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
}

export interface Bus {
  id: string
  agencyId: string
  name: string
  plate: string
  capacity: number
  totalSeats: number
  createdAt: string
}

export interface Route {
  id: string
  agencyId: string
  code: string
  source: string
  destination: string
  fare: number
  distance: number
  estimatedTime: number
  createdAt: string
}

export interface Conductor {
  id: string
  agencyId: string
  agencyCode: string
  name: string
  email: string
  phone: string
  username: string
  password: string
  totalTickets: number
  totalEarnings: number
  lastActive: string
  createdAt: string
}

export interface Ticket {
  id: string
  conductorId: string
  conductorName: string
  agencyId: string
  agencyCode: string
  busId: string
  routeId: string
  source: string
  destination: string
  fare: string
  seat: string
  passengerName: string
  passengerPhone: string
  createdAt: string
}

// Agency operations
export const getAgencies = async (): Promise<Agency[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/agencies`)
    const data = await response.json()
    return data.agencies || []
  } catch (error) {
    console.error("Failed to fetch agencies:", error)
    return []
  }
}

export const getAgencyById = async (id: string): Promise<Agency | null> => {
  try {
    const agencies = await getAgencies()
    return agencies.find((a) => a.id === id) || null
  } catch (error) {
    console.error("Failed to fetch agency:", error)
    return null
  }
}

export const createAgency = async (agency: Omit<Agency, "id" | "createdAt" | "buses" | "routes">): Promise<Agency | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/agencies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(agency),
    })
    const data = await response.json()
    return data.agency || null
  } catch (error) {
    console.error("Failed to create agency:", error)
    return null
  }
}

export const updateAgency = async (id: string, updates: Partial<Agency>): Promise<Agency | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/agencies/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })
    const data = await response.json()
    return data.agency || null
  } catch (error) {
    console.error("Failed to update agency:", error)
    return null
  }
}

export const deleteAgency = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/agencies/${id}`, {
      method: "DELETE",
    })
    return response.ok
  } catch (error) {
    console.error("Failed to delete agency:", error)
    return false
  }
}

// Bus operations
export const getBuses = async (): Promise<Bus[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/buses`)
    const data = await response.json()
    return data.buses || []
  } catch (error) {
    console.error("Failed to fetch buses:", error)
    return []
  }
}

export const getBusesByAgency = async (agencyId: string): Promise<Bus[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/buses?agencyId=${agencyId}`)
    const data = await response.json()
    return data.buses || []
  } catch (error) {
    console.error("Failed to fetch buses by agency:", error)
    return []
  }
}

export const createBus = async (bus: Omit<Bus, "id" | "createdAt">): Promise<Bus | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/buses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bus),
    })
    const data = await response.json()
    return data.bus || null
  } catch (error) {
    console.error("Failed to create bus:", error)
    return null
  }
}

export const deleteBus = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/buses?id=${id}`, {
      method: "DELETE",
    })
    return response.ok
  } catch (error) {
    console.error("Failed to delete bus:", error)
    return false
  }
}

// Route operations
export const getRoutes = async (): Promise<Route[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/routes`)
    const data = await response.json()
    return data.routes || []
  } catch (error) {
    console.error("Failed to fetch routes:", error)
    return []
  }
}

export const getRoutesByAgency = async (agencyId: string): Promise<Route[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/routes?agencyId=${agencyId}`)
    const data = await response.json()
    return data.routes || []
  } catch (error) {
    console.error("Failed to fetch routes by agency:", error)
    return []
  }
}

export const createRoute = async (route: Omit<Route, "id" | "createdAt">): Promise<Route | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/routes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(route),
    })
    const data = await response.json()
    return data.route || null
  } catch (error) {
    console.error("Failed to create route:", error)
    return null
  }
}

export const deleteRoute = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/routes?id=${id}`, {
      method: "DELETE",
    })
    return response.ok
  } catch (error) {
    console.error("Failed to delete route:", error)
    return false
  }
}

// Conductor operations
export const getConductors = async (): Promise<Conductor[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conductors`)
    const data = await response.json()
    return data.conductors || []
  } catch (error) {
    console.error("Failed to fetch conductors:", error)
    return []
  }
}

export const getConductorsByAgency = async (agencyId: string): Promise<Conductor[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conductors?agencyId=${agencyId}`)
    const data = await response.json()
    return data.conductors || []
  } catch (error) {
    console.error("Failed to fetch conductors by agency:", error)
    return []
  }
}

export const updateConductor = async (id: string, updates: Partial<Conductor>): Promise<Conductor | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conductors`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...updates }),
    })
    const data = await response.json()
    return data.conductor || null
  } catch (error) {
    console.error("Failed to update conductor:", error)
    return null
  }
}

// Ticket operations
export const getTickets = async (): Promise<Ticket[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`)
    const data = await response.json()
    return data.tickets || []
  } catch (error) {
    console.error("Failed to fetch tickets:", error)
    return []
  }
}

export const getTicketsByAgency = async (agencyId: string): Promise<Ticket[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets?agencyId=${agencyId}`)
    const data = await response.json()
    return data.tickets || []
  } catch (error) {
    console.error("Failed to fetch tickets by agency:", error)
    return []
  }
}

export const getTicketsByConductor = async (conductorId: string): Promise<Ticket[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets?conductorId=${conductorId}`)
    const data = await response.json()
    return data.tickets || []
  } catch (error) {
    console.error("Failed to fetch tickets by conductor:", error)
    return []
  }
}

export const createTicket = async (ticket: Omit<Ticket, "id" | "createdAt">): Promise<Ticket | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticket),
    })
    const data = await response.json()
    return data.ticket || null
  } catch (error) {
    console.error("Failed to create ticket:", error)
    return null
  }
}
