"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ChevronDown } from "lucide-react"
import { useState } from "react"

interface ConductorPerformanceDetailedProps {
  conductors: any[]
  tickets: any[]
  routes: any[]
}

export default function ConductorPerformanceDetailed({
  conductors,
  tickets,
  routes,
}: ConductorPerformanceDetailedProps) {
  const [expandedConductor, setExpandedConductor] = useState<string | null>(null)

  const conductorStats = conductors.map((conductor) => {
    const conductorTickets = tickets.filter((t) => t.conductorId === conductor.id)
    const earnings = conductorTickets.reduce((sum, t) => sum + (Number.parseFloat(t.fare) || 0), 0)

    return {
      ...conductor,
      ticketCount: conductorTickets.length,
      earnings,
      tickets: conductorTickets,
    }
  })

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Conductor Performance Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        {conductorStats.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-8">No conductors assigned yet.</p>
        ) : (
          <div className="space-y-4">
            {conductorStats.map((conductor) => (
              <div key={conductor.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Conductor Summary */}
                <button
                  onClick={() => setExpandedConductor(expandedConductor === conductor.id ? null : conductor.id)}
                  className="w-full p-4 hover:bg-gray-50 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                      {conductor.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{conductor.name}</div>
                      <div className="text-xs text-gray-500">{conductor.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{conductor.ticketCount} tickets</div>
                      <div className="text-sm font-bold text-green-600">₹{conductor.earnings.toFixed(2)}</div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedConductor === conductor.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Ticket Details */}
                {expandedConductor === conductor.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    {conductor.tickets.length === 0 ? (
                      <p className="text-sm text-gray-600 text-center py-4">No tickets generated yet.</p>
                    ) : (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 text-sm mb-3">Recent Tickets</h4>
                        {conductor.tickets
                          .slice(-5)
                          .reverse()
                          .map((ticket: any) => {
                            const route = routes.find((r) => r.id === ticket.routeId)
                            return (
                              <div key={ticket.id} className="bg-white p-3 rounded border border-gray-200 text-sm">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <div className="font-semibold text-gray-900">
                                      {ticket.source} → {ticket.destination}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-green-600">₹{ticket.fare}</div>
                                    <div className="text-xs text-gray-600">Seat {ticket.seat}</div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-600">
                                  Passenger: {ticket.passengerName} ({ticket.passengerPhone})
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
