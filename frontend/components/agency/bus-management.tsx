"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Trash2, Plus, Edit } from "lucide-react"
import { createBus, deleteBus } from "@/lib/db"

const API_BASE_URL = 'http://localhost:3001/api'

interface BusManagementProps {
  agencyId: string
  buses: any[]
  onBusAdded: () => void
}

export default function BusManagement({ agencyId, buses, onBusAdded }: BusManagementProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingBus, setEditingBus] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    plate: "",
    capacity: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.plate || !formData.capacity) {
      setError("Please fill all fields")
      return
    }

    setLoading(true)
    try {
      const url = editingBus ? `${API_BASE_URL}/buses` : `${API_BASE_URL}/buses`
      const method = editingBus ? 'PUT' : 'POST'
      const body = editingBus
        ? {
            id: editingBus.id,
            name: formData.name,
            plate: formData.plate.toUpperCase(),
            capacity: Number(formData.capacity),
          }
        : {
            agencyId,
            name: formData.name,
            plate: formData.plate.toUpperCase(),
            capacity: Number(formData.capacity),
            totalSeats: Number(formData.capacity),
          }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${editingBus ? 'update' : 'create'} bus`)
      }

      setFormData({ name: "", plate: "", capacity: "" })
      setShowForm(false)
      setEditingBus(null)
      onBusAdded()
    } catch (err) {
      setError(`Failed to ${editingBus ? 'update' : 'add'} bus`)
      console.error(`[v0] Error ${editingBus ? 'updating' : 'adding'} bus:`, err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (bus: any) => {
    setEditingBus(bus)
    setFormData({
      name: bus.name,
      plate: bus.plate,
      capacity: bus.capacity.toString(),
    })
    setShowForm(true)
  }

  const handleDelete = async (busId: string) => {
    if (confirm("Are you sure you want to delete this bus?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/buses?id=${busId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete bus')
        }

        onBusAdded()
      } catch (err) {
        console.error("[v0] Error deleting bus:", err)
        alert("Failed to delete bus")
      }
    }
  }

  return (
    <div className="space-y-4">
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add New Bus
        </Button>
      ) : (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">{editingBus ? 'Edit Bus' : 'Add New Bus'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Bus Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., CityLine A1"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plate">License Plate</Label>
                <Input
                  id="plate"
                  placeholder="e.g., MH-12-AB-1234"
                  value={formData.plate}
                  onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (Seats)</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="e.g., 40"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (editingBus ? "Updating..." : "Adding...") : (editingBus ? "Update Bus" : "Add Bus")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingBus(null)
                    setFormData({ name: "", plate: "", capacity: "" })
                  }}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Buses List */}
      <div className="space-y-3">
        {buses.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-8">No buses added yet.</p>
        ) : (
          buses.map((bus) => (
            <Card key={bus.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{bus.name}</p>
                    <p className="text-sm text-gray-600">Plate: {bus.plate}</p>
                    <p className="text-sm text-gray-600">Capacity: {bus.capacity} seats</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(bus)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(bus.id)}
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
