import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TicketIcon, TrendingUp, Clock } from "lucide-react"

interface ConductorStatsProps {
  tickets: any[]
}

export default function ConductorStats({ tickets }: ConductorStatsProps) {
  const totalTickets = tickets.length
  const totalEarnings = tickets.reduce((sum, t) => sum + Number.parseFloat(t.fare || 0), 0)
  const todayTickets = tickets.filter((t) => {
    const ticketDate = new Date(t.createdAt).toDateString()
    const today = new Date().toDateString()
    return ticketDate === today
  }).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <TicketIcon className="w-4 h-4" />
            Total Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{totalTickets}</div>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Total Earnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">₹{totalEarnings.toFixed(2)}</div>
          <p className="text-xs text-gray-500 mt-1">Commission earned</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{todayTickets}</div>
          <p className="text-xs text-gray-500 mt-1">Tickets generated</p>
        </CardContent>
      </Card>
    </div>
  )
}
