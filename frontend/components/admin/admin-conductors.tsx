import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface AdminConductorsProps {
  conductors: any[]
  agencies: any[]
}

export default function AdminConductors({ conductors, agencies }: AdminConductorsProps) {
  const getAgencyName = (agencyCode: string) => {
    return agencies.find((a) => a.code === agencyCode)?.name || agencyCode
  }

  return (
    <div className="space-y-3">
      {conductors.length === 0 ? (
        <p className="text-sm text-gray-600 text-center py-8">No conductors registered yet.</p>
      ) : (
        conductors.map((conductor) => (
          <Card key={conductor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{conductor.name}</p>
                  <p className="text-sm text-gray-600">{conductor.email}</p>
                  <p className="text-sm text-gray-600">Username: {conductor.username}</p>
                  <p className="text-xs text-gray-500 mt-1">Agency: {getAgencyName(conductor.agencyCode)}</p>
                </div>
                <div className="text-right space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900">{conductor.totalTickets || 0}</span>
                    <span className="text-gray-600 ml-1">tickets</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-green-600">₹{(conductor.totalEarnings || 0).toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    {conductor.lastActive ? new Date(conductor.lastActive).toLocaleDateString() : "Never"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
