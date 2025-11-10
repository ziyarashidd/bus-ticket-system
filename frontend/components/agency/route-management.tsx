"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Trash2, Plus, ArrowRight, Edit } from "lucide-react"
import { createRoute, deleteRoute } from "@/lib/db"

const API_BASE_URL = 'http://localhost:3001/api'

interface RouteManagementProps {
  agencyId: string
  routes: any[]
  onRouteAdded: () => void
}

export default function RouteManagement({ agencyId, routes, onRouteAdded }: RouteManagementProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingRoute, setEditingRoute] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    source: "",
    destination: "",
    fare: "",
    distance: "",
    estimatedTime: "",
    subRoutes: [{ stop: "", fare: "", distance: "" }],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.code || !formData.source || !formData.destination || !formData.fare) {
      setError("Please fill all required fields")
      return
    }

    setLoading(true)
    try {
      const url = editingRoute ? `${API_BASE_URL}/routes` : `${API_BASE_URL}/routes`
      const method = editingRoute ? 'PUT' : 'POST'
      const body = editingRoute
        ? {
            id: editingRoute.id,
            code: formData.code,
            source: formData.source,
            destination: formData.destination,
            fare: Number(formData.fare),
            distance: Number(formData.distance) || 0,
            estimatedTime: Number(formData.estimatedTime) || 0,
            subRoutes: formData.subRoutes.filter(sr => sr.stop && sr.fare && sr.distance).map(sr => ({
              stop: sr.stop,
              fare: Number(sr.fare),
              distance: Number(sr.distance)
            })),
          }
        : {
            agencyId,
            code: formData.code,
            source: formData.source,
            destination: formData.destination,
            fare: Number(formData.fare),
            distance: Number(formData.distance) || 0,
            estimatedTime: Number(formData.estimatedTime) || 0,
            subRoutes: formData.subRoutes.filter(sr => sr.stop && sr.fare && sr.distance).map(sr => ({
              stop: sr.stop,
              fare: Number(sr.fare),
              distance: Number(sr.distance)
            })),
          }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${editingRoute ? 'update' : 'create'} route`)
      }

      setFormData({
        code: "",
        source: "",
        destination: "",
        fare: "",
        distance: "",
        estimatedTime: "",
        subRoutes: [{ stop: "", fare: "", distance: "" }],
      })
      setShowForm(false)
      setEditingRoute(null)
      onRouteAdded()
    } catch (err) {
      setError(`Failed to ${editingRoute ? 'update' : 'add'} route`)
      console.error(`[v0] Error ${editingRoute ? 'updating' : 'adding'} route:`, err)
    } finally {
      setLoading(false)
    }
  }

  const addSubRoute = () => {
    setFormData({
      ...formData,
      subRoutes: [...formData.subRoutes, { stop: "", fare: "", distance: "" }]
    })
  }

  const removeSubRoute = (index: number) => {
    setFormData({
      ...formData,
      subRoutes: formData.subRoutes.filter((_, i) => i !== index)
    })
  }

  const updateSubRoute = (index: number, field: string, value: string) => {
    const updated = [...formData.subRoutes]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, subRoutes: updated })
  }

  const handleEdit = (route: any) => {
    setEditingRoute(route)
    setFormData({
      code: route.code,
      source: route.source,
      destination: route.destination,
      fare: route.fare.toString(),
      distance: route.distance.toString(),
      estimatedTime: route.estimatedTime.toString(),
      subRoutes: route.subRoutes && route.subRoutes.length > 0 ? route.subRoutes.map((sr: any) => ({
        stop: sr.stop,
        fare: sr.fare.toString(),
        distance: sr.distance.toString()
      })) : [{ stop: "", fare: "", distance: "" }],
    })
    setShowForm(true)
  }

  const handleDelete = async (routeId: string) => {
    if (confirm("Are you sure you want to delete this route?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/routes?id=${routeId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete route')
        }

        onRouteAdded()
      } catch (err) {
        console.error("[v0] Error deleting route:", err)
        alert("Failed to delete route")
      }
    }
  }

  return (
    <div className="space-y-4">
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add New Route
        </Button>
      ) : (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">{editingRoute ? 'Edit Route' : 'Add New Route'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Route Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., R101"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fare">Fare (₹)</Label>
                  <Input
                    id="fare"
                    type="number"
                    placeholder="e.g., 250"
                    value={formData.fare}
                    onChange={(e) => setFormData({ ...formData, fare: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    placeholder="e.g., Pune"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Mumbai"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    placeholder="e.g., 150"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Est. Time (hours)</Label>
                  <Input
                    id="time"
                    type="number"
                    placeholder="e.g., 3"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Sub Routes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Sub Routes (Optional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSubRoute}
                    disabled={loading}
                    className="gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Stop
                  </Button>
                </div>

                {formData.subRoutes.map((subRoute, index) => (
                  <Card key={index} className="p-3 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Stop {index + 1}</span>
                      {formData.subRoutes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSubRoute(index)}
                          className="text-red-600 hover:bg-red-50 ml-auto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor={`stop-${index}`} className="text-xs">Stop Name</Label>
                        <Input
                          id={`stop-${index}`}
                          placeholder="e.g., Nashik"
                          value={subRoute.stop}
                          onChange={(e) => updateSubRoute(index, "stop", e.target.value)}
                          disabled={loading}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`subfare-${index}`} className="text-xs">Fare (₹)</Label>
                        <Input
                          id={`subfare-${index}`}
                          type="number"
                          placeholder="e.g., 150"
                          value={subRoute.fare}
                          onChange={(e) => updateSubRoute(index, "fare", e.target.value)}
                          disabled={loading}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`subdistance-${index}`} className="text-xs">Distance (km)</Label>
                        <Input
                          id={`subdistance-${index}`}
                          type="number"
                          placeholder="e.g., 200"
                          value={subRoute.distance}
                          onChange={(e) => updateSubRoute(index, "distance", e.target.value)}
                          disabled={loading}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (editingRoute ? "Updating..." : "Adding...") : (editingRoute ? "Update Route" : "Add Route")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingRoute(null)
                    setFormData({
                      code: "",
                      source: "",
                      destination: "",
                      fare: "",
                      distance: "",
                      estimatedTime: "",
                      subRoutes: [{ stop: "", fare: "", distance: "" }],
                    })
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

      {/* Routes List */}
      <div className="space-y-3">
        {routes.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-8">No routes added yet.</p>
        ) : (
          routes.map((route) => (
            <Card key={route.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">{route.code}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">₹{route.fare}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{route.source}</span>
                      <ArrowRight className="w-4 h-4" />
                      <span>{route.destination}</span>
                    </div>
                    {route.distance > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {route.distance} km • {route.estimatedTime}h
                      </p>
                    )}
                    {route.subRoutes && route.subRoutes.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Stops:</p>
                        <div className="flex flex-wrap gap-1">
                          {route.subRoutes.map((subRoute: any, idx: number) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {subRoute.stop} (₹{subRoute.fare})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(route)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(route.id)}
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
