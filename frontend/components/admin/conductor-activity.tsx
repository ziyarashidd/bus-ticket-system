import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Clock } from "lucide-react"

interface ConductorActivityProps {
  conductors: any[]
  tickets: any[]
}

export default function ConductorActivity({ conductors, tickets }: ConductorActivityProps) {
  const conductorStats = conductors.map((conductor) => {
    const conductorTickets = tickets.filter((t) => t.conductorId === conductor.id)
    const revenue = conductorTickets.reduce((sum, ticket) => sum + Number.parseFloat(ticket.fare || 0), 0)
    const lastTicket = conductorTickets.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0]

    return {
      ...conductor,
      ticketCount: conductorTickets.length,
      revenue,
      lastActive: lastTicket?.createdAt || conductor.createdAt,
    }
  })

  const topConductors = conductorStats.sort((a, b) => b.ticketCount - a.ticketCount).slice(0, 5)

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-orange-600" />
          Top Conductors Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topConductors.length === 0 ? (
            <p className="text-sm text-gray-600 text-center py-8">No conductor activity yet.</p>
          ) : (
            topConductors.map((conductor, index) => (
              <div
                key={conductor.id}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{conductor.name}</p>
                    <p className="text-xs text-gray-600">{conductor.email}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold text-gray-900">{conductor.ticketCount} tickets</p>
                  <p className="text-sm text-green-600 font-medium">₹{conductor.revenue.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(conductor.lastActive).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
