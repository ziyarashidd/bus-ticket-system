"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Bus, MapPin, Users, TicketIcon, TrendingUp } from "lucide-react"
import { getAuthUser, clearAuth } from "@/lib/auth"
import {
  getBusesByAgency,
  getRoutesByAgency,
  getConductorsByAgency,
  getTicketsByAgency,
} from "@/lib/db"

import BusManagement from "@/components/agency/bus-management"
import RouteManagement from "@/components/agency/route-management"
import ConductorManagement from "@/components/agency/conductor-management"
import AgencyStats from "@/components/agency/agency-stats"
import TodayEarnings from "@/components/agency/today-earnings"
import RevenueCharts from "@/components/agency/revenue-charts"
import ConductorPerformanceDetailed from "@/components/agency/conductor-performance-detailed"

export default function AgencyDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [buses, setBuses] = useState<any[]>([])
  const [routes, setRoutes] = useState<any[]>([])
  const [conductors, setConductors] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)

  // ✅ Load user and agency data
  useEffect(() => {
    const authUser = getAuthUser()
    if (!authUser || authUser.role !== "agency") {
      router.push("/login")
      return
    }
    setUser(authUser)
    loadData(authUser.agencyId)
  }, [router])

  const loadData = async (agencyId: string) => {
    setIsLoading(true)
    try {
      const [agencyBuses, agencyRoutes, agencyConductors, agencyTickets] = await Promise.all([
        getBusesByAgency(agencyId),
        getRoutesByAgency(agencyId),
        getConductorsByAgency(agencyId),
        getTicketsByAgency(agencyId),
      ])

      setBuses(agencyBuses)
      setRoutes(agencyRoutes)
      setConductors(agencyConductors)
      setTickets(agencyTickets)
    } catch (error) {
      console.error("Error loading agency data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuth()
    router.push("/login")
  }

  // ✅ Refresh handlers
  const handleBusAdded = () => user?.agencyId && loadData(user.agencyId)
  const handleRouteAdded = () => user?.agencyId && loadData(user.agencyId)
  const handleConductorAdded = () => user?.agencyId && loadData(user.agencyId)

  // ✅ Calculate Stats
  const conductorStats = conductors.map((conductor) => ({
    ...conductor,
    ticketCount: tickets.filter((t) => t.conductorId === conductor.id).length,
    earnings: tickets
      .filter((t) => t.conductorId === conductor.id)
      .reduce((sum, t) => sum + (Number.parseFloat(t.fare) || 0), 0),
  }))

  const totalTickets = tickets.length
  const totalRevenue = tickets.reduce((sum, t) => sum + (Number.parseFloat(t.fare) || 0), 0)

  if (!user) {
    return <div className="min-h-dvh flex items-center justify-center">Loading...</div>
  }

  return (
    <main className="min-h-dvh bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* ================= HEADER ================= */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agency Dashboard</h1>
            <p className="text-sm text-gray-600">{user.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Quick Stats Section */}
        <AgencyStats buses={buses} routes={routes} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Today's Earnings */}
          <TodayEarnings tickets={tickets} />

          {/* Total Conductors */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Conductors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{conductors.length}</div>
            </CardContent>
          </Card>

          {/* Total Tickets */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TicketIcon className="w-4 h-4" />
                Total Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalTickets}</div>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ₹{totalRevenue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Performance */}
        <RevenueCharts conductors={conductors} tickets={tickets} />
        <ConductorPerformanceDetailed
          conductors={conductors}
          tickets={tickets}
          routes={routes}
        />

        {/* ================= MANAGEMENT TABS ================= */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚙️</span> Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="buses" className="flex items-center gap-2">
                  <Bus className="w-4 h-4" />
                  <span className="hidden sm:inline">Buses</span>
                </TabsTrigger>
                <TabsTrigger value="routes" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:inline">Routes</span>
                </TabsTrigger>
                <TabsTrigger value="conductors" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Conductors</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="buses" className="space-y-4">
                <BusManagement
                  agencyId={user.agencyId}
                  buses={buses}
                  onBusAdded={handleBusAdded}
                />
              </TabsContent>

              <TabsContent value="routes" className="space-y-4">
                <RouteManagement
                  agencyId={user.agencyId}
                  routes={routes}
                  onRouteAdded={handleRouteAdded}
                />
              </TabsContent>

              <TabsContent value="conductors" className="space-y-4">
                <ConductorManagement
                  agencyId={user.agencyId}
                  agencyCode={user.agencyCode}
                  onConductorAdded={handleConductorAdded}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
