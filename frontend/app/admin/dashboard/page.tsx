"use client"

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Building2, Ticket, FileText } from "lucide-react"
import { getAuthUser, clearAuth } from "@/lib/auth"
import { getAgencies, getConductors, getTickets, getBuses, getRoutes } from "@/lib/db"
import AdminHeader from "@/components/admin/admin-header"
import AgencyRequests from "@/components/admin/agency-requests"
import ConductorManagement from "@/components/admin/conductor-management"
import AgencyManagement from "@/components/admin/agency-management"
import TicketManagement from "@/components/admin/ticket-management"
import AdminStats from "@/components/admin/admin-stats"
import AnalyticsCharts from "@/components/admin/analytics-charts"
import ConductorActivity from "@/components/admin/conductor-activity"
import AgencyPerformance from "@/components/admin/agency-performance"

export default function AdminDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [agencies, setAgencies] = useState([])
  const [conductors, setConductors] = useState([])
  const [tickets, setTickets] = useState([])
  const [buses, setBuses] = useState([])
  const [routes, setRoutes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authUser = getAuthUser()
    if (!authUser || authUser.role !== "admin") {
      router.push("/admin/login")
      return
    }
    setUser(authUser)

    const tab = searchParams.get("tab")
    if (tab) setActiveTab(tab)

    loadData()
  }, [router, searchParams])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [agenciesData, conductorsData, ticketsData, busesData, routesData] = await Promise.all([
        getAgencies(),
        getConductors(),
        getTickets(),
        getBuses(),
        getRoutes(),
      ])

      setAgencies(agenciesData)
      setConductors(conductorsData)
      setTickets(ticketsData)
      setBuses(busesData)
      setRoutes(routesData)
    } catch (error) {
      console.error("Error loading admin data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuth()
    router.push("/admin/login")
  }

  if (!user) {
    return <div className="min-h-dvh flex items-center justify-center">Loading...</div>
  }

  return (
    <main className="min-h-dvh bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <AdminHeader onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Stats Overview */}
        <AdminStats agencies={agencies} conductors={conductors} tickets={tickets} buses={buses} routes={routes} />

        <AnalyticsCharts agencies={agencies} tickets={tickets} />
        <AgencyPerformance agencies={agencies} tickets={tickets} />
        <ConductorActivity conductors={conductors} tickets={tickets} />

        {/* Management Tabs */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="requests" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Requests</span>
                </TabsTrigger>
                <TabsTrigger value="agencies" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Agencies</span>
                </TabsTrigger>
                <TabsTrigger value="conductors" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Conductors</span>
                </TabsTrigger>
                <TabsTrigger value="tickets" className="flex items-center gap-2">
                  <Ticket className="w-4 h-4" />
                  <span className="hidden sm:inline">Tickets</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="requests" className="space-y-4">
                <AgencyRequests onDataChange={loadData} />
              </TabsContent>

              <TabsContent value="agencies" className="space-y-4">
                <AgencyManagement
                  agencies={agencies.filter((agency) => agency.status === "approved")}
                  onDataChange={loadData}
                  title="Approved Agencies"
                />
              </TabsContent>

              <TabsContent value="conductors" className="space-y-4">
                <ConductorManagement conductors={conductors} agencies={agencies} />
              </TabsContent>

              <TabsContent value="tickets" className="space-y-4">
                <TicketManagement tickets={tickets} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
