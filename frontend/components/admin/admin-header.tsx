"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, BarChart3, Bell } from "lucide-react"

interface AdminHeaderProps {
  onLogout: () => void
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  const [pendingAgencies, setPendingAgencies] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPendingAgencies = async () => {
      try {
        const response = await fetch('/api/agencies/pending', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setPendingAgencies(data.agencies || [])
        }
      } catch (error) {
        console.error('Error fetching pending agencies:', error)
      }
    }

    fetchPendingAgencies()
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingAgencies, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">System Management & Analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              {pendingAgencies.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {pendingAgencies.length}
                </Badge>
              )}
            </Button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 sm:right-0 left-0 sm:left-auto top-full mt-2 w-80 max-w-[calc(100vw-2rem)] sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {pendingAgencies.length > 0 ? (
                    <div className="space-y-2">
                      {pendingAgencies.slice(0, 3).map((agency) => (
                        <div key={agency.id} className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0" onClick={() => {
                          window.location.href = '/admin/dashboard?tab=requests'
                          setShowNotifications(false)
                        }}>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{agency.name}</p>
                              <p className="text-xs text-gray-600">{agency.city}, {agency.state}</p>
                              <p className="text-xs text-gray-500 mt-1">Pending approval</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {pendingAgencies.length > 3 && (
                        <div className="p-3 text-center text-gray-500 cursor-pointer hover:bg-gray-50" onClick={() => {
                          window.location.href = '/admin/dashboard?tab=requests'
                          setShowNotifications(false)
                        }}>
                          <p className="text-xs">+{pendingAgencies.length - 3} more pending requests</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <Button variant="outline" onClick={onLogout} className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
