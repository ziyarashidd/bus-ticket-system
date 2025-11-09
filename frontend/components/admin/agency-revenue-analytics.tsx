"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, DollarSign } from "lucide-react"

interface AgencyRevenueAnalyticsProps {
  agencies: any[]
  tickets: any[]
}

export default function AgencyRevenueAnalytics({ agencies, tickets }: AgencyRevenueAnalyticsProps) {
  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"]

  const agencyRevenueData = useMemo(() => {
    return agencies.map((agency) => {
      const agencyTickets = tickets.filter((t) => t.agencyId === agency.id)
      const revenue = agencyTickets.reduce((sum, ticket) => sum + Number.parseFloat(ticket.fare || 0), 0)
      return {
        name: agency.name || agency.code,
        code: agency.code,
        revenue,
        tickets: agencyTickets.length,
        conductors: new Set(agencyTickets.map((t) => t.conductorId)).size,
      }
    })
  }, [agencies, tickets])

  const totalRevenue = useMemo(() => {
    return agencyRevenueData.reduce((sum, agency) => sum + agency.revenue, 0)
  }, [agencyRevenueData])

  const topAgencies = useMemo(() => {
    return [...agencyRevenueData].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  }, [agencyRevenueData])

  const last7DaysData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split("T")[0]
    })

    return days.map((day) => {
      const dayTickets = tickets.filter((t) => t.createdAt.split("T")[0] === day)
      const revenue = dayTickets.reduce((sum, ticket) => sum + Number.parseFloat(ticket.fare || 0), 0)
      return {
        date: new Date(day).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue,
        tickets: dayTickets.length,
      }
    })
  }, [tickets])

  return (
    <div className="space-y-6">
      {/* Top Agencies by Revenue */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Top Agencies by Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topAgencies.map((agency, index) => (
              <div
                key={agency.code}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{agency.name}</p>
                    <p className="text-sm text-gray-600">Code: {agency.code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">₹{agency.revenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{agency.tickets} tickets</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Revenue Distribution */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-base">Revenue Distribution by Agency</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={agencyRevenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, revenue }) => `${name}: ₹${revenue.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {agencyRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Agency Performance */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-base">Agency Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topAgencies}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="code" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (₹)" />
                <Bar dataKey="tickets" fill="#10b981" name="Tickets" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Graph */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            7-Day Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last7DaysData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Revenue (₹)"
                dot={{ fill: "#3b82f6" }}
              />
              <Line
                type="monotone"
                dataKey="tickets"
                stroke="#10b981"
                strokeWidth={2}
                name="Tickets"
                dot={{ fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">₹{totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">All agencies combined</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Total Tickets</p>
              <p className="text-3xl font-bold text-blue-600">{tickets.length}</p>
              <p className="text-xs text-gray-500 mt-2">Across all agencies</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Active Agencies</p>
              <p className="text-3xl font-bold text-purple-600">
                {agencyRevenueData.filter((a) => a.revenue > 0).length}
              </p>
              <p className="text-xs text-gray-500 mt-2">With revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
