"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, Bus, MapPin, ArrowRight } from "lucide-react"
import { getAuthUser, clearAuth } from "@/lib/auth"
import { getBuses, getRoutes, getTicketsByConductor } from "@/lib/db"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import ConductorStats from "@/components/conductor/conductor-stats"

export default function ConductorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [buses, setBuses] = useState<any[]>([])
  const [routes, setRoutes] = useState<any[]>([])
  const [selectedBus, setSelectedBus] = useState("")
  const [selectedRoute, setSelectedRoute] = useState("")
  const [tickets, setTickets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authUser = getAuthUser()
    console.log("[v0] Auth user:", authUser)

    if (!authUser || authUser.role !== "conductor") {
      router.push("/login")
      return
    }

    setUser(authUser)

    const loadData = async () => {
      setIsLoading(true)
      try {
        const [busesData, routesData, conductorTickets] = await Promise.all([
          getBuses(),
          getRoutes(),
          getTicketsByConductor(authUser.id),
        ])

        console.log(" Buses loaded:", busesData)
        console.log("Routes loaded:", routesData)
        console.log("Tickets loaded:", conductorTickets)

        setBuses(busesData)
        setRoutes(routesData)
        setTickets(conductorTickets)
      } catch (error) {
        console.error("[v0] Error loading conductor data:", error)
        setBuses([])
        setRoutes([])
        setTickets([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleLogout = () => {
    clearAuth()
    router.push("/login")
  }

  const handleStartTicketing = () => {
    if (!selectedBus || !selectedRoute) {
      alert("Please select both bus and route")
      return
    }

    // Save selection and navigate to ticket page
    localStorage.setItem(
      "conductor_context",
      JSON.stringify({
        busId: selectedBus,
        routeId: selectedRoute,
        conductorId: user.id,
      }),
    )

    router.push("/conductor/ticket")
  }

  if (!user) {
    return <div className="min-h-dvh flex items-center justify-center">Loading...</div>
  }

  const selectedRouteData = routes?.find((r) => r.id === selectedRoute)
  const selectedBusData = buses?.find((b) => b.id === selectedBus)

  return (
    <main className="min-h-dvh bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Conductor Dashboard</h1>
            <p className="text-sm text-gray-600">{user.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Stats */}
        <ConductorStats tickets={tickets} />

        {/* Bus & Route Selection */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎫</span>
              Start Ticketing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {buses.length === 0 || routes.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
                <p className="font-semibold">⚠️ No buses or routes available</p>
                <p className="text-sm mt-1">Please contact your agency to add buses and routes to your account.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bus Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Bus className="w-5 h-5" />
                      Select Bus
                    </Label>
                    <Select value={selectedBus} onValueChange={setSelectedBus}>
                      <SelectTrigger className="rounded-xl border-primary/30 focus:border-primary/50">
                        <SelectValue placeholder="Choose a bus" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {buses.map((bus) => (
                          <SelectItem value={bus.id} key={bus.id}>
                            <div className="flex items-center gap-2">
                              <Bus className="w-4 h-4" />
                              <span>{bus.name}</span>
                              <span className="text-xs text-gray-500">({bus.plate})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedBusData && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                        <p className="text-green-700">
                          <span className="font-semibold">✓ Selected:</span> {selectedBusData.name}
                        </p>
                        <p className="text-xs text-green-600">Capacity: {selectedBusData.capacity} seats</p>
                      </div>
                    )}
                  </div>

                  {/* Route Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Select Route
                    </Label>
                    <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                      <SelectTrigger className="rounded-xl border-primary/30 focus:border-primary/50">
                        <SelectValue placeholder="Choose a route" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {routes.map((route) => (
                          <SelectItem value={route.id} key={route.id}>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{route.code}:</span>
                              <span>{route.source}</span>
                              <ArrowRight className="w-3 h-3" />
                              <span>{route.destination}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedRouteData && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                        <p className="text-green-700">
                          <span className="font-semibold">✓ Selected:</span> {selectedRouteData.code}
                        </p>
                        <p className="text-xs text-green-600">
                          {selectedRouteData.source} → {selectedRouteData.destination} • ₹{selectedRouteData.fare}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Start Button */}
                <Button
                  onClick={handleStartTicketing}
                  disabled={!selectedBus || !selectedRoute}
                  className="w-full h-12 text-lg font-semibold rounded-xl"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Start Generating Tickets
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        {tickets.length > 0 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div>
                      <p className="font-semibold text-gray-900">{ticket.id}</p>
                      <p className="text-sm text-gray-600">
                        {ticket.source} → {ticket.destination}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{ticket.fare}</p>
                      <p className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
