import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bus, MapPin, TicketIcon } from "lucide-react"

interface AgencyStatsProps {
  buses: any[]
  routes: any[]
}

export default function AgencyStats({ buses, routes }: AgencyStatsProps) {
  const totalCapacity = buses.reduce((sum, bus) => sum + bus.capacity, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Bus className="w-4 h-4" />
            Total Buses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{buses.length}</div>
          <p className="text-xs text-gray-500 mt-1">{totalCapacity} total seats</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Total Routes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{routes.length}</div>
          <p className="text-xs text-gray-500 mt-1">Active routes</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <TicketIcon className="w-4 h-4" />
            Ready to Operate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{buses.length > 0 && routes.length > 0 ? "✓" : "—"}</div>
          <p className="text-xs text-gray-500 mt-1">
            {buses.length > 0 && routes.length > 0 ? "All set!" : "Add buses & routes"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
