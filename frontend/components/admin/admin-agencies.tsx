"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Plus, Trash2, Edit2, RefreshCw, Eye, Building2, MapPin, Phone, Mail, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
// Removed localStorage imports - now using API calls

// API-based functions for backend integration
const API_BASE_URL = 'http://localhost:3001/api'

const createAgencyAPI = async (agencyData: any) => {
  const response = await fetch(`${API_BASE_URL}/agencies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(agencyData),
  })

  if (!response.ok) {
    throw new Error("Failed to create agency")
  }

  return response.json()
}

const updateAgencyAPI = async (id: string, agencyData: any) => {
  const response = await fetch(`${API_BASE_URL}/agencies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(agencyData),
  })

  if (!response.ok) {
    throw new Error("Failed to update agency")
  }

  return response.json()
}

const deleteAgencyAPI = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/agencies/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete agency")
  }

  return response.json()
}

interface AdminAgenciesProps {
  agencies: any[]
  onDataChange: () => void
  title?: string
}

export default function AdminAgencies({ agencies, onDataChange, title }: AdminAgenciesProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    username: "",
    password: "",
    email: "",
    phone: "",
  })

  const generateAgencyCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let code = ""
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, code })
  }

  const handleEditAgency = (agency: any) => {
    setEditingId(agency.id)
    setFormData({
      name: agency.name,
      code: agency.code,
      username: agency.username,
      password: "",
      email: agency.email || "",
      phone: agency.phone || "",
    })
    setShowForm(true)
  }

  const handleDeleteAgency = async (agencyId: string) => {
    if (!confirm("Are you sure you want to delete this agency? All associated data will be removed.")) {
      return
    }

    setLoading(true)
    try {
      await deleteAgencyAPI(agencyId)
      onDataChange()
      setError("")
    } catch (err) {
      setError("Failed to delete agency")
      console.error("Error deleting agency:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.code || !formData.username) {
      setError("Please fill all required fields")
      return
    }

    if (!editingId && !formData.password) {
      setError("Password is required for new agencies")
      return
    }

    setLoading(true)
    try {
      if (editingId) {
        await updateAgencyAPI(editingId, {
          name: formData.name,
          code: formData.code.toUpperCase(),
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          ...(formData.password && { password: formData.password }),
        })
      } else {
        await createAgencyAPI({
          code: formData.code.toUpperCase(),
          name: formData.name,
          username: formData.username,
          password: formData.password,
          email: formData.email,
          phone: formData.phone,
        })
      }

      setFormData({
        name: "",
        code: "",
        username: "",
        password: "",
        email: "",
        phone: "",
      })
      setShowForm(false)
      setEditingId(null)
      onDataChange()
    } catch (err) {
      setError("Failed to save agency")
      console.error("Error saving agency:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: "", code: "", username: "", password: "", email: "", phone: "" }); }} className="gap-2">
        <Plus className="w-4 h-4" />
        Add New Agency
      </Button>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Agency' : 'Add New Agency'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Agency Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Agency Code *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      required
                    />
                    <Button type="button" onClick={generateAgencyCode} variant="outline">
                      Generate
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
                {!editingId && (
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingId ? 'Update Agency' : 'Add Agency'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="text-sm text-gray-600">
              Total: {agencies.length} {agencies.length === 1 ? 'agency' : 'agencies'}
            </div>
          </div>
        )}
        {agencies.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-8">No agencies found.</p>
        ) : (
          agencies.map((agency) => (
            <Card key={agency.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{agency.name}</p>
                    <p className="text-sm text-gray-600">Code: {agency.code}</p>
                    <p className="text-sm text-gray-600">Username: {agency.username}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Buses: {agency.buses?.length || 0} | Routes: {agency.routes?.length || 0}
                    </p>
                    {agency.status && (
                      <p className="text-xs text-gray-500 mt-1">
                        Status: <span className={`font-medium ${
                          agency.status === 'approved' ? 'text-green-600' :
                          agency.status === 'rejected' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>{agency.status}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            Agency Details
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-900">Company Information</h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Name:</span> {agency.name}</p>
                                <p><span className="font-medium">Code:</span> {agency.code}</p>
                                <p><span className="font-medium">Legal Status:</span> {agency.legalStatus || 'N/A'}</p>
                                <p><span className="font-medium">Established:</span> {agency.yearOfEstablishment || 'N/A'}</p>
                                {agency.companyRegistrationNumber && (
                                  <p><span className="font-medium">Registration:</span> {agency.companyRegistrationNumber}</p>
                                )}
                                {agency.gstTaxId && (
                                  <p><span className="font-medium">GST/Tax ID:</span> {agency.gstTaxId}</p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-900">Contact Information</h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Admin:</span> {agency.adminName || 'N/A'}</p>
                                <p><span className="font-medium">Designation:</span> {agency.adminDesignation || 'N/A'}</p>
                                <p><span className="font-medium">Email:</span> {agency.adminEmail || agency.email || 'N/A'}</p>
                                <p><span className="font-medium">Phone:</span> {agency.adminPhone || agency.phone || 'N/A'}</p>
                                {agency.alternatePhone && (
                                  <p><span className="font-medium">Alternate:</span> {agency.alternatePhone}</p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-900">Address</h4>
                              <div className="space-y-2 text-sm">
                                <p>{agency.headOfficeAddress || 'N/A'}</p>
                                <p>{agency.city || 'N/A'}, {agency.state || 'N/A'} - {agency.pincode || 'N/A'}</p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-900">Operations</h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Total Buses:</span> {agency.totalBuses || 'N/A'}</p>
                                <p><span className="font-medium">Bus Types:</span> {Array.isArray(agency.primaryBusTypes) ? agency.primaryBusTypes.join(', ') : (agency.primaryBusTypes || 'N/A')}</p>
                                <p><span className="font-medium">Ticketing:</span> {agency.currentTicketingMethod || 'N/A'}</p>
                                {agency.expectedGoLiveDate && (
                                  <p><span className="font-medium">Go-Live Date:</span> {agency.expectedGoLiveDate}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Key Operating Routes</h4>
                            <p className="text-sm text-gray-700">{agency.keyOperatingRoutes || 'N/A'}</p>
                          </div>

                          {agency.specificRequirements && (
                            <div className="space-y-4">
                              <h4 className="font-semibold text-gray-900">Specific Requirements</h4>
                              <p className="text-sm text-gray-700">{agency.specificRequirements}</p>
                            </div>
                          )}

                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Status Information</h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium">Status:</span> <Badge variant={agency.status === 'approved' ? 'default' : agency.status === 'rejected' ? 'destructive' : 'secondary'}>{agency.status || 'N/A'}</Badge></p>
                              {agency.reviewedAt && (
                                <p><span className="font-medium">Reviewed At:</span> {new Date(agency.reviewedAt).toLocaleString()}</p>
                              )}
                              {agency.reviewedBy && (
                                <p><span className="font-medium">Reviewed By:</span> {agency.reviewedBy}</p>
                              )}
                              {agency.rejectionReason && (
                                <div className="mt-2">
                                  <p className="font-medium text-red-600">Rejection Reason:</p>
                                  <p className="text-sm text-gray-700 bg-red-50 p-2 rounded">{agency.rejectionReason}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAgency(agency)}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAgency(agency.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
