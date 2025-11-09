"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Eye, Building2, MapPin, Phone, Mail, User, Filter } from "lucide-react"
import { getAuthUser } from "@/lib/auth"

interface AgencyRequest {
  id: string
  name: string
  code: string
  email: string
  phone: string
  legalStatus: string
  yearOfEstablishment: number
  companyRegistrationNumber?: string
  gstTaxId?: string
  headOfficeAddress: string
  city: string
  state: string
  pincode: string
  adminName: string
  adminDesignation: string
  adminEmail: string
  adminPhone: string
  alternatePhone?: string
  totalBuses: number
  primaryBusTypes: string[]
  keyOperatingRoutes: string
  currentTicketingMethod: string
  expectedGoLiveDate?: string
  specificRequirements?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  rejectionReason?: string
}

interface AgencyRequestsProps {
  onDataChange?: () => void
}

export default function AgencyRequests({ onDataChange }: AgencyRequestsProps) {
  const [requests, setRequests] = useState<AgencyRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<AgencyRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<AgencyRequest | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    loadRequests()
  }, [])

  useEffect(() => {
    if (filter === 'all') {
      setFilteredRequests(requests)
    } else {
      setFilteredRequests(requests.filter(request => request.status === filter))
    }
  }, [requests, filter])

  const loadRequests = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/agencies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setRequests(data.agencies || [])
      } else {
        console.error('Failed to load agencies:', response.statusText)
      }
    } catch (error) {
      console.error('Error loading agencies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (agencyId: string) => {
    setIsApproving(true)
    try {
      const user = getAuthUser()
      if (!user) return

      const response = await fetch(`/api/agencies/${agencyId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminId: user.id }),
      })

      if (response.ok) {
        await loadRequests()
        onDataChange?.()
        setSelectedRequest(null)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to approve agency')
      }
    } catch (error) {
      console.error('Error approving agency:', error)
      alert('Failed to approve agency')
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async (agencyId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    setIsRejecting(true)
    try {
      const user = getAuthUser()
      if (!user) return

      const response = await fetch(`/api/agencies/${agencyId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminId: user.id, reason: rejectionReason }),
      })

      if (response.ok) {
        await loadRequests()
        onDataChange?.()
        setSelectedRequest(null)
        setRejectionReason("")
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to reject agency')
      }
    } catch (error) {
      console.error('Error rejecting agency:', error)
      alert('Failed to reject agency')
    } finally {
      setIsRejecting(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading agency requests...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          All ({requests.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
          className="gap-2"
        >
          <Eye className="w-4 h-4" />
          Pending ({requests.filter(r => r.status === 'pending').length})
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilter('approved')}
          className="gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Approved ({requests.filter(r => r.status === 'approved').length})
        </Button>
        <Button
          variant={filter === 'rejected' ? 'default' : 'outline'}
          onClick={() => setFilter('rejected')}
          className="gap-2"
        >
          <XCircle className="w-4 h-4" />
          Rejected ({requests.filter(r => r.status === 'rejected').length})
        </Button>
      </div>

      {filteredRequests.length === 0 ? (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
          <CardContent className="text-center py-8">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No Requests' : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Requests`}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' ? 'No agency requests found.' : `No ${filter} agency requests found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
                      <Badge variant="secondary">{request.code}</Badge>
                      <Badge variant="outline">{request.legalStatus}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{request.adminName} ({request.adminDesignation})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{request.adminEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{request.adminPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{request.city}, {request.state}</span>
                      </div>
                      <div>
                        <span className="font-medium">Buses:</span> {request.totalBuses}
                      </div>
                      <div>
                        <span className="font-medium">Established:</span> {request.yearOfEstablishment}
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Routes:</span> {request.keyOperatingRoutes}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Ticketing:</span> {request.currentTicketingMethod}
                      </p>
                      <div className="mt-2">
                        <Badge variant={
                          request.status === 'approved' ? 'default' :
                          request.status === 'rejected' ? 'destructive' :
                          'secondary'
                        }>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            Agency Registration Details
                          </DialogTitle>
                        </DialogHeader>
                        {selectedRequest && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900">Company Information</h4>
                                <div className="space-y-2 text-sm">
                                  <p><span className="font-medium">Name:</span> {selectedRequest.name}</p>
                                  <p><span className="font-medium">Code:</span> {selectedRequest.code}</p>
                                  <p><span className="font-medium">Legal Status:</span> {selectedRequest.legalStatus}</p>
                                  <p><span className="font-medium">Established:</span> {selectedRequest.yearOfEstablishment}</p>
                                  {selectedRequest.companyRegistrationNumber && (
                                    <p><span className="font-medium">Registration:</span> {selectedRequest.companyRegistrationNumber}</p>
                                  )}
                                  {selectedRequest.gstTaxId && (
                                    <p><span className="font-medium">GST/Tax ID:</span> {selectedRequest.gstTaxId}</p>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900">Contact Information</h4>
                                <div className="space-y-2 text-sm">
                                  <p><span className="font-medium">Admin:</span> {selectedRequest.adminName}</p>
                                  <p><span className="font-medium">Designation:</span> {selectedRequest.adminDesignation}</p>
                                  <p><span className="font-medium">Email:</span> {selectedRequest.adminEmail}</p>
                                  <p><span className="font-medium">Phone:</span> {selectedRequest.adminPhone}</p>
                                  {selectedRequest.alternatePhone && (
                                    <p><span className="font-medium">Alternate:</span> {selectedRequest.alternatePhone}</p>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900">Address</h4>
                                <div className="space-y-2 text-sm">
                                  <p>{selectedRequest.headOfficeAddress}</p>
                                  <p>{selectedRequest.city}, {selectedRequest.state} - {selectedRequest.pincode}</p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900">Operations</h4>
                                <div className="space-y-2 text-sm">
                                  <p><span className="font-medium">Total Buses:</span> {selectedRequest.totalBuses}</p>
                                  <p><span className="font-medium">Bus Types:</span> {Array.isArray(selectedRequest.primaryBusTypes) ? selectedRequest.primaryBusTypes.join(', ') : (selectedRequest.primaryBusTypes || 'N/A')}</p>
                                  <p><span className="font-medium">Ticketing:</span> {selectedRequest.currentTicketingMethod}</p>
                                  {selectedRequest.expectedGoLiveDate && (
                                    <p><span className="font-medium">Go-Live Date:</span> {selectedRequest.expectedGoLiveDate}</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-900">Key Operating Routes</h4>
                              <p className="text-sm text-gray-700">{selectedRequest.keyOperatingRoutes}</p>
                            </div>

                            {selectedRequest.specificRequirements && (
                              <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900">Specific Requirements</h4>
                                <p className="text-sm text-gray-700">{selectedRequest.specificRequirements}</p>
                              </div>
                            )}

                            {selectedRequest.status === 'pending' && (
                              <div className="flex gap-3 pt-4 border-t">
                                <Button
                                  onClick={() => handleApprove(selectedRequest.id)}
                                  disabled={isApproving}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  {isApproving ? 'Approving...' : 'Approve'}
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="destructive" disabled={isRejecting}>
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Reject Agency Request</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="rejectionReason">Reason for Rejection *</Label>
                                        <Textarea
                                          id="rejectionReason"
                                          value={rejectionReason}
                                          onChange={(e) => setRejectionReason(e.target.value)}
                                          placeholder="Please provide a detailed reason for rejection..."
                                          required
                                        />
                                      </div>
                                      <div className="flex gap-3">
                                        <Button
                                          onClick={() => handleReject(selectedRequest.id)}
                                          variant="destructive"
                                          disabled={isRejecting || !rejectionReason.trim()}
                                        >
                                          {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
