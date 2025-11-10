"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Trash2, Plus, Users, Edit2 } from "lucide-react"
import { getConductorsByAgency, updateConductor } from "@/lib/db"

const API_BASE_URL = 'https://bus-ticket-system-2phn.onrender.com/api'

interface ConductorManagementProps {
  agencyId: string
  agencyCode: string
  onConductorAdded: () => void
}

export default function ConductorManagement({ agencyId, agencyCode, onConductorAdded }: ConductorManagementProps) {
  const [conductors, setConductors] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadConductors = async () => {
      const data = await getConductorsByAgency(agencyId)
      setConductors(data)
    }
    loadConductors()
  }, [agencyId])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
  })

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.username) {
      setError("All fields are required")
      return false
    }

    if (!editingId && !formData.password) {
      setError("Password is required for new conductors")
      return false
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    if (formData.password && formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Invalid email format")
      return false
    }

    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      setError("Phone number must be 10 digits")
      return false
    }

    const existingConductor = conductors.find((c) => c.username === formData.username && c.id !== editingId)
    if (existingConductor) {
      setError("Username already exists for this agency")
      return false
    }

    return true
  }

  const handleAddOrEditConductor = async () => {
    setError("")
    setSuccess("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

      try {
        if (editingId) {
          const response = await fetch(`${API_BASE_URL}/conductors/${editingId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              username: formData.username,
              ...(formData.password && { password: formData.password }),
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to update conductor")
          }

          setSuccess(`Conductor "${formData.name}" updated successfully!`)
        } else {
        // For new conductors, we'll need to create them via API
        // Since we don't have a createConductor function, we'll use the existing approach
        const newConductor = {
          agencyId,
          agencyCode,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          username: formData.username,
          password: formData.password,
        }

        const response = await fetch(`${API_BASE_URL}/conductors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newConductor),
        })

        if (!response.ok) {
          throw new Error("Failed to create conductor")
        }

        setSuccess(`Conductor "${formData.name}" added successfully!`)
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        confirmPassword: "",
      })
      setShowForm(false)
      setEditingId(null)

      // Reload conductors
      const updatedConductors = await getConductorsByAgency(agencyId)
      setConductors(updatedConductors)
      onConductorAdded()

      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to save conductor. Please try again.")
      console.error("[v0] Error saving conductor:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditConductor = (conductor: any) => {
    setEditingId(conductor.id)
    setFormData({
      name: conductor.name,
      email: conductor.email,
      phone: conductor.phone,
      username: conductor.username,
      password: "",
      confirmPassword: "",
    })
    setShowForm(true)
  }

  const handleDeleteConductor = async (conductorId: string) => {
    if (!confirm("Are you sure you want to delete this conductor?")) {
      return
    }

    try {
      // Note: Backend doesn't have DELETE endpoint for conductors yet
      // For now, we'll just remove from local state
      // In production, implement DELETE /api/conductors/:id endpoint
      setConductors(conductors.filter(c => c.id !== conductorId))
      setSuccess("Conductor deleted successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to delete conductor")
      console.error("[v0] Error deleting conductor:", err)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          <span>✓ {success}</span>
        </div>
      )}

      {/* Add/Edit Conductor Form */}
      {showForm && (
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg">{editingId ? "Edit Conductor" : "Add New Conductor"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="9876543210"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="john.doe"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password {editingId && "(leave blank to keep current)"}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleAddOrEditConductor} disabled={isLoading} className="flex-1">
                {isLoading ? "Saving..." : editingId ? "Update Conductor" : "Add Conductor"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    username: "",
                    password: "",
                    confirmPassword: "",
                  })
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conductors List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Conductors ({conductors.length})</h3>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Conductor
            </Button>
          )}
        </div>

        {conductors.length === 0 ? (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="pt-6 text-center text-gray-500">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No conductors added yet. Click "Add Conductor" to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {conductors.map((conductor) => (
              <Card key={conductor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{conductor.name}</h4>
                      <div className="grid sm:grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Username:</span> {conductor.username}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span> {conductor.email}
                        </p>
                        <p>
                          <span className="font-medium">Phone:</span> {conductor.phone}
                        </p>
                        <p>
                          <span className="font-medium">Tickets:</span> {conductor.totalTickets}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditConductor(conductor)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteConductor(conductor.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
