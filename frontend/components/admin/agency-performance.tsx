import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, TrendingUp } from "lucide-react"

interface AgencyPerformanceProps {
  agencies: any[]
  tickets: any[]
}

export default function AgencyPerformance({ agencies, tickets }: AgencyPerformanceProps) {
  const approvedAgencies = agencies.filter(agency => agency.status === 'approved')
  const agencyStats = approvedAgencies.map((agency) => {
    const agencyTickets = tickets.filter((t) => t.agencyId === agency.id)
    const revenue = agencyTickets.reduce((sum, ticket) => sum + Number.parseFloat(ticket.fare || 0), 0)
    return {
      ...agency,
      ticketCount: agencyTickets.length,
      revenue,
    }
  })

  const topAgencies = agencyStats.sort((a, b) => b.revenue - a.revenue).slice(0, 5)

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          Top Agencies by Revenue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topAgencies.length === 0 ? (
            <p className="text-sm text-gray-600 text-center py-8">No agencies with revenue yet.</p>
          ) : (
            topAgencies.map((agency, index) => (
              <div
                key={agency.id}
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
                  <p className="text-sm text-gray-600 flex items-center justify-end gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {agency.ticketCount} tickets
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
