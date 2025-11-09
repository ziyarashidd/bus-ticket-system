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
import { TrendingUp, PieChartIcon } from "lucide-react"

interface AnalyticsChartsProps {
  agencies: any[]
  tickets: any[]
}

export default function AnalyticsCharts({ agencies, tickets }: AnalyticsChartsProps) {
  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"]

  const agencyRevenueData = useMemo(() => {
    const approvedAgencies = agencies.filter(agency => agency.status === 'approved')
    return approvedAgencies.map((agency) => {
      const agencyTickets = tickets.filter((t) => t.agencyId === agency.id)
      const revenue = agencyTickets.reduce((sum, ticket) => sum + Number.parseFloat(ticket.fare || 0), 0)
      return {
        name: agency.name || agency.code,
        code: agency.code,
        revenue,
        tickets: agencyTickets.length,
      }
    })
  }, [agencies, tickets])

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart - Revenue Distribution */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-purple-600" />
            Revenue Distribution by Agency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={agencyRevenueData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, revenue }) => `${name}: ₹${Number(revenue).toFixed(0)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
              >
                {agencyRevenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
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
              <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (₹)" />
              <Bar dataKey="tickets" fill="#10b981" name="Tickets" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Trend Graph */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl lg:col-span-2">
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
              <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
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
    </div>
  )
}
