"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, Trash2, Plus } from "lucide-react"
import { getAuthUser } from "@/lib/auth"
import { TicketReceipt } from "@/components/ticket-receipt"

export default function ConductorTicketPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [context, setContext] = useState<any>(null)
  const [route, setRoute] = useState<any>(null)
  const [bus, setBus] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [generatedTicket, setGeneratedTicket] = useState<any>(null)
  const [formData, setFormData] = useState({
    passengerName: "",
    passengerPhone: "",
    seat: "",
    fare: "",
  })
  const [passengers, setPassengers] = useState([{ name: "", phone: "", seat: "" }])
  const [routes, setRoutes] = useState<any[]>([])
  const [customSource, setCustomSource] = useState("")
  const [customDestination, setCustomDestination] = useState("")
  const [customFare, setCustomFare] = useState("")
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([])
  const [selectedSubRoute, setSelectedSubRoute] = useState<any>(null)

  const addPassenger = () => {
    setPassengers([...passengers, { name: "", phone: "", seat: "" }])
  }

  const removePassenger = (index: number) => {
    setPassengers(passengers.filter((_, i) => i !== index))
  }

  const updatePassenger = (index: number, field: string, value: string) => {
    const updated = [...passengers]
    updated[index] = { ...updated[index], [field]: value }
    setPassengers(updated)
  }

  const calculateTotalFare = () => {
    return (Number.parseFloat(formData.fare) * passengers.length).toFixed(2)
  }

  useEffect(() => {
    const authUser = getAuthUser()
    if (!authUser || authUser.role !== "conductor") {
      router.push("/login")
      return
    }

    const ctx = localStorage.getItem("conductor_context")
    if (!ctx) {
      router.push("/conductor/dashboard")
      return
    }

    const parsedCtx = JSON.parse(ctx)
    setUser(authUser)
    setContext(parsedCtx)

    const loadData = async () => {
      // Fetch routes
      const routesResponse = await fetch('http://localhost:3001/api/routes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const routesData = await routesResponse.json()
      const agencyRoutes = routesData.routes || []
      setRoutes(agencyRoutes)

      // Fetch buses
      const busesResponse = await fetch('http://localhost:3001/api/buses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const busesData = await busesResponse.json()
      const buses = busesData.buses || []

      const selectedRoute = agencyRoutes.find((r: any) => r.id === parsedCtx.routeId)
      const selectedBus = buses.find((b: any) => b.id === parsedCtx.busId)

      if (selectedRoute) {
        setRoute(selectedRoute)
        setCustomSource(selectedRoute.source)
        setCustomDestination(selectedRoute.destination)
        setCustomFare(selectedRoute.fare.toString())
        setFormData((prev) => ({ ...prev, fare: selectedRoute.fare.toString() }))
      }
      if (selectedBus) {
        setBus(selectedBus)
      }

      // Fetch occupied seats for this bus and route
      const ticketsResponse = await fetch(`http://localhost:3001/api/tickets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const ticketsData = await ticketsResponse.json()
      const allTickets = ticketsData.tickets || []

      // Filter tickets for this bus and route, then check time-based availability
      const currentTime = new Date()
      const relevantTickets = allTickets.filter((t: any) => t.busId === parsedCtx.busId && t.routeId === parsedCtx.routeId)

      // Calculate which seats are currently occupied based on journey time + 24 hours
      const occupied: string[] = []
      for (const ticket of relevantTickets) {
        const ticketTime = new Date(ticket.createdAt)
        const route = agencyRoutes.find((r) => r.id === ticket.routeId)
        if (route) {
          const journeyEndTime = new Date(ticketTime.getTime() + route.estimatedTime * 60 * 60 * 1000 + 24 * 60 * 60 * 1000)
          if (currentTime < journeyEndTime) {
            occupied.push(ticket.seat)
          }
        }
      }
      setOccupiedSeats(occupied)
    }
    loadData()
  }, [router])

  const handleRouteChange = (routeId: string) => {
    const selectedRoute = routes.find((r) => r.id === routeId)
    if (selectedRoute) {
      setRoute(selectedRoute)
      setCustomSource(selectedRoute.source)
      setCustomDestination(selectedRoute.destination)
      setCustomFare(selectedRoute.fare.toString())
      setFormData((prev) => ({ ...prev, fare: selectedRoute.fare.toString() }))
      setSelectedSubRoute(null) // Reset sub-route selection
    }
  }

  const handleSubRouteChange = (subRoute: any) => {
    setSelectedSubRoute(subRoute)
    setCustomSource(subRoute.stop)
    setCustomDestination(route.destination)
    setCustomFare(subRoute.fare.toString())
    setFormData((prev) => ({ ...prev, fare: subRoute.fare.toString() }))
  }

  const handleSourceChange = (value: string) => {
    setCustomSource(value)
  }

  const handleDestinationChange = (value: string) => {
    setCustomDestination(value)
  }

  const handleCustomFareChange = (value: string) => {
    setCustomFare(value)
    setFormData((prev) => ({ ...prev, fare: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (passengers.some((p) => !p.name || !p.phone || !p.seat)) {
      setError("Please fill all passenger details")
      return
    }

    if (passengers.some((p) => occupiedSeats.includes(p.seat))) {
      setError("One or more selected seats are already booked")
      return
    }

    setLoading(true)
    try {
      const tickets = []
      for (const passenger of passengers) {
        const ticketResponse = await fetch('http://localhost:3001/api/tickets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conductorId: user.id,
            conductorName: user.name,
            agencyId: user.agencyId || "",
            agencyCode: user.agencyCode || "",
            busId: context.busId,
            routeId: context.routeId,
            source: customSource || route.source,
            destination: customDestination || route.destination,
            fare: customFare || route.fare.toString(),
            seat: passenger.seat,
            passengerName: passenger.name,
            passengerPhone: passenger.phone,
          }),
        })
        const ticketData = await ticketResponse.json()
        if (ticketResponse.ok) {
          tickets.push(ticketData.ticket || ticketData)
        } else {
          throw new Error(ticketData.error || 'Failed to create ticket')
        }
      }

      setGeneratedTicket(tickets)
    } catch (err) {
      setError("Failed to generate tickets")
      console.error("Error creating tickets:", err)
    } finally {
      setLoading(false)
    }
  }

  if (generatedTicket) {
    return (
      <main className="min-h-dvh bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ticket Generated Successfully!</h1>
            <p className="text-sm text-gray-600">
              {generatedTicket[0]?.source || route.source} → {generatedTicket[0]?.destination || route.destination}
            </p>
          </div>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl p-6">
            <TicketReceipt ticket={generatedTicket} busName={bus?.name || "N/A"} routeCode={route?.code || "N/A"} />

            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => {
                  setGeneratedTicket(null)
                  setPassengers([{ name: "", phone: "", seat: "" }])
                  setFormData({
                    passengerName: "",
                    passengerPhone: "",
                    seat: "",
                    fare: route?.fare?.toString() || "",
                  })
                }}
                variant="outline"
                className="flex-1"
              >
                Generate Another Ticket
              </Button>
              <Button onClick={() => router.push("/conductor/dashboard")} variant="outline" className="flex-1">
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  if (!user || !route || !bus) {
    return <div className="min-h-dvh flex items-center justify-center">Loading...</div>
  }

  return (
    <main className="min-h-dvh bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Generate Ticket</h1>
          <p className="text-sm text-gray-600">
            {route?.source || "N/A"} → {route?.destination || "N/A"}
          </p>
        </div>

        {/* Ticket Form */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Passenger Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Route Info */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Route:</span>
                  <span className="font-semibold text-gray-900">{route?.code || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bus:</span>
                  <span className="font-semibold text-gray-900">{bus?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fare:</span>
                  <span className="font-semibold text-green-600">₹{customFare || route?.fare || "N/A"}</span>
                </div>
                {selectedSubRoute && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Stop:</span>
                    <span className="font-semibold text-blue-600">{selectedSubRoute.stop}</span>
                  </div>
                )}
                {route?.subRoutes && route.subRoutes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Available Stops:</p>
                    <div className="flex flex-wrap gap-2">
                      {route.subRoutes.map((sr: any, idx: number) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {sr.stop} (₹{sr.fare})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="route-select">Select Route</Label>
                  <select
                    id="route-select"
                    onChange={(e) => handleRouteChange(e.target.value)}
                    value={route?.id || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    <option value="">Choose a route...</option>
                    {routes.filter((r) => r.source === "Lucknow").map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.source} → {r.destination} (₹{r.fare})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub Routes */}
                {route?.subRoutes && route.subRoutes.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="subroute-select">Select Stop (Optional)</Label>
                    <select
                      id="subroute-select"
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === "") {
                          setSelectedSubRoute(null)
                          setCustomSource(route.source)
                          setCustomDestination(route.destination)
                          setCustomFare(route.fare.toString())
                          setFormData((prev) => ({ ...prev, fare: route.fare.toString() }))
                        } else {
                          const subRoute = route.subRoutes.find((sr: any) => sr.stop === value)
                          if (subRoute) handleSubRouteChange(subRoute)
                        }
                      }}
                      value={selectedSubRoute?.stop || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      <option value="">Full route ({route.source} → {route.destination})</option>
                      {route.subRoutes.map((sr: any, idx: number) => (
                        <option key={idx} value={sr.stop}>
                          {sr.stop} → {route.destination} (₹{sr.fare})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="custom-source">From (Source)</Label>
                    <Input
                      id="custom-source"
                      placeholder="e.g., Lucknow"
                      value={customSource}
                      onChange={(e) => handleSourceChange(e.target.value)}
                      disabled={loading || selectedSubRoute !== null}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-destination">To (Destination)</Label>
                    <Input
                      id="custom-destination"
                      placeholder="e.g., Mumbai"
                      value={customDestination}
                      onChange={(e) => handleDestinationChange(e.target.value)}
                      disabled={loading || selectedSubRoute !== null}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-fare">Fare (₹)</Label>
                  <Input
                    id="custom-fare"
                    type="number"
                    placeholder="Enter fare"
                    value={customFare}
                    onChange={(e) => handleCustomFareChange(e.target.value)}
                    disabled={loading || selectedSubRoute !== null}
                  />
                </div>
              </div>

              {/* Total Fare Display */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Passengers:</span>
                  <span className="font-semibold text-gray-900">{passengers.length}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Fare per Passenger:</span>
                  <span className="font-semibold text-gray-900">₹{formData.fare}</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-green-200">
                  <span className="text-lg font-semibold text-gray-900">Total Fare:</span>
                  <span className="text-2xl font-bold text-green-600">₹{calculateTotalFare()}</span>
                </div>
              </div>

              <div className="space-y-4">
                {passengers.map((passenger, index) => (
                  <Card key={index} className="bg-gray-50">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Passenger {index + 1}</h4>
                        {passengers.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePassenger(index)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${index}`}>Name</Label>
                          <Input
                            id={`name-${index}`}
                            placeholder="Passenger name"
                            value={passenger.name}
                            onChange={(e) => updatePassenger(index, "name", e.target.value)}
                            disabled={loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`phone-${index}`}>Phone</Label>
                          <Input
                            id={`phone-${index}`}
                            placeholder="Phone number"
                            value={passenger.phone}
                            onChange={(e) => updatePassenger(index, "phone", e.target.value)}
                            disabled={loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`seat-${index}`}>Seat</Label>
                          <div className="relative">
                            <Input
                              id={`seat-${index}`}
                              placeholder="e.g., A1"
                              value={passenger.seat}
                              onChange={(e) => updatePassenger(index, "seat", e.target.value)}
                              disabled={loading}
                              className={`pr-16 ${passenger.seat ? (occupiedSeats.includes(passenger.seat) ? "border-red-500 border-2" : "border-green-500 border-2") : ""}`}
                            />
                            {passenger.seat && (
                              <span className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-bold ${occupiedSeats.includes(passenger.seat) ? "text-red-600" : "text-green-600"}`}>
                                {occupiedSeats.includes(passenger.seat) ? "Booked" : "Available"}
                              </span>
                            )}
                          </div>
                          {occupiedSeats.includes(passenger.seat) && passenger.seat && (
                            <p className="text-sm text-red-600">This seat is already booked</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addPassenger}
                  className="w-full gap-2 bg-transparent"
                  disabled={loading}
                >
                  <Plus className="w-4 h-4" />
                  Add Another Passenger
                </Button>
              </div>

              {/* Fare */}
              <div className="space-y-2">
                <Label htmlFor="fare">Fare (₹)</Label>
                <Input
                  id="fare"
                  type="number"
                  value={formData.fare}
                  onChange={(e) => setFormData({ ...formData, fare: e.target.value })}
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={loading} className="w-full h-12 text-lg font-semibold">
                {loading ? "Generating..." : "Generate Ticket"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
