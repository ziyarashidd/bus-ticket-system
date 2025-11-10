"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

interface RevenueChartsProps {
  conductors: any[]
  tickets: any[]
}

export default function RevenueCharts({ conductors, tickets }: RevenueChartsProps) {
  // Prepare pie chart data - conductor revenue distribution
  const conductorRevenueData = conductors.map((conductor) => {
    const conductorTickets = tickets.filter((t) => t.conductorId === conductor.id)
    const earnings = conductorTickets.reduce((sum, t) => sum + (Number.parseFloat(t.fare) || 0), 0)
    return {
      name: conductor.name,
      value: earnings,
    }
  })

  // Prepare bar chart data - daily revenue for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date
  })

  const dailyRevenueData = last7Days.map((date) => {
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    const dayTickets = tickets.filter((t) => {
      const ticketDate = new Date(t.createdAt)
      return ticketDate >= dayStart && ticketDate <= dayEnd
    })

    const revenue = dayTickets.reduce((sum, t) => sum + (Number.parseFloat(t.fare) || 0), 0)

    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: revenue,
    }
  })

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart - Conductor Revenue Distribution */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg">Revenue by Conductor</CardTitle>
        </CardHeader>
        <CardContent>
          {conductorRevenueData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conductorRevenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₹${value.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {conductorRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Bar Chart - Daily Revenue Trend */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg">Revenue Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {dailyRevenueData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
