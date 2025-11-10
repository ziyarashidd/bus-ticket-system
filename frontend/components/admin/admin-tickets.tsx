import { Card, CardContent } from "@/components/ui/card"

interface AdminTicketsProps {
  tickets: any[]
}

export default function AdminTickets({ tickets }: AdminTicketsProps) {
  return (
    <div className="space-y-3">
      {tickets.length === 0 ? (
        <p className="text-sm text-gray-600 text-center py-8">No tickets generated yet.</p>
      ) : (
        tickets.slice(0, 20).map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{ticket.id}</p>
                  <p className="text-sm text-gray-600">
                    {ticket.source} → {ticket.destination}
                  </p>
                  <p className="text-sm text-gray-600">Conductor: {ticket.conductorName}</p>
                  <p className="text-xs text-gray-500 mt-1">Passenger: {ticket.passengerName}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold text-green-600">₹{ticket.fare}</p>
                  <p className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
