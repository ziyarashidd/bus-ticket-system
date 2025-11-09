"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Calendar } from "lucide-react"

interface TodayEarningsProps {
  tickets: any[]
}

export default function TodayEarnings({ tickets }: TodayEarningsProps) {
  // Get today's date at midnight
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Filter tickets from today
  const todayTickets = tickets.filter((ticket) => {
    const ticketDate = new Date(ticket.createdAt)
    ticketDate.setHours(0, 0, 0, 0)
    return ticketDate.getTime() === today.getTime()
  })

  const todayEarnings = todayTickets.reduce((sum, t) => sum + (Number.parseFloat(t.fare) || 0), 0)

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Today's Earnings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-4xl font-bold text-green-600">₹{todayEarnings.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">{todayTickets.length} tickets today</p>
          </div>
          <TrendingUp className="w-12 h-12 text-green-200" />
        </div>
      </CardContent>
    </Card>
  )
}
